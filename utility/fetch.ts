import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

async function fetchData(endpoint: string, options: any): Promise<any> {
    const { data } = await axios.request({ url: `${API_BASE_URL}${endpoint}`, ...options });
    return data;
}

export async function signIn(username: string, password: string): Promise<{
    accessToken: string,
    expiresIn: number,
    tokenType: string
}> {
    return fetchData('/signin', {
        method: 'POST',
        url: '/signin',
        headers: { 'Content-Type': 'application/json' },
        data: { username, password }
    });
}

export async function autoSignIn(): Promise<{
    accessToken: string,
    expiresIn: number,
    tokenType: string
}> {
    return fetchData('/auto-signin', {
        method: 'GET',
        url: '/auto-signin',
        withCredentials: true
    });
}