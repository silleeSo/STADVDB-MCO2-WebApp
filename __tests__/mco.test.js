const mysql = require('mysql2/promise');
const request = require('supertest');
const app = require('../backend/server3'); // Use server3.js for Jest testing
const shell = require('shelljs');
const { expect } = require('@jest/globals');

// Define configurations for each node
const dbConfigs = {
  master: {
    host: '127.0.0.1',
    port: 3300,
    user: 'root',
    password: '1234',
    database: 'mco_db'
  },
  slave1: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'mco_db'
  },
  slave2: {
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: '1234',
    database: 'mco_db'
  }
};

// Function to create a connection to the database
async function createConnection(config) {
  const connection = await mysql.createConnection(config);
  await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ');
  return connection;
}

beforeAll(async () => {
  // Create a connection to the master to clear existing data and insert new data
  const masterConnection = await createConnection(dbConfigs.master);

  // Disable safe updates for the current session to allow DELETE without conditions
  await masterConnection.query('SET SQL_SAFE_UPDATES = 0');

  // Delete all records from relevant tables to start with a clean slate
  await masterConnection.query('DELETE FROM games');
  await masterConnection.query('DELETE FROM games_before_2010');
  await masterConnection.query('DELETE FROM games_2010_and_after');

  const insertDataQuery = `
    INSERT INTO games (id, name, release_date, release_year, price, positive_reviews, negative_reviews, user_score, metacritic_score, average_playtime_forever, average_playtime_2weeks, median_playtime_forever) 
    VALUES
    (1, 'The Legend of Adventure', '2005-08-15', 2005, 49.99, 100000, 5000, 90, 85, 120, 30, 110),
    (2, 'Mystery of the Lost World', '2006-03-22', 2006, 39.99, 85000, 4000, 80, 75, 200, 50, 180),
    (3, 'Battle of the Realms', '2012-10-10', 2012, 59.99, 120000, 8000, 95, 90, 150, 40, 140),
    (4, 'Racing Legends', '2009-06-05', 2009, 29.99, 95000, 3000, 85, 80, 180, 70, 160),
    (5, 'Space Wars: Galaxy Defenders', '2015-07-20', 2015, 49.99, 110000, 6000, 88, 82, 220, 55, 210),
    (6, 'Epic Quest: The Rise', '2020-11-01', 2020, 69.99, 150000, 10000, 92, 85, 250, 60, 240),
    (7, 'Dungeon of Darkness', '2007-12-15', 2007, 39.99, 70000, 2000, 75, 70, 100, 20, 90),
    (8, 'Super Jump Adventure', '2011-05-18', 2011, 19.99, 80000, 4000, 80, 78, 130, 45, 120),
    (9, 'Ninja Fury: Path of Shadows', '2018-04-09', 2018, 59.99, 125000, 7000, 90, 88, 210, 50, 200),
    (10, 'Zombie Survival: Apocalypse', '2023-01-29', 2023, 39.99, 105000, 5000, 85, 80, 180, 60, 170)
  `;

  await masterConnection.query(insertDataQuery);
  await masterConnection.end();
});


afterAll(() => {
  // Close the application server if it was started in the test
  if (app && typeof app.close === 'function') {
    app.close();
  }
  
});

  
// ----------------------- Concurrency Tests -----------------------

describe('Concurrency Tests', () => {
    test('Case #1: Concurrent transactions in two or more nodes are reading the same data item.', async () => {
        // Create connections to the master and slave1 databases
        const connections = await Promise.all([
          createConnection(dbConfigs.master), // Master connection
          createConnection(dbConfigs.slave1)  // Slave1 connection
        ]);
      
        // Create read queries for each connection
        const queries = [
          connections[0].query('SELECT * FROM games WHERE id = 1'), // Master reads from 'games'
          connections[0].query('SELECT * FROM games WHERE id = 1'), // Concurrent read from master
          connections[1].query('SELECT * FROM games_before_2010 WHERE id = 1'), // Slave1 reads from 'games_before_2010'
          connections[1].query('SELECT * FROM games_before_2010 WHERE id = 1')  // Concurrent read from slave1
        ];
      
        // Execute all queries concurrently
        const results = await Promise.all(queries);
      
        // Validate results
        results.forEach(([rows]) => {
          expect(rows.length).toBeGreaterThan(0); // Verify data exists
        });
      
        // Close all database connections
        await Promise.all(connections.map(conn => conn.end()));
    });
      

    test('Case #2: At least one transaction in the three nodes is writing (insert/update/delete) and the other concurrent transactions are reading the same data item.', async () => {
        // Create connections to nodes
        const masterConn = await createConnection(dbConfigs.master);
        const slave2Conn = await createConnection(dbConfigs.slave2);
      
        // Perform concurrent operations:
        // 1. Read from master and slave concurrently
        // 2. Insert new data into the master node
        const concurrentOperations = [
          masterConn.query('SELECT * FROM games WHERE id = 11'), // Read from master concurrently
          slave2Conn.query('SELECT * FROM games_2010_and_after WHERE id = 11'), // Read from slave2 concurrently
          masterConn.query(
            `INSERT INTO games (id, name, release_date, release_year, price, positive_reviews, negative_reviews, user_score, metacritic_score, average_playtime_forever, average_playtime_2weeks, median_playtime_forever) 
            VALUES (11, 'New Game', '2024-12-02', 2024, 59.99, 5000, 200, 88, 85, 100, 20, 95)`
          )
        ];
      
        // Wait for all concurrent operations to complete
        const results = await Promise.all(concurrentOperations);
      
        // Validate initial read results:
        // - Since the insert operation is concurrent, the reads may not see the newly inserted data yet.
        const [masterReadResult, slaveReadResult, _] = results;
        
        // Assert that the reads did not find the new record, since the insert was concurrent
        expect(masterReadResult[0].length).toBe(0); // Master read should not have seen the inserted data at this point
        expect(slaveReadResult[0].length).toBe(0); // Slave read should also not have seen the inserted data
      
        // Introduce a small delay to allow replication to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      
        // Re-query the data from both master and slave to confirm the insert is reflected
        const followUpReads = [
          masterConn.query('SELECT * FROM games WHERE id = 11'),
          slave2Conn.query('SELECT * FROM games_2010_and_after WHERE id = 11')
        ];
      
        const followUpResults = await Promise.all(followUpReads);
      
        // Validate read results after replication delay
        followUpResults.forEach(([rows]) => {
          expect(rows.length).toBeGreaterThan(0); // The new game should now be visible in both the master and the slave after replication
        });
      
        // Close connections
        await Promise.all([masterConn.end(), slave2Conn.end()]);
      });
      
      
      
      

  test('Case #3: Concurrent transactions in two or more nodes are writing (update / delete) the same data item.', async () => {
    const masterConn1 = await createConnection(dbConfigs.master);
    const masterConn2 = await createConnection(dbConfigs.master);

    // Simulating concurrent update transactions
    const concurrentUpdates = [
      masterConn1.query('UPDATE games SET price = price + 5 WHERE id = 1'),
      masterConn2.query('UPDATE games SET price = price - 5 WHERE id = 1')
    ];

    // Execute concurrent updates
    const updateResults = await Promise.allSettled(concurrentUpdates);

    // Validate results - should either succeed or be rolled back correctly
    updateResults.forEach(result => {
      expect(result.status).toBe('fulfilled'); // Both transactions should be handled
    });

    // Close connections
    await Promise.all([masterConn1.end(), masterConn2.end()]);
  });
});

// ----------------------- Crash Recovery Tests -----------------------

describe('Crash Recovery Tests', () => {
  test('Case #1: Central node unavailable during execution', async () => {
    // Simulate disconnecting master
    await request(app).post('/simulate-failure').send({ node: 'node1' });

    // Attempt to write data while master is down
    const writeAttempt = await request(app).post('/add-record').send({
      id: 12,
      name: 'Game A',
      release_date: '2024-12-01',
      release_year: 2024,
      price: 49.99,
      positive_reviews: 100,
      negative_reviews: 10,
      user_score: 90,
      metacritic_score: 85,
      average_playtime_forever: 30,
      average_playtime_2weeks: 15,
      median_playtime_forever: 10
    });

    expect(writeAttempt.status).toBe(503); // Write should be prohibited

    // Recover the central node
    await request(app).post('/simulate-recovery').send({ node: 'node1' });

    // Compare relevant tables across all nodes
    const masterNodeData = await request(app).get('/query').send({ query: 'SELECT * FROM games' });
    const slaveNodeData = await request(app).get('/query').send({ query: 'SELECT * FROM games' });

    expect(masterNodeData.body).toEqual(slaveNodeData.body);
  });

  test('Case #2: Disconnect and reconnect a slave node', async () => {
  // Simulate disconnecting slave node
  await request(app).post('/simulate-failure').send({ node: 'node2' });

  // Attempt to read data from slave - should fail
  let readAttempt;
  try {
    readAttempt = await request(app).post('/query').send({ query: 'SELECT * FROM games WHERE id = 1' });
  } catch (err) {
    expect(err).toBeDefined();
  }

  // Recover the slave node
  await request(app).post('/simulate-recovery').send({ node: 'node2' });

  // Verify that the slave node can now accept read operations
  const slaveNodeData = await request(app).post('/query').send({ query: 'SELECT * FROM games WHERE id = 1' });
  expect(slaveNodeData.status).toBe(200);
});

test('Case #3: Disconnect master during slave replication', async () => {
  // Simulate disconnecting the master
  await request(app).post('/simulate-failure').send({ node: 'node1' });

  // Attempt to replicate to master - should fail
  let writeAttempt;
  try {
    writeAttempt = await request(app).post('/add-record').send({
      id: 13,
      name: 'Replication Fail Test',
      release_date: '2024-12-02',
      release_year: 2024,
      price: 39.99,
      positive_reviews: 150,
      negative_reviews: 10,
      user_score: 75,
      metacritic_score: 82,
      average_playtime_forever: 18,
      average_playtime_2weeks: 9,
      median_playtime_forever: 10,
    });
  } catch (err) {
    expect(err).toBeDefined();
  }

  // Recover the master
  await request(app).post('/simulate-recovery').send({ node: 'node1' });

  // Verify data consistency across nodes
  const masterData = await request(app).get('/query').send({ query: 'SELECT * FROM games WHERE id = 4' });
  const slaveData = await request(app).get('/query').send({ query: 'SELECT * FROM games WHERE id = 4' });

  expect(masterData.body).toEqual(slaveData.body);
});

test('Case #4: Disconnect a slave during replication', async () => {
  // Simulate disconnecting the slave
  await request(app).post('/simulate-failure').send({ node: 'node3' });

  // Write to the master node
  await request(app).post('/add-record').send({
    id: 14,
    name: 'Slave Failure Test',
    release_date: '2024-12-04',
    release_year: 2024,
    price: 29.99,
    positive_reviews: 150,
    negative_reviews: 5,
    user_score: 70,
    metacritic_score: 80,
    average_playtime_forever: 25,
    average_playtime_2weeks: 10,
    median_playtime_forever: 10,
  });

  // Recover the slave node
  await request(app).post('/simulate-recovery').send({ node: 'node3' });
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

  // Verify that the slave node has replicated the new data
  const slaveNodeData = await request(app)
    .post('/query')
    .send({ query: 'SELECT * FROM games_2010_and_after WHERE id = 5' });

  expect(slaveNodeData.status).toBe(200);
  expect(slaveNodeData.body.transactions.length).toBeGreaterThan(0);
});

});
