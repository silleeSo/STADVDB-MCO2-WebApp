import React, { useState } from 'react';
import UserInput from '../components/UserInput';
import AddPanel from '../components/AddPanel';
import HomeButton from '../components/HomeButton';

const AddPage = () => {
 
  return (
    <div>
      <HomeButton/>
          <AddPanel />
    </div>
  );
};

export default AddPage;
