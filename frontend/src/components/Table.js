import React from 'react';

const Table = () => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>johndoe@example.com</td>
            <td>28</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane Smith</td>
            <td>janesmith@example.com</td>
            <td>34</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Bob Johnson</td>
            <td>bob.johnson@example.com</td>
            <td>45</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
