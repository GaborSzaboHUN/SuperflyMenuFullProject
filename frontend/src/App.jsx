import React, { useState, useEffect } from "react";
import Login from "./Login";

const App = () => {
    const [user, setUser] = useState(null);
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

    // - - - - - - WHEN THE ADMIN LOGGED IN, FETCH THE MENU FROM BACKEND
    useEffect(() => {
        if (isAdmin) {
            fetchMenu();
        }
    }, [isAdmin]);

    // - - - - - - LOGIN COMPONENT - SUCCESS HANDLER
    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsAdmin(true);
    };

    // - - - - - - LOGOUT HANDLER
    const handleLogout = () => {
        setUser(null);
        setIsAdmin(false);
        setCategories([]);
    };

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
