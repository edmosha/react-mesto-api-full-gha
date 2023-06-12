class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _checkResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  getUserInfo() { 
    return this._request(
      this._baseUrl + '/users/me', {
        credentials: 'include',
      })
  }

  getInitialCards() {
    return this._request(
      this._baseUrl + '/cards', {
        credentials: 'include',
      })
  }

  setUserInfo(name, about) {
    return this._request(
      this._baseUrl + '/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: name,
          about: about
        })
      })
  }

  postNewCard(title, image) {
    return this._request(
      this._baseUrl + '/cards', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: title,
          link: image
        })
      })
  }

  deleteCard(id) {
    return this._request(
      this._baseUrl + '/cards/' + id, {
        method: 'DELETE',
      })
  }

  setLike(cardId) {
    return this._request(
      this._baseUrl + '/cards/' + cardId + '/likes', {
        method: 'PUT',
      })
  }

  removeLike(cardId) {
    return this._request(
      this._baseUrl + '/cards/' + cardId + '/likes', {
        method: 'DELETE',
      })
  }

  changeLikeCardStatus(cardId, isLiked) {
    return isLiked ? this.removeLike(cardId) : this.setLike(cardId);
  }

  updateAvatar(avatar) {
    return this._request(
      this._baseUrl + '/users/me/avatar', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          avatar: avatar
        })
      })
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3001',
})

export default api;