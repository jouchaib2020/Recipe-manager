'use strict';

/** DB access module **/

const sqlite = require('sqlite3');
const path = require('path');

// open the database
const dbPath = path.join(__dirname, 'recipes.db')
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = db;
