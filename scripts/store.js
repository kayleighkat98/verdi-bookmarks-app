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

  function deleteBookmark(id) {
    const index = this.list.findIndex(bookmark => bookmark.id === id);
    this.list.splice(index, 1);
  }

  return {
    list: [],
    isAdding: false,

    addBookmark,
    toggleExpandedView,
    findById,
    deleteBookmark,
  };
}());