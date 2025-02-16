import axios from "axios";

const token = 'a87033d9-1efd-493a-8122-8c5b41fe94a7'
const apiKey = 'a00e3908-f288-4f60-9137-9f41213206da'

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    headers: {
        Authorization: `Bearer ${token}`,
        'API-KEY': apiKey,
    }
})