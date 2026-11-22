import React from "react";

const MenuItem = ({
    item,
    draft,
    editingItemId,
    handleTextChange,
    handlePriceChange,
    startEditing,
    handleSave,
}) => {
    const isEdited = editingItemId === item.id;
    const valueSource = isEdited ? draft : item;

    return (
        <li>
            <label htmlFor={`${item.id}-name-hu`}>Név (HU)</label>
            <input
                id={`${item.id}-name-hu`}
                type="text"
                value={valueSource.name.hu}
                readOnly={!isEdited}
                onChange={(e) => handleTextChange(e, 'name', 'hu')}
            />
            <label htmlFor={`${item.id}-name-en`}>Név (EN)</label>
            <input
                id={`${item.id}-name-en`}
                type="text"
                value={valueSource.name.en}
                readOnly={!isEdited}
                onChange={(e) => handleTextChange(e, 'name', 'en')}
            />
            <label htmlFor={`${item.id}-varieties-hu`}>Variációk (HU)</label>
            <input
                id={`${item.id}-varieties-hu`}
                type="text"
                value={valueSource.varieties.hu}
                readOnly={!isEdited}
                onChange={(e) => handleTextChange(e, 'varieties', 'hu')}
            />
            <label htmlFor={`${item.id}-varieties-en`}>Variációk (EN)</label>
            <input
                id={`${item.id}-varieties-en`}
                type="text"
                value={valueSource.varieties.en}
                readOnly={!isEdited}
                onChange={(e) => handleTextChange(e, 'varieties', 'en')}
            />
            <label htmlFor={`${item.id}-price`}>Ár</label>
            <input
                id={`${item.id}-price`}
                type="number"
                value={valueSource.price}
                readOnly={!isEdited}
                onChange={handlePriceChange}
            />
            <button 
                type="button" 
                onClick={() => { isEdited 
                    ? handleSave() 
                    : startEditing(item) }}>{isEdited 
                        ? 'Mentés' 
                        : 'Szerkesztés'}
            </button>
        </li>
    );
}

export default MenuItem;