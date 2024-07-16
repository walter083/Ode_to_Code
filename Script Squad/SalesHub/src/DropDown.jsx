import React, { useEffect, useState } from 'react';
import useStore from './store/store.js';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { db } from './firebase.js';

const DropDown = () => {
    const [options, setOptions] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

    const dropdown = useStore((state) => state.dropdown);
    const addToDropDown = useStore((state) => state.addToDropDown);

    useEffect(() => {
        const fetchOptions = async () => {
            const collectionRef = collection(db, 'drop_down');
            const q = query(collectionRef);
            const querySnapshot = await getDocs(q);
            const fetchedOptions = querySnapshot.docs.map((doc) => doc.data().Name);
            setOptions(fetchedOptions);
        };

        fetchOptions();
    }, []);

    const handleAddNewCategory = async () => {
        if (newCategory.trim() === '') return;
        try {
            const collectionRef = collection(db, 'drop_down');
            await addDoc(collectionRef, { Name: newCategory });
            setOptions((prevOptions) => [...prevOptions, newCategory]);
            setNewCategory('');
            setShowNewCategoryInput(false);
            alert('Category added successfully!');
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleSelectChange = (e) => {
        if (e.target.value === 'new-category') {
            setShowNewCategoryInput(true);
        } else {
            addToDropDown(e.target.value);
            setShowNewCategoryInput(false);
        }
    };

    return (
        <div>
            <label>Choose a category: </label>
            <select id='dropdown' value={dropdown} onChange={handleSelectChange}>
                <option value="">Select</option>
                {options.map((item, index) => (
                    <option value={item} key={index}>{item}</option>
                ))}
                <option value="new-category">New Category</option>
            </select>
            {showNewCategoryInput && (
                <div id='new-category'>
                    <input 
                        type='text' 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)} 
                        placeholder="Enter new category"
                    />
                    <button onClick={handleAddNewCategory}>Add</button>
                </div>
            )}
        </div>
    );
}

export default DropDown;
