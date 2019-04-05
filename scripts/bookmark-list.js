'use strict';

$.fn.extend({
  serializeJson: function () {
    const formData = new FormData(this[0]);
    const obj = {};
    formData.forEach((val, name) => obj[name] = val);
    return JSON.stringify(obj);
  }
});

/* globals Store, Api */

const BookmarkList = (function() {

  function render(filteredList=null) {
    if (Store.isAdding) {
      $('#js-form').html(bookmarkHtmlForm());
      $('#js-form').show();
    } else {
      $('#js-form').html('');
      $('#js-form').hide();
    }

    if (!Store.list.length) {
      const introTemplate = `
        <h2>Welcome to Stockpile</h2>
        <p>You don't have any bookmarks yet!  Click 'Add New Bookmark' to add your first bookmark.</p>
        <button class='button' id='new-bookmark'>Add New Bookmark</button>
      `;
      $('.js-list-header').html('');
      $('.js-bookmark-list').html('');
      return $('.js-no-bookmarks-intro').html(introTemplate);
    }

    const bookmarks = filteredList ? filteredList : Store.list;
    const bookmarkTemplate = bookmarks.map(bookmark => buildBookmarkHtml(bookmark));
    const listHeaderTemplate = `
    <h2>Bookmarks</h2>
    <div class='bookmark-controls'>
      <button class='button' id='new-bookmark'>Add New Bookmark</button>
      <select>
        <option value="" selected>Filter By Rating</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    `;

    $('.js-no-bookmarks-intro').html('');
    $('.js-list-header').html(listHeaderTemplate);
    $('.js-bookmark-list').html(bookmarkTemplate);
  }

  function renderError(message) {
    const errorTemplate = `
      ${message}
      <span id='close-error-msg'><i class="fas fa-times"></i></span>
    `;
    $('.js-error-message').html(errorTemplate);
    $('.js-error-message').show();
  }

  function buildRating(rating) {
    rating = Number(rating);
    let html = '';
    for (let i=0; i<rating; i++) {
      html += '<i class="fas fa-star"></i>';
    }
    return html;
  }

  function buildExpandedHtml(bookmark) {
    return `
      <li class='bookmark' data-id='${bookmark.id}'>
        <div class='header'>
          <i class="fas fa-chevron-up"></i>
          <h3>${bookmark.title}</h3>
        </div>
        
        <div class='body'>
          <p>
            ${bookmark.desc ? bookmark.desc : 'no description given'}
          </p>
          <a class='button small' href='${bookmark.url}' target='_blank'>Visit Site</a>
          <div class='rating'>
            ${bookmark.rating ? buildRating(bookmark.rating) : 'no rating given'}
            <span class='edit-bookmark'><i class="far fa-edit"></i></span>
            <span class='remove-bookmark'><i class="far fa-trash-alt"></i></span>
          </div>
        </div>
      </li>
    `;
  }

  function buildEditHtml(bookmark) {
    return `
      <li class='bookmark' data-id='${bookmark.id}'>
        <div class='header'>
          <i class="fas fa-chevron-up"></i>
          <h3>${bookmark.title}</h3>
        </div>
        
        <div class='body'>
          <form id='js-edit-form'>
            <div>
              <label style='display:block;' for='edit-bookmark-desc'>Description</label>
              <textarea rows="5" cols="53" form='js-edit-form' name='desc' id='edit-bookmark-desc'>${bookmark.desc ? bookmark.desc : 'no description given'}</textarea>
            </div>
            <div class='rating'>
              <fieldset>
                <legend> Rating </legend>
                  <label> <input type="radio" name="rating" value="1" ${bookmark.rating === 1 ? 'checked="checked"' : ''}> 1 </label>
                  <label> <input type="radio" name="rating" value="2" ${bookmark.rating === 2 ? 'checked="checked"' : ''}> 2 </label>
                  <label> <input type="radio" name="rating" value="3" ${bookmark.rating === 3 ? 'checked="checked"' : ''}> 3 </label>
                  <label> <input type="radio" name="rating" value="4" ${bookmark.rating === 4 ? 'checked="checked"' : ''}> 4 </label>
                  <label> <input type="radio" name="rating" value="5" ${bookmark.rating === 5 ? 'checked="checked"' : ''}> 5 </label>
              </fieldset>
              <span class='edit-bookmark'><a href='#'>cancel edit</a></span>
              <span class='remove-bookmark'><i class="far fa-trash-alt"></i></span>
            </div>
            <button type='submit' class='button small'>Update Bookmark</button>
          </form>
        </div>
      </li>
    `;
  }

  function buildListViewHtml(bookmark) {
    return `
      <li class='bookmark' data-id='${bookmark.id}'>
        <div class='header'>
          <i class="fas fa-chevron-down"></i>
          <h3>${bookmark.title}</h3>
        </div>
        
        <div class='body'>
          <div class='rating'>
            ${bookmark.rating ? buildRating(bookmark.rating) : 'no rating given'}
            <span class='remove-bookmark'><i class="far fa-trash-alt"></i></span>
          </div>
        </div>
      </li>
    `;
  }
  
  function buildBookmarkHtml(bookmark) {
    if (bookmark.isEditing) {
      return buildEditHtml(bookmark);
    } else if (bookmark.isExpanded) {
      return buildExpandedHtml(bookmark);
    } else {
      return buildListViewHtml(bookmark);
    }
  }

  function bookmarkHtmlForm() {
    return `
      <div class='form-field'>
        <label for='bookmark-title'>Title</label>
        <input type='text' name='title' id='bookmark-title'>
      </div>

      <div class='form-field'>
        <label for='bookmark-url'>Url</label>
        <input type='text' name='url' id='bookmark-url'>
      </div>

      <div class='form-field'>
        <label for='bookmark-desc'>Description</label>
        <textarea rows="5" cols="53" form='js-form' name='desc' id='bookmark-desc'></textarea>
      </div>

      <fieldset class='form-field'>
        <legend> Rating </legend>
        <label> <input type="radio" name="rating" value="1"> 1 </label>
        <label> <input type="radio" name="rating" value="2"> 2 </label>
        <label> <input type="radio" name="rating" value="3"> 3 </label>
        <label> <input type="radio" name="rating" value="4"> 4 </label>
        <label> <input type="radio" name="rating" value="5"> 5 </label>
      </fieldset>

      <div class='form-controls'>
        <button class='button' type='submit'>Create</button>
        <button class='button' type='button' id='close-form'>Cancel</button>
      </div>
    `;
  }

  // Event handlers
  function handleDisplayForm() {
    $('.container').on('click', '#new-bookmark', function() {
      Store.isAdding = true;
      render();
    });
  }

  function handleFormClose() {
    $('.container').on('click', '#close-form', function() {
      Store.isAdding = false;
      render();
    });
  }

  function handleFormSubmit() {
    $('.container').on('submit', 'form#js-form', function(e) {
      e.preventDefault();
      const data = $(e.target).serializeJson();
      Api.addBookmark(data)
        .then(bookmark => {
          Store.addBookmark(bookmark);
          render();
        })
        .catch(error => {
          renderError(error.message);
        });
    });
  }

  function handleBookmarkView() {
    $('.js-bookmark-list').on('click', '.header', function(){
      const id = $(this).closest('li').data('id');
      Store.toggleExpandedView(id);
      render();
    });
  }

  function handleBookmarkDelete() {
    $('.js-bookmark-list').on('click', '.remove-bookmark', function() {
      const id = $(this).closest('li').data('id');
      Api.deleteBookmark(id)
        .then(() => {
          Store.deleteBookmark(id);
          render();
        })
        .catch(error => {
          renderError(error.message);
        });
    });
  }

  function handleFilterByRating() {
    $('.bookmark-controls').on('change', 'select', function() {
      const rating = $(this).val();
      const filteredList = Store.filterByRating(rating);
      render(filteredList);
    });
  }

  function handleCloseError() {
    $('.container').on('click', '#close-error-msg', function() {
      $(this).closest('div').hide();
    });
  }

  function handleEditView() {
    $('.js-bookmark-list').on('click', '.edit-bookmark', function() {
      const id = $(this).closest('li').data('id');
      Store.toggleEditing(id);
      render();
    });
  }

  function handleEditFormSubmit() {
    $('.js-bookmark-list').on('submit', 'form#js-edit-form', function(e){
      e.preventDefault();
      const id = $(this).closest('li').data('id');
      const data = $(e.target).serializeJson();
      Api.updateBookmark(id, data)
        .then(() => {
          Store.updateBookmark(id, data);
          render();
        })
        .catch(error => {
          renderError(error.message);
        });
    });
  }

  function fireEventHandlers() {
    handleDisplayForm();
    handleFormClose();
    handleFormSubmit();
    handleBookmarkView();
    handleBookmarkDelete();
    handleFilterByRating();
    handleCloseError();
    handleEditView();
    handleEditFormSubmit();
  }


  return {
    render,
    renderError,
    fireEventHandlers
  };
}());