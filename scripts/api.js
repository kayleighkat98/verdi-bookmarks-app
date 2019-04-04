'use strict';

const Api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/verdi';

  function addBookmark(data) {
    return fetch(`${BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: data
    });
  }

  function getBookmarks() {
    return fetch(`${BASE_URL}/bookmarks`);
  }

  function deleteBookmark(id) {
    return fetch(`${BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE'
    });
  }
  
  
  return {
    addBookmark,
    getBookmarks,
    deleteBookmark,
  };
}());