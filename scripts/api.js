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
  
  
  return {
    addBookmark,
    getBookmarks,
  };
}());