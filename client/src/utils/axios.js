import axios from 'axios';
const { REACT_APP_REST_URL: REST_URL } = process.env;
//Default axios instance with a base URL
const instance = axios.create({
	baseURL: REST_URL
});

// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// instance.interceptors.request...

export default instance;

export const config = { withCredentials: true };
