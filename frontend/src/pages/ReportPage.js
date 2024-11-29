import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../components/Dropdown';

const ReportPage = () => {
    const options = [
        { label: 'Action', href: '#action1' },
        { label: 'Another Action', href: '#action2' },
        { label: 'Something Else', href: '#action3' },
        { label: 'Separated Link', href: '#action4' },
      ];
      
    return (
        <div>
          <h1>This is the Reports Directory Page!</h1>
          <p class="text-center">Which report would you like to generate?</p>
          
            <p class="text-center">
                <Link to="/add">
                <button type="button" class="btn btn-primary btn-lg">Report 1</button>
                </Link>
                <br />
            </p>

            <p class="text-center">
                <Link to="/delete">
                <button type="button" class="btn btn-primary btn-lg">Report 2</button>
                </Link>
                <br />
            </p>
            
            <p class="text-center">
                <Link to="/update">
                <button type="button" class="btn btn-primary btn-lg">Report 3</button>
                </Link>
                <br />
            </p>

            <p class="text-center">
            <Dropdown title="Select Node" options={options} />
            </p>
        </div>
      );
};

export default ReportPage;