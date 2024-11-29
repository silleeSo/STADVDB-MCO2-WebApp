import React from 'react';
import { Link } from 'react-router-dom';

const ReportPage = () => {
    return (
        <div>
          <h1>This is the Reports Directory Page!</h1>
          <p>Which report would you like to generate?</p>
          
          {/* Create buttons for navigation */}
          <Link to="/rp1">
            <button>Report 1</button>
          </Link>
          <br />
          <Link to="/rp2">
            <button>Report 2</button>
          </Link>
          <br />
          <Link to="/rp3">
            <button>Report 3</button>
          </Link>
          <br />    
        </div>
      );
};

export default ReportPage;