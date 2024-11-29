from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Database configurations for each node
NODE_DB_CONFIGS = {
    'node1': {
        'host': 'localhost',
        'user': 'root',
        'password': '6761',
        'database': 'mco2_games_master'
    },
    'node2': {
        'host': 'localhost',
        'user': 'root',
        'password': '6761',
        'database': 'mco2_games_master'
    },
    'node3': {
        'host': 'localhost',
        'user': 'root',
        'password': '6761',
        'database': 'mco2_games_master'
    }
}

def execute_query(node, query):
    try:
        # Connect to the specified node's database
        conn = mysql.connector.connect(**NODE_DB_CONFIGS[node])
        cursor = conn.cursor()
        cursor.execute(query)
        
        # Fetch results for SELECT queries
        if query.strip().upper().startswith('SELECT'):
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            result = [dict(zip(columns, row)) for row in rows]
        else:
            conn.commit()
            result = f"Query executed on {node}: {cursor.rowcount} rows affected."
        
        cursor.close()
        conn.close()
        return result
    except mysql.connector.Error as e:
        return str(e)

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    query = data.get('query', '')

    # Determine the target node based on query logic
    target_node = 'node1'  # Default to central node
    if 'release_year < 2010' in query:
        target_node = 'node2'
    elif 'release_year >= 2010' in query:
        target_node = 'node3'

    result = execute_query(target_node, query)
    return jsonify({
        'node': target_node,
        'result': result
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
