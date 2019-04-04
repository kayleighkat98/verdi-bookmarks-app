'use strict';

/* globals BookmarkList, Store, Api */

$(function() {
  Api.getBookmarks()
    .then(bookmarks => {
      Store.list = bookmarks;
      BookmarkList.render();
    })
    .catch(error => {
      BookmarkList.renderError(error.message);
    });

  BookmarkList.fireEventHandlers();
});