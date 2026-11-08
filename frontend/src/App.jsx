import React, { useState, useEffect } from "react";
import Login from "./Login";

const App = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // the Google token (the "wristband") - sent to the backend
    const [isAdmin, setIsAdmin] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);



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
    // method: "POST" | "PUT" | "DELETE"
    // path:   e.g. "/api/categories/colds/items/colds-1"
    // body:   the data to send (optional), e.g. { price: 1600 }
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
    };

    // - - - - - - TEMPORARY TEST: does the backend accept our token?
    // Sets the price of "Jégkása" (colds / colds-1) to 1600 Ft
    const handleTestRequest = async () => {
        try {
            const updatedItem = await sendAdminRequest(
                "PUT",
                "/api/categories/colds/items/colds-1",
                { price: 1600 }
            );
            console.log("Sikeres mentés:", updatedItem);
            fetchMenu(); // reload the menu, so the new price appears on the screen
        } catch (error) {
            console.error("Hiba:", error.message);
            alert("Hiba: " + error.message);
        }
    };

    // - - - - - - RENDERING THE LOGIN COMPONENT IF NOT ADMIN
    if (!isAdmin) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    console.log('App.jsx - token', token)
    // - - - - - - RENDERING THE ADMIN PANEL WITH MENU CATEGORIES AND ITEMS
    return (
        <main>
            {/* - - - - - - HEADER SECTION */}
            <header>
                <h1>SkyLounge - ADMIN</h1>
                <p>Szia, <strong>{user?.name}</strong>!</p>
                <button onClick={handleLogout}>Kijelentkezés</button>
                {/* TEMPORARY TEST BUTTON - we will remove it later */}
                <button onClick={handleTestRequest}>Teszt: Jégkása ára 1600 Ft</button>
            </header>

            {/* - - - - - - LOADING */}
            {loading && <p>Betöltés...</p>}

            {/* - - - - - - CATEGORIES AND ITEMS LIST */}
            {!loading && categories.map((category) => (
                <section key={category.id}>
                    <h2>{category.name.hu} ({category.name.en})</h2>
                    <ul>
                        {category.items.map((item) => (
                            <li key={item.id}>
                                <strong>{item.name.hu}</strong> ({item.name.en})
                                {(item.varieties.hu || item.varieties.en) && (
                                    <span> – {item.varieties.hu} / {item.varieties.en}</span>
                                )}
                                {" – "}{item.price} Ft
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </main>
    );
};

export default App;
