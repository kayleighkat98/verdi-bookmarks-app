'use strict';

const Store = (function() {

  function addBookmark(bookmark) {
    this.list.push(bookmark);
    this.isAdding = false;
  }

  function findById(id) {
    return this.list.find(bookmark => bookmark.id === id);
  }

  function toggleExpandedView(id) {
    const bookmark = this.findById(id);
    bookmark.isExpanded = !bookmark.isExpanded;
  }

  return {
    list: [],
    isAdding: false,

    addBookmark,
    toggleExpandedView,
    findById,
  };
}());