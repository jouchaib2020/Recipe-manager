import * as React from 'react';
import './App.css';
import { createRecipe, deleteRecipe, getRecipeById, getRecipes, updateRecipe } from "./data/RecipeData";
import Popup from "./popup/Popup";

/**
 * The main application component.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {

    // State for the list of recipes
    const [list, setList] = React.useState([]);

    // State for the creation form popup
    const [isCreationOpen, setCreationOpen] = React.useState(false);

    // State for the update form popup
    const [isUpdateOpen, setUpdateOpen] = React.useState(false);

    // State for the selected recipe to update
    const [selectedValue, setSelectedValue] = React.useState();

    /**
     * Fetches and updates the list of recipes.
     */
    const updateAllRecipes = () => {
        getRecipes().then(results => {
            setList(results);
        });
    }

    /**
     * Handles the submission of the update form.
     * @param {Object} formData - The updated recipe data.
     */
    const handleUpdateValid = (formData) => {
        setUpdateOpen(false);
        updateRecipe(selectedValue?.id, formData).then(() => {
            updateAllRecipes();
        });
    };

    /**
     * Opens the update form for a specific recipe.
     * @param {Object} recipe - The recipe to edit.
     */
    const openUpdate = async (recipe) => {
        const result = await getRecipeById(recipe.id);
        setSelectedValue(result);
        setUpdateOpen(true);
    };

    /**
     * Deletes the selected recipe.
     * @param {Object} recipe - The recipe to delete.
     */
    const deleteSelectedRecipe = (recipe) => {
        deleteRecipe(recipe.id).then(() => {
            updateAllRecipes();
        });
    };

    /**
     * Handles the submission of the creation form.
     * @param {Object} formData - The data of the newly created recipe.
     */
    const handleCreationValid = (formData) => {
        setCreationOpen(false);
        createRecipe(formData).then(() => {
            updateAllRecipes();
        });
    };

    /**
     * Cancels the creation form.
     */
    const handleCreationCancel = () => {
        setCreationOpen(false);
    };

    /**
     * Cancels the update form.
     */
    const handleUpdateCancel = () => {
        setUpdateOpen(false);
    };

    // Fetch recipes when the component mounts
    React.useEffect(() => {
        updateAllRecipes();
    }, [selectedValue]);

    return (
        <>
            <div>
                <h1>Recipe List</h1>
                <button onClick={() => setCreationOpen(true)}>Create Recipe</button>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Ingredients</th>
                        <th>Instructions</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.map(r => {
                        return (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.name}</td>
                                <td>{r.description}</td>
                                <td>{
                                // Display the list of ingredients as a comma-separated string
                                r.ingredients.join(', ')
                                }</td>
                                <td>{r.instructions}</td>
                                <td><button onClick={() => openUpdate(r)}>Edit</button></td>
                                <td><button onClick={() => deleteSelectedRecipe(r)}>Delete</button></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            {isCreationOpen && <Popup onValid={handleCreationValid} onCancel={handleCreationCancel} />}
            {isUpdateOpen && <Popup onValid={handleUpdateValid} onCancel={handleUpdateCancel} initialValues={selectedValue} />}
        </>
    );
}

export default App;
