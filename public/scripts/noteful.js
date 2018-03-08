/* global $ store api */
'use strict';

const noteful = (function () {

  function render() {
    console.log('render is working');

    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);  

    const editForm = $('.js-note-edit-form');
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
      <button class="removeBtn js-note-delete-button">X</button>
    </li>`);
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item).closest('.js-note-element').data('id');
    return id;
  }

  /**
   * EVENT LISTENERS AND HANDLERS
   */
  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId)
        .then(detailsResponse => {
          store.currentNote = detailsResponse;
          render();
        });

    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();

      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm = searchTerm ? { searchTerm } : {};

      api.search(store.currentSearchTerm)
        .then(searchResponse => {
          store.notes = searchResponse;
          render();
        });

    });
  }

  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', function (event) {
      event.preventDefault();

      const editForm = $(event.currentTarget);

      const noteObj = {
        id: store.currentNote.id,
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };

      function search(){
        console.log('apiSearch1 initiated');
        return new Promise((resolve, reject) => {
          console.log('new Promise initiated');
          const apiSearch = api.search(store.currentSearchTerm);
          console.log(apiSearch);
          if(apiSearch){
            console.log('apisearch initiated');
            resolve(updateResponse => {
              store.notes = updateResponse;});}
          else{
            reject('not working');
          }
        });
      }

      if (noteObj.id){
        api.update(store.currentNote.id)
          .then(noteObj, updateResponse => 
            store.currentNote = updateResponse);

        search()
          .then(resolveUpdate => {
            console.log(resolveUpdate);
            resolveUpdate;
            return render();
          }
          );}
      else {
        setTimeout(function() { render(); }, 5000);
        api.create(noteObj)
          .then(updateResponse => {
            store.currentNote = updateResponse;
  
            search()
              .then(resolve => {
                console.log(resolve);
                resolve;
                render();    
              }
              );});   
      }
    });
  }

  function handleNoteStartNewSubmit() {
    $('.js-start-new-note-form').on('submit', event => {
      event.preventDefault();
      store.currentNote = false;
      render();

    });
  }

  function handleNoteDeleteClick() {
    $('.js-notes-list').on('click', '.js-note-delete-button', event => {
      event.preventDefault();
      console.log('delete hit');

      const noteToDelete = getNoteIdFromElement(event.currentTarget);
      console.log(noteToDelete);  
      
      api.remove(noteToDelete)
        .then(() =>{
          api.search(store.currentSearchTerm)
            .then(searchResponse =>{
              store.notes=searchResponse;
              if(noteToDelete===searchResponse.id){
                console.log('from search');
                store.currentNote = {};
              }
              console.log('rendering after search');
              render();
            }
            );
        });
    });
  }


  function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();

    handleNoteFormSubmit();
    handleNoteStartNewSubmit();
    handleNoteDeleteClick();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };

}());
