const express = require('express');
const morgan = require('morgan');                          
const cors = require('cors');


const recipeDao = require('./dao-recipes'); // module for accessing the recipes table in the DB

/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));



/*** recipes APIs ***/

//Retrieve the list of all the available recipes.
// GET /v1/recipes
app.get('/v1/recipes',
  (req, res) => {
    recipeDao.listRecipes()
      .then(recipes => res.json(recipes))
      .catch((err) => res.status(500).json(err));
  }
);

// Retrieve a recipe, given its “id”.
// GET /v1/recipes/<id>
// Given a recipe id, this route returns the associated recipe from the db.
app.get('/v1/recipes/:id',
  async (req, res) => {
    try {
      const result = await recipeDao.getRecipe(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);


// Create a new recipe, by providing all relevant information.
// POST /v1/recipes
// This route adds a new recipe to recipes table.
app.post('/v1/recipes',
// TDOD : add cecks on the body
  async (req, res) => {
    console.log("creation req body",req.body);

    const recipe = {
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients, // TODO: should be splitted in an array
      instructions: req.body.instructions,
    };

    try {
      const result = await recipeDao.createRecipe(recipe); // NOTE: createrecipe returns the new created object
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new recipe: ${err}` }); 
    }
  }
);

// Update an existing recipe, by providing all the relevant information
// PUT /v1/recipes/<id>
// This route allows to modify a recipe, specifiying its id and the necessary data.
app.put('/v1/recipes/:id',
  // TDOD : add cecks on the body
  async (req, res) => {
    const recipe = req.body;

    try {
      const result = await recipeDao.updateRecipe(req.params.id, recipe);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of recipe ${req.params.id}: ${err}` });
    }
  }
);


// Delete an existing recipe, given its “id”
// DELETE /v1/recipes/<id>
// Given a recipe id, this route deletes the associated recipe from the db.
app.delete('/v1/recipes/:id',
  async (req, res) => {
    try {
      const result = await recipeDao.deleteRecipe(req.params.id);
      if (result == null)
        return res.status(200).json({}); 
      else
        return res.status(404).json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of recipe ${req.params.id}: ${err} ` });
    }
  }
);

// Transforms the data.json into a new JSON format
const fs = require('fs');

// GET /v1/transformData
// Given a recipe id, this route deletes the associated recipe from the db.
app.get('/v1/transformData', (req, res) => {
    const data = fs.readFileSync('data.json', 'utf8');
    const dataObj = JSON.parse(data);
    const result = [];
    dataObj.forEach((item) => {
      const index = result.findIndex((el) => el.name === item.name);
      if (index === -1) {
        result.push({ name: item.name, values: [item.date] });
      } else {
        result[index].values.push(item.date);
      }
    });
    res.json(result);

  }
);

const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
