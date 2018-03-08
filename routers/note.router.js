'use strict';
/* global $ store */


const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  
  notes.filter(searchTerm)
    .then((list) => {
      res.json(list); // responds with filtered array
    })
    .catch(err => next(err));
});
  
  
router.get('/api/notes/:id', (req, res, next) => {
  const {id}= req.params;
   
  notes.find(id)
    .then((item) => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
}); 
  
router.put('/api/notes/:id', (req, res, next) => {
  const {id} = req.params;
  
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  
  notes.update(id, updateObj)///can you chain the 2nd one?
    .then((item) => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.post('/api/notes', (req, res, next) => {
  const { title, content } = req.body;
  
  const newItem = { title, content };
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  notes.create(newItem)
    .then((item) => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});


router.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id)
    .then(function (item) {
      if (item){
        res.status(204).end();
      }
      else {
        next();
      }
    })
    .catch(err => next(err));
  console.log(`Deleting shopping list item \`${req.params.id}\``);
});

module.exports = router;
