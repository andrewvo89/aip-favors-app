import axios from 'axios';
const { REACT_APP_REST_URL: REST_URL } = process.env;

const instance = axios.create({
	baseURL: REST_URL
});

// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// instance.interceptors.request...

export default instance;
