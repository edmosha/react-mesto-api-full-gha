// const BASE_URL = 'http://localhost:3001';
const BASE_URL = 'https://api.mesto.edmosha.nomoredomains.rocks';

const checkResponse = (res) => (res.ok ? res.json() : Promise.reject(res.status));

export const register = (email, password) => fetch(`${BASE_URL}/signup`, {
  method: 'POST',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    password,
    email,
  }),
})
  .then((res) => checkResponse(res));

export const login = (email, password) => fetch(`${BASE_URL}/signin`, {
  method: 'POST',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    password,
    email,
  }),
})
  .then((res) => checkResponse(res))
  .then((res) => {
    localStorage.setItem('userId', res._id);
    console.log(res);
    return res;
  });

export const getEmail = (token) => fetch(`${BASE_URL}/users/me`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    // "Authorization" : `Bearer ${token}`
  },
}).then((res) => checkResponse(res));
