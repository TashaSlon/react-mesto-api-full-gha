
const { BASE_URL } = require('./Api');


function getJson(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({"password": password,
    "email": email })
  })
  .then(getJson);
};

export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({password, email})
  })
  .then(getJson)
  .then((data) => {
    return data;});
};

export const logout = () => {
  return fetch(`${BASE_URL}/signout`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    credentials: 'include',
    method: 'GET'
  })
  .then(getJson);
};

export const getEmail = () => {
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    credentials: 'include',
    method: 'GET'
  })
  .then(getJson);
};
