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

    const bookmarks = filteredList ? filteredList : Store.list;
    const bookmarkTemplate = bookmarks.map(bookmark => buildBookmarkHtml(bookmark));
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
            <span class='remove-bookmark'><i class="far fa-trash-alt"></i></span>
          </div>
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
    if (bookmark.isExpanded) {
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
    $('.container').on('submit', 'form', function(e) {
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

  function fireEventHandlers() {
    handleDisplayForm();
    handleFormClose();
    handleFormSubmit();
    handleBookmarkView();
    handleBookmarkDelete();
    handleFilterByRating();
    handleCloseError();
  }


  return {
    render,
    renderError,
    fireEventHandlers
  };

  
}());