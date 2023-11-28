'use strict';

/* Data Access Object (DAO) module for accessing recipes data */

const db = require('./db');


// This function retrieves the whole list of recipes from the database.
exports.listRecipes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM recipes';
    db.all(sql, (err, rows) => {
      if (err) { reject(err); }

      const recipes = rows.map((e) => ({ 
        ...e, 
        ingredients: e.ingredients.split(',') }));
      resolve(recipes);
    });
  });
};
  
// This function retrieves a recipe given its id and the associated user id.
exports.getRecipe = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM recipes WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row == undefined) {
        resolve({ error: 'recipe not found.' });
      } else {
       
        const recipe = {...row, ingredients: row.ingredients.split(',')};
        resolve(recipe);
      }
    });
  });
};
  
  
/**
 * This function adds a new recipe in the database.
 * The recipe id is added automatically by the DB, and it is returned as this.lastID.
 */
exports.createRecipe = (recipe) => {

  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO recipes (name, description, ingredients, instructions) VALUES(?, ?, ?, ?)';
    db.run(sql, [recipe.name, recipe.description, recipe.ingredients, recipe.instructions], function (err) {
      if (err) {
        reject(err);
      }
      // Returning the newly created object with the DB additional properties to the client.
      resolve(exports.getRecipe(this.lastID));
    });
  });
};
  

// This function updates an existing recipe given its id and the new properties.
exports.updateRecipe = (id, recipe) => {
  console.log("update recipe", id, recipe);

  return new Promise((resolve, reject) => {
    const sql = 'UPDATE recipes SET name=?, description=?, ingredients=?, instructions=? WHERE id=?';
    db.run(sql, [recipe.name, recipe.description, recipe.ingredients, recipe.instructions, id], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1) {
        resolve({ error: 'No recipe was updated.' });
      } else {
        resolve(exports.getRecipe(id)); 
      }
    });
  });
};
  
// This function deletes an existing recipe given its id.
exports.deleteRecipe = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM recipes WHERE id=?';
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1)
        resolve({ error: 'No recipe deleted.' });
      else
        resolve(null);
    });
  });
}
