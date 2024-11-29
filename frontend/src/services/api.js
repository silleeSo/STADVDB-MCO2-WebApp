import axios from 'axios';

export const executeQuery = async (query) => {
  try {
    const response = await axios.post('http://localhost:5000/query', { query });
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error: Unable to connect to the server');
      alert('Unable to connect to the server. Please try again later.');
    }
    throw error; // Re-throw the error if necessary
  }
};
