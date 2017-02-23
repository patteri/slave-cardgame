import axios from 'axios';

const test = {
  getTest: () => axios.get('/api/test')
};

export default test;
