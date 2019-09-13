import axios from 'axios';

const apiService = axios.create({ baseURL: 'http://localhost:5000' })

apiService.interceptors.request.use(async config => {
    const token = localStorage.getItem('key');
    if (token) config.headers.Authorization = token;

    return config;
});

export default apiService;