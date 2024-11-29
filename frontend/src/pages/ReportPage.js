import React from 'react';
import { Link } from 'react-router-dom';


const ReportPage = () => {
      
    return (
        <div>
          <h1>This is the Reports Directory Page!</h1>
          <p class="text-center">Which report would you like to generate?</p>
          
            <p class="text-center">
                <Link to="/rp1">
                <button type="button" class="btn btn-primary btn-lg">Report 1</button>
                </Link>
                <br />
            </p>

            <p class="text-center">
                <Link to="/rp2">
                <button type="button" class="btn btn-primary btn-lg">Report 2</button>
                </Link>
                <br />
            </p>
            
            <p class="text-center">
                <Link to="/rp3">
                <button type="button" class="btn btn-primary btn-lg">Report 3</button>
                </Link>
                <br />
            </p>
            
            
        </div>
      );
};

export default ReportPage;