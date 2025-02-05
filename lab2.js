"use strict";
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { engine: expressHandlebars } = require('express-handlebars');
const db = require('./database');
const app = express();

const port = process.env.PORT || 3000;

// Configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Home route
app.get('/', (req, res) => {
    res.render('home', { title: 'Home Page' });
});

// About route
app.get('/about', (req, res) => {
    db.all("SELECT * FROM messages", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.render('about', { title: 'About Page', messages: rows });
        }
    });
});

// Contact route
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Page' });
});

app.post('/contact', (req, res) => {
    const { name, message } = req.body;
    db.run("INSERT INTO messages (name, message) VALUES (?, ?)", [name, message], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect('/about');
        }
    });
});

// Delete message route
app.post('/delete-message', (req, res) => {
    const { id } = req.body;
    db.run("DELETE FROM messages WHERE id = ?", [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect('/about');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});