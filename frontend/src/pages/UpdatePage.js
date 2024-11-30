import React, { useState } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';

const UpdatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction } = location.state || {}; // Safely get transaction from state

  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty if no date
    const date = new Date(dateString);
    // Convert to yyyy-MM-dd format required for input type="date"
    return date.toISOString().split('T')[0];
  };
  
  // Initialize state dynamically based on transaction data
  const [formData, setFormData] = useState({
    field1: transaction?.id || '',
    field2: transaction?.name || '', // Name
    field3: formatDate(transaction?.release_date), // Release Date
    field4: transaction?.release_year || '', // Release Year
    field5: transaction?.price || '', // Price
    field6: transaction?.positive_reviews || '', // Positive Reviews
    field7: transaction?.negative_reviews || '', // Negative Reviews
    field8: transaction?.user_score || '', // User Score
    field9: transaction?.metacritic_score || '', // Metacritic Score
    field10: transaction?.average_playtime_forever || '', // Average Playtime Forever
    field11: transaction?.average_playtime_2weeks || '', // Average Playtime 2 Weeks
    field12: transaction?.median_playtime_forever || '', 
  });

  const labels = [
    'ID',
    'Name',
    'Release Date',
    'Release Year',
    'Price',
    'Positive Reviews',
    'Negative Reviews',
    'User Score',
    'Metacritic Score',
    'Average Playtime Forever',
    'Average Playtime 2 Weeks',
    'Median Playtime Forever',
  ];

  const inputTypes = {
    field1: 'number',
    field2: 'text',
    field3: 'date',
    field4: 'number',
    field5: 'number',
    field6: 'number',
    field7: 'number',
    field8: 'number',
    field9: 'number',
    field10: 'number',
    field11: 'number',
    field12: 'number',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

    
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Include field1 (ID) manually to ensure it's sent
  //const dataToSend = { field1: formData.field1, ...formData};

    try {
      const response = await fetch('http://localhost:5000/update-record', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Record updated successfully!');
      } else {
        alert('Failed to update record.');
      }
      navigate('/delete');
    } catch (error) {
      console.error('Error updating record:', error);
      alert('An error occurred while updating the record.');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Update Record</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field, index) => (
          <div className="mb-3 row align-items-center" key={field}>
            <label htmlFor={field} className="col-sm-3 col-form-label text-end">
              {labels[index]}:
            </label>
            <div className="col-sm-9">
              <input
                type={inputTypes[field]}
                className="form-control"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${labels[index]}`}
                disabled={field === 'field1'} // Disable field1 (ID)
              />
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdatePage;
