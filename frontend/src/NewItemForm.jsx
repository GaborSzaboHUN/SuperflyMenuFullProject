import React, { useState } from "react";

const NewItemForm = ({ onCancel, onAddItem }) => {
    const [newItem, setNewItem] = useState({
        name: {hu: "", en: ""},
        varieties: { hu: "", en: "" },
        price: "",
        visible: true,
    });

    const handleTextChange = (e, field, lang) => {
        setNewItem({
            ...newItem,
            [field]: {
                ...newItem[field],
                [lang]: e.target.value
            }
        })
    }

    const handlePriceChange = (e) => {
        setNewItem({
            ...newItem, 
            price: e.target.value.length > 0 ? parseInt(e.target.value) : ''
        });
    }
    console.log(newItem);

    return (
        <>
            <p>Új tétel:</p>

            <label htmlFor={`new-name-hu`}>Név (HU)</label>
            <input
                id={`new-name-hu`}
                type="text"
                value={newItem.name.hu}
                onChange={(e) => handleTextChange(e, 'name', 'hu')}
            />
            <label htmlFor={`new-name-en`}>Név (EN)</label>
            <input
                id={`new-name-en`}
                type="text"
                value={newItem.name.en}
                onChange={(e) => handleTextChange(e, 'name', 'en')}
            />
            <label htmlFor={`new-varieties-hu`}>Variációk (HU)</label>
            <input
                id={`new-varieties-hu`}
                type="text"
                value={newItem.varieties.hu}
                onChange={(e) => handleTextChange(e, 'varieties', 'hu')}
            />
            <label htmlFor={`new-varieties-en`}>Variációk (EN)</label>
            <input
                id={`new-varieties-en`}
                type="text"
                value={newItem.varieties.en}
                onChange={(e) => handleTextChange(e, 'varieties', 'en')}
            />
            <label htmlFor={`new-price`}>Ár</label>
            <input
                id={`new-price`}
                type="number"
                value={newItem.price}
                onChange={handlePriceChange}
            />

            <button 
                type="button"
                onClick={() => onAddItem(newItem)}>
                    Hozzáadás
            </button>
            <button 
                type="button"
                onClick={onCancel}>
                    Mégse
            </button>
        </>
    );
}

export default NewItemForm;