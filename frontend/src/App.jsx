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
        <div className="container my-5">
            {/* - - - - - - HEADER SECTION */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded shadow-sm">
                <div>
                    <h4 className="m-0 fw-bold">Superfly Admin Panel</h4>
                    <small className="text-muted">Szia, <strong>{user?.name}</strong>!</small>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Kijelentkezés
                </button>
            </div>

            {/* - - - - - - LOADING*/}
            {loading && (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Betöltés...</span>
                    </div>
                </div>
            )}

            {/* - - - - - - CATEGORIES AND ITEMS LIST */}
            {!loading && categories.length > 0 && (
                <div className="row">
                    {categories.map((category) => (
                        <div key={category.id} className="col-12 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <h5 className="m-0">{category.name.hu} <small className="text-white-50">({category.name.en})</small></h5>
                                </div>
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush">
                                        {category.items.map((item) => (
                                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <div>
                                                    <h6 className="m-0 fw-bold">{item.name.hu} <small className="text-muted">({item.name.en})</small></h6>
                                                    {(item.varieties.hu || item.varieties.en) && (
                                                        <small className="text-secondary d-block">
                                                            {item.varieties.hu} / {item.varieties.en}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <span className="badge bg-success fs-6">{item.price} Ft</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;