import axios from 'axios';

export const url = process.env.API_URL || 'api';

async function handle(method, path, body) {
    console.log(method.toUpperCase(), path);
    return (await axios[method](url + path, body)).data;
}

export async function get(path) {
    return handle('get', path);
}

export async function post(path, body) {
    return handle('post', path, body);
}

