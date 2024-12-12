import axios from "axios";

const url = process.env.NEXT_PUBLIC_REACT_APP_API_URL

const AxiosService = axios.create({
    baseURL : url,
    headers : {
        'Content-Type' : 'application/json'
    }
});

AxiosService.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

AxiosService.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export { AxiosService };