import axios from "axios";


const api_key = import.meta.env.CHAVE_API_AUTOMATE

export const api = axios.create({
    baseURL: api_key,
    timeout: 8 * 1000
})