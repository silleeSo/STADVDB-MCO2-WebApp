import React from 'react';
import { Link } from 'react-router-dom';
import createIcon from '../assets/create-icon.png'; 
import deleteIcon from '../assets/delete-icon.png'; 
import searchIcon from '../assets/search-icon.png'; 
import report1Icon from '../assets/report1.png'; 
import report2Icon from '../assets/report2.png'; 
import report3Icon from '../assets/report3.png'; 
import steamLogo from '../assets/steam-logo.png'; 
function HomePage() {
  return (
    <div className="container text-center mt-5">
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h1 className="me-3">Welcome to the Steam Games Distributed Database System!</h1>
        <img 
          src={steamLogo} 
          alt="Steam Logo" 
          style={{
            width: '50px', 
            height: '50px'
          }} 
        />
      </div>
      <p className="mb-5">What would you like to do today?</p>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {/* Add Record */}
        <div className="col">
          <Link to="/add" className="text-decoration-none">
            <div className="card h-100 text-center p-3 text-black" style={{
              backgroundImage: 'radial-gradient(circle, #4ec7f4, #5ac4f6, #66c1f6, #72bdf6, #7dbaf5, #7cb8f4, #7bb6f3, #7ab4f2, #6bb4f1, #5bb3f1, #46b3ef, #2ab2ed)',
              backgroundSize: 'cover',
              position: 'relative' // Set card to relative positioning
            }}>
              <img
                src={createIcon}
                alt="Create Icon"
                className="mx-auto mb-3"
                style={{ width: '50px', height: '50px' }}
              />
              <h5 className="card-title">Create</h5>
            </div>
          </Link>
        </div>


        {/* Delete or Update */}
        <div className="col">
          <Link to="/delete" className="text-decoration-none">
          <div className="card h-100 text-center p-3 text-black" style={{
              backgroundImage: 'radial-gradient(circle, #4ec7f4, #5ac4f6, #66c1f6, #72bdf6, #7dbaf5, #7cb8f4, #7bb6f3, #7ab4f2, #6bb4f1, #5bb3f1, #46b3ef, #2ab2ed)',
              backgroundSize: 'cover'
            }}>
              <img
                src={deleteIcon}
                alt="Delete Icon"
                className="mx-auto mb-3"
                style={{ width: '50px', height: '50px' }}
              />
              <h5 className="card-title">Delete or Update</h5>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="col">
          <Link to="/search" className="text-decoration-none">
          <div className="card h-100 text-center p-3 text-black" style={{
              backgroundImage: 'radial-gradient(circle, #4ec7f4, #5ac4f6, #66c1f6, #72bdf6, #7dbaf5, #7cb8f4, #7bb6f3, #7ab4f2, #6bb4f1, #5bb3f1, #46b3ef, #2ab2ed)',
              backgroundSize: 'cover'
            }}>
              <img
                src={searchIcon}
                alt="Search Icon"
                className="mx-auto mb-3"
                style={{ width: '50px', height: '50px' }}
              />
              <h5 className="card-title">Search</h5>
            </div>
          </Link>
        </div>
      </div>

      {/* Divider Section */}
      <hr className="my-5" />
      <h2 className="mb-4">Reports</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {/* Top Games by Engagement */}
        <div className="col">
          <Link to="/rp1" className="text-decoration-none">
          <div className="card h-100 text-center p-3 text-black" style={{
              backgroundImage: 'radial-gradient(circle, #4ec7f4, #5ac4f6, #66c1f6, #72bdf6, #7dbaf5, #7cb8f4, #7bb6f3, #7ab4f2, #6bb4f1, #5bb3f1, #46b3ef, #2ab2ed)',
              backgroundSize: 'cover'
            }}>
              <img
                src={report1Icon}
                alt="Report 1 Icon"
                className="mx-auto mb-3"
                style={{ width: '50px', height: '50px' }}
              />
              <h5 className="card-title">Top Games by Engagement</h5>
            </div>
          </Link>
        </div>

        {/* Revenue and Value Analysis */}
        <div className="col">
          <Link to="/rp2" className="text-decoration-none">
          <div className="card h-100 text-center p-3 text-black" style={{
              backgroundImage: 'radial-gradient(circle, #4ec7f4, #5ac4f6, #66c1f6, #72bdf6, #7dbaf5, #7cb8f4, #7bb6f3, #7ab4f2, #6bb4f1, #5bb3f1, #46b3ef, #2ab2ed)',
              backgroundSize: 'cover'
            }}>
              <img
                src={report2Icon}
                alt="Report 2 Icon"
                className="mx-auto mb-3"
                style={{ width: '50px', height: '50px' }}
              />
              <h5 className="card-title">Revenue and Value Analysis</h5>
            </div>
          </Link>
        </div>

        {/* Reviews and Ratings Correlation */}
        <div className="col">
          <Link to="/rp3" className="text-decoration-none">
          <div className="card h-100 text-center p-3 text-black" style={{
              backgroundImage: 'radial-gradient(circle, #4ec7f4, #5ac4f6, #66c1f6, #72bdf6, #7dbaf5, #7cb8f4, #7bb6f3, #7ab4f2, #6bb4f1, #5bb3f1, #46b3ef, #2ab2ed)',
              backgroundSize: 'cover'
            }}>
              <img
                src={report3Icon}
                alt="Report 3 Icon"
                className="mx-auto mb-3"
                style={{ width: '50px', height: '50px' }}
              />
              <h5 className="card-title">Reviews and Ratings Correlation</h5>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
