'use strict';
/* global $ store */


const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});
  
  
router.get('/api/notes/:id', (req, res, next) => {
  const {id}= req.params;
   
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
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
  
  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

router.post('/v1/notes', (req, res, next) => {
  const { title, content } = req.body;
  
  const newItem = { title, content };
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});


router.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id, function (err,item) {
    if(err){
      return next(err);
    }
    if (item){
      res.status(204).end();
    }
    else {
      next();
    }
  });
  console.log(`Deleting shopping list item \`${req.params.id}\``);
});

module.exports = router;
