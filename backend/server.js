require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());



// - - - - - - HELPER FUNCTIONS TO READ AND WRITE DATA

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');



// - - - - - - AUTHENTICATION MIDDLEWARE

const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // Check if the user email matches the allowed admin email
        if (payload.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Forbidden: You are not authorized as an admin' });
        }

        req.user = payload;
        next(); // Authorization successful, proceed to route handler
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};



// - - - - - - PUBLIC ROUTES

// - - - - - - 1. READ (GET) - Fetch all menu items (Public)

app.get('/api/menu', (req, res) => {
    const menu = readData();
    res.json(menu);
});



// - - - - - - PROTECTED ADMIN ROUTES

// - - - - - - 2. CREATE (POST) - Add a new menu item (Admin only)

app.post('/api/menu', authenticateAdmin, (req, res) => {
    const menu = readData();
    const newItem = { id: Date.now().toString(), ...req.body };
    menu.push(newItem);
    writeData(menu);
    res.status(201).json(newItem);
});

// - - - - - - 3. UPDATE (PUT) - Update an existing menu item by ID (Admin only)

app.put('/api/menu/:id', authenticateAdmin, (req, res) => {
    let menu = readData();
    const { id } = req.params;
    menu = menu.map(item => item.id === id ? { ...item, ...req.body } : item);
    writeData(menu);
    res.json({ message: 'Updated successfully!' });
});

// - - - - - - 4. DELETE (DELETE) - Remove a menu item by ID (Admin only)

app.delete('/api/menu/:id', authenticateAdmin, (req, res) => {
    let menu = readData();
    const { id } = req.params;
    menu = menu.filter(item => item.id !== id);
    writeData(menu);
    res.json({ message: 'Deleted successfully!' });
});

app.listen(PORT, () => console.log(`Backend running on: http://localhost:${PORT}`));