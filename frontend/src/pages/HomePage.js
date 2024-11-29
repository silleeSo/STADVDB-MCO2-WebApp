import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Steam Games Distributed Database System!</h1>
      <p>What would you like to do today?</p>
      
      {/* Create buttons for navigation */}
      <Link to="/add">
        <button>Add records</button>
      </Link>
      <br />
      <Link to="/delete">
        <button>Delete records</button>
      </Link>
      <br />
      <Link to="/update">
        <button>Update records</button>
      </Link>
      <br />
      <Link to="/search">
        <button>Search for records</button>
      </Link>
      <br />
      <Link to="/report">
        <button>Report Directory</button>
      </Link>
      <br />

  
      

    </div>
  );
}

export default HomePage;
