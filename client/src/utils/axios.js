import axios from 'axios';
import { REST_URL } from './constants';

const instance = axios.create({
  baseURL: REST_URL
});

// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// instance.interceptors.request...

export default instance;