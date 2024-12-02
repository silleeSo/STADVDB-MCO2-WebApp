import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Section from '../components/Section';
import Card from '../components/Card';
import createIcon from '../assets/create-icon.png';
import deleteIcon from '../assets/delete-icon.png';
import searchIcon from '../assets/search-icon.png';
import report1Icon from '../assets/report1.png';
import report2Icon from '../assets/report2.png';
import report3Icon from '../assets/report3.png';
import { executeRedirect, checkNode1 } from '../services/api';

const HomePage = () => {
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);

  useEffect(() => {
    executeRedirect(); // Execute redirect functionality (if needed)

    // Use an async function to handle the API call
    const checkNodeStatus = async () => {
      try {
        const resp = await checkNode1();
        if (resp.status === 'error') {
          //alert('CRUD Operations are unavailable.');
          setIsDeleteButtonDisabled(true);
        } else {
          setIsDeleteButtonDisabled(false);
        }
      } catch (error) {
        setIsDeleteButtonDisabled(false);
        console.error('Error checking node status:', error);
        alert('An error occurred while checking node status.');
      }
    };

    checkNodeStatus();
  }, []);

  return (
    <div className="container text-center mt-5">
      <Header />
      <p className="mb-5">What would you like to do today?</p>

      <Section title="Actions">
        <Card
          to="/add"
          imgSrc={createIcon}
          title="Create"
          isDisabled={isDeleteButtonDisabled}
          onClick={() => alert('Node1 is down or not active. This action is disabled.')}
        />
        <Card
          to="/delete"
          imgSrc={deleteIcon}
          title="Delete or Update"
          isDisabled={isDeleteButtonDisabled}
          onClick={() => alert('Node1 is down or not active. This action is disabled.')}
        />
        <Card
          to="/search"
          imgSrc={searchIcon}
          title="Search"
          isDisabled={isDeleteButtonDisabled}
          onClick={() => alert('Node1 is down or not active. This action is disabled.')}
        />
      </Section>

      <hr className="my-5" />

      <Section title="Reports">
        <Card to="/rp1" imgSrc={report1Icon} title="Top Games by Engagement" />
        <Card to="/rp2" imgSrc={report2Icon} title="Revenue and Value Analysis" />
        <Card to="/rp3" imgSrc={report3Icon} title="Reviews and Ratings Correlation" />
      </Section>
    </div>
  );
};

export default HomePage;
