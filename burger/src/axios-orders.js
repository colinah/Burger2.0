import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-1e0b5.firebaseio.com/'
});

export default instance;