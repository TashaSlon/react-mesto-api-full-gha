class Api {
  constructor(baseUrl) {
    this._baseUrl = baseUrl;
  }

  _getHeaders() {
    return {
      "Content-Type": "application/json",
    };
  }

  _getJson(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._getHeaders(),
      credentials: 'include' })
    .then(this._getJson);
  }

  setUserInfo(userData) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        name: userData.name,
        about: userData.about
      })
    })
    .then(this._getJson);
  }

  getCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: this._getHeaders(),
      credentials: 'include' })
    .then(this._getJson);
  }

  addNewCard(cardData) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      })
    })
    .then(this._getJson);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._getHeaders(),
      credentials: 'include'
    })
    .then(this._getJson);
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (!isLiked) {
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: this._getHeaders(),
        credentials: 'include'
      })
      .then(this._getJson);
    } else {
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: this._getHeaders(),
        credentials: 'include'
      })
      .then(this._getJson);
    }
  }

  setUserAvatar(link) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        avatar: link
      })
    })
    .then(this._getJson);
  }
}

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.tashaslon.nomoreparties.sbs' : 'http://localhost:3000';

export const api = new Api(BASE_URL);
export {BASE_URL};
