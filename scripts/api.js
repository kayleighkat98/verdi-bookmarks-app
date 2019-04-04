'use strict';

const Api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/verdi';

  function bookmarkApi(...args) {
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = {code: res.status};
        }
        return res.json();
      })
      .then(jsonData => {
        if (error) {
          error.message = jsonData.message;
          return Promise.reject(error);
        }
        return jsonData;
      });
  }
  
  function addBookmark(data) {
    return bookmarkApi(`${BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: data
    });
  }

  function getBookmarks() {
    return bookmarkApi(`${BASE_URL}/bookmarks`);
  }

  function deleteBookmark(id) {
    return bookmarkApi(`${BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE'
    });
  }
  
  
  return {
    addBookmark,
    getBookmarks,
    deleteBookmark,
  };
}());