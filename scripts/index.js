'use strict';

/* globals BookmarkList */

$(function() {
  Api.getBookmarks()
    .then(res => res.json())
    .then(bookmarks => {
      Store.list = bookmarks;
      BookmarkList.render();
    });
    
  BookmarkList.fireEventHandlers();
  
});