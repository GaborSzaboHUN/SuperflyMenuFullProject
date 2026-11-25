import React, { useState } from "react";

const NewItemForm = ({ onCancel }) => {

    return (
        <>
            <p>Új tétel</p>
            <button 
                type="button"
                onClick={onCancel}>
                    Mégse
            </button>
        </>
    );
}

export default NewItemForm;