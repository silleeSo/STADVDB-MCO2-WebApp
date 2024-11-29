import React from 'react';
import SearchInputs from '../components/SearchInputs';
import Table from '../components/Table';

const Report1 = () => {
    return (
    <div class="text-center">
      <h2>Report Title</h2>
      {/* Row container with Bootstrap grid system */}
      <br></br>
      <p><SearchInputs /></p>
      <p><Table /></p>
            
    </div>
  );
};

export default Report1;
