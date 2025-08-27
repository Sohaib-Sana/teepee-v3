export default function getToken(){
    return localStorage.getItem('access_token') || null
}

export function setToken(token){
    localStorage.setItem('access_token', token);
}

export function removeToken(){
    localStorage.removeItem('access_token');
}