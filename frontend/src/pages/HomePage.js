import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Steam Games Distributed Database System!</h1>
      <p class="text-center">What would you like to do today?</p>
      <br></br>
      {/* Create buttons for navigation */}
      <p class="text-center">
        <Link to="/add">
        <button type="button" class="btn btn-primary btn-lg">Add Records</button>
        </Link>
        <br />
      </p>

      <p class="text-center">
        <Link to="/delete">
        <button type="button" class="btn btn-primary btn-lg">Delete Records</button>
        </Link>
        <br />
      </p>
      
      <p class="text-center">
        <Link to="/update">
        <button type="button" class="btn btn-primary btn-lg">Update Records</button>
        </Link>
        <br />
      </p>

      <p class="text-center">
        <Link to="/search">
        <button type="button" class="btn btn-primary btn-lg">Search Records</button>
        </Link>
        <br />
      </p>

      <p class="text-center">
        <Link to="/report">
        <button type="button" class="btn btn-primary btn-lg">Check Reports</button>
        </Link>
        <br />
      </p> 

    </div>
  );
}

export default HomePage;
