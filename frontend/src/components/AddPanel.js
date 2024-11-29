import React, { useState } from 'react';

const AddPanel = () => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    field6: '',
    field7: '',
    field8: '',
    field9: '',
    field10: '',
    field11: '',
  });

  const labels = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });
  
      if (response.ok) {
        alert('Record added successfully!');
        setFormData({
          field1: '',
          field2: '',
          field3: '',
          field4: '',
          field5: '',
          field6: '',
          field7: '',
          field8: '',
          field9: '',
          field10: '',
          field11: '',
        });
      } else {
        alert('Failed to add record.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };
  

  return (
    <div>
      <h2 className="mb-4">Add Record</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field, index) => (
          <div className="mb-3 row align-items-center" key={field}>
            <label htmlFor={field} className="col-sm-3 col-form-label text-end">
              {labels[index]}:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${labels[index]}`}
              />
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPanel;
