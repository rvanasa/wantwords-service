import axios from 'axios';

// TODO refactor
export const url = window.location.href.includes('//localhost') ? 'http://localhost:8080/api' : 'api';

async function request(method, path, body) {
    console.log(method.toUpperCase(), path);
    return (await axios[method](url + path, body)).data;
}

export async function get(path) {
    return request('get', path);
}

export async function post(path, body) {
    return request('post', path, body);
}

