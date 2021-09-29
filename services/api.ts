import axios, { Method } from "axios";

export const executeRequest = (endpoint: string, method: Method, body?: any) => {
    const headers = { 'Content-Type' : 'application/json'} as any;
    const URL = 'http://localhost:3000/api/' + endpoint;
    console.log(`executando : ${URL}, metodo : ${method}, body : ${body}, headers : ${headers}`);
    return axios.request({
        url : URL,
        method : method,
        data: body? body : '',
        headers : headers,
        timeout: 30000
    });
}