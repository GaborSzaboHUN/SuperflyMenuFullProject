import React, { useState, useEffect } from "react";
import Login from "./Login";
import MenuItem from "./MenuItem";

const App = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // the Google token (the "wristband") - sent to the backend
    const [isAdmin, setIsAdmin] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [draft, setDraft] = useState(null);



    // - - - - - - LOADING MENU FROM BACKEND WHEN ADMIN LOGGED IN

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/menu");
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Hiba a menü betöltésekor:", error);
        } finally {
            setLoading(false);
        }
    };



    // - - - - - - SEND A PROTECTED (ADMIN) REQUEST TO THE BACKEND, WITH THE TOKEN

    const sendAdminRequest = async (method, path, body) => {
        const response = await fetch(`http://localhost:5000${path}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",   // "the body is JSON"
                "Authorization": `Bearer ${token}`,   // "here is my wristband"
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        // response.ok is true for status 200-299, false for e.g. 401, 403, 404
        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    };



    // - - - - - - WHEN THE ADMIN LOGGED IN, FETCH THE MENU FROM BACKEND
    useEffect(() => {
        if (isAdmin) {
            fetchMenu();
        }
    }, [isAdmin]);



    // - - - - - - LOGIN COMPONENT - SUCCESS HANDLER
    const handleLoginSuccess = (userData, googleToken) => {
        setUser(userData);
        setToken(googleToken);
        setIsAdmin(true);
    };



    // - - - - - - LOGOUT HANDLER
    const handleLogout = () => {
        setUser(null);
        setToken(null);
        setIsAdmin(false);
        setCategories([]);
        setEditingItemId(null);
        setDraft(null);
    };



    // - - - - - - START / END EDITING
    const startEditing = (item) => {
        setEditingItemId(item.id);
        setDraft({...item});
    }

    const endEditing = () =>{
        setEditingItemId(null);
        setDraft(null);
    }

    const handleSave = async (categoryId) => {
        if(draft.price === '' || isNaN(draft.price) || draft.price < 0) {
            alert("Az ár mező nem lehet üres, és csak pozitív számot tartalmazhat!");
            return;
        }

        try {
            await sendAdminRequest(
                "PUT",
                `/api/categories/${categoryId}/items/${draft.id}`,
                draft
            );
    
            endEditing();
            fetchMenu();
        } catch (error) {
            console.error("Hiba a mentés során:", error.message);
            alert("Nem sikerült menteni. Ha régen jelentkeztél be, lépj ki és be újra.");
        }
    }



    const handlePriceChange = (e) => {
        setDraft({
            ...draft, 
            price: e.target.value.length > 0 ? parseInt(e.target.value) : ''
        });
    }

    const handleTextChange = (e, field, lang) => {
        setDraft({
            ...draft,
            [field]: {
                ...draft[field],
                [lang]: e.target.value
            }
        })
    }



    // - - - - - - RENDERING THE LOGIN COMPONENT IF NOT ADMIN
    if (!isAdmin) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }



    // - - - - - - RENDERING THE ADMIN PANEL WITH MENU CATEGORIES AND ITEMS
    return (
        <main>
            {/* - - - - - - HEADER SECTION */}
            <header>
                <h1>SkyLounge - ADMIN</h1>
                <p>Szia, <strong>{user?.name}</strong>!</p>
                <button onClick={handleLogout}>Kijelentkezés</button>
            </header>

            {/* - - - - - - LOADING */}
            {loading && <p>Betöltés...</p>}

            {/* - - - - - - CATEGORIES AND ITEMS LIST */}
            {!loading && categories.map((category) => (
                <section key={category.id}>

                    <h2>{category.name.hu} ({category.name.en})</h2>
                    <ul>
                        {category.items.map((item) => {

                            return (
                                <MenuItem 
                                    key={item.id}
                                    item={item}
                                    draft={draft}
                                    editingItemId={editingItemId}
                                    handleTextChange={handleTextChange}
                                    handlePriceChange={handlePriceChange}
                                    startEditing={startEditing}
                                    handleSave={() => handleSave(category.id)}
                                />
                            )
                        })}
                    </ul>
                </section>
            ))}
        </main>
    );
};

export default App;
