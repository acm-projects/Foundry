import axios from "axios";

//LOCALHOST URL
const api = axios.create({baseURL: 'http://127.0.0.1:8000'})

//DEPLOYED EC2 URL
// const api = axios.create({baseURL: 'http://54.173.156.44'})
export default api