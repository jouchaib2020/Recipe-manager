import React, { useEffect, useState } from 'react';
import './Popup.css';

/**
 * Popup component for creating or editing a recipe.
 *
 * @param {Object} props - The component's props.
 * @param {Function} props.onValid - Callback function called on successful form submission.
 * @param {Function} props.onCancel - Callback function called when the form is canceled.
 * @param {Object} props.initialValues - Initial values to populate the form fields (for editing).
 * @returns {JSX.Element} The rendered Popup component.
 */
function Popup({ onValid, onCancel, initialValues }) {
    console.log(initialValues);
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instruction, setInstruction] = useState('');

    // Use useEffect to update the fields when initialValues change
    useEffect(() => {
        if (initialValues) {
            setNom(initialValues.name || '');
            setDescription(initialValues.description || '');
            setIngredients(initialValues.ingredients || '');
            setInstruction(initialValues.instructions || '');
        }
    }, [initialValues]);

    /**
     * Handles the submission of the form.
     * @param {Object} e - The form submission event.
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            name: nom,
            description,
            ingredients,
            instructions: instruction,
        };

        onValid(formData);
    };

    /**
     * Handles the cancellation of the form.
     */
    const handleCancel = () => {
        setNom('');
        setDescription('');
        setIngredients('');
        setInstruction('');

        onCancel();
    };

    return (
        <div className="container">
            <h1>Recipe Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nom">Recipe Name</label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ingredients">Ingredients (comma-separated)</label>
                    <input
                        type="text"
                        id="ingredients"
                        name="ingredients"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="instruction">Instructions</label>
                    <textarea
                        id="instruction"
                        name="instruction"
                        rows="4"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        required
                    ></textarea>
                </div>
                <label style={{display:'flex', padding:0, backgroundColor:'transparent'}}>
                    <button type="submit">Submit</button>
                    <button type="button" id="cancel" onClick={handleCancel}>Cancel</button>
                </label>
            </form>
        </div>
    );
}

export default Popup;
