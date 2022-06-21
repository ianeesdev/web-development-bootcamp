const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = 4000;


// admin dashboard
app.get('/' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-dashboard.html'));
});

app.get('/admin-panel-dashboard.css' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-dashboard.css'));
});

app.get('/admin-panel-dashboard.js' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-dashboard.js'));
});

// admin profile
app.get('/admin-panel-profile.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-profile.html'));
});

app.get('/same-panels/panel-profile.css' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/panel-profile.css'));
});

app.get('/admin-panel-profile.js' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-profile.js'));
});

// admins
app.get('/admin-panel-admin.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-admin.html'));
});

app.get('/admin-panel-table.css' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-table.css'));
});

app.get('/admin-panel-admin.js' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-admin.js'));
});

// customers
app.get('/admin-panel-customers.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-customers.html'));
});

app.get('/admin-panel-customers.js' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-customers.js'));
});

// subscriptions
app.get('/admin-panel-subscribers.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-subscribers.html'));
});

app.get('/admin-panel-subscribers.js' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-subscribers.js'));
});

// Actor
app.get('/admin-panel-actors.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-actors.html'));
});

app.get('/admin-panel-actors.css' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-actors.css'));
});

app.get('/admin-panel-actors.js' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-actors.js'));
});

// Producer
app.get('/admin-panel-producers.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-producers.html'));
});

app.get('/admin-panel-producers.js' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-producers.js'));
});

// Director
app.get('/admin-panel-directors.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-directors.html'));
});

app.get('/admin-panel-directors.js' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-directors.js'));
});

// Videos
app.get('/admin-panel-videos.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-videos.html'));
});

app.get('/admin-panel-videos.css' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-videos.css'));
});

// Requests
app.get('/admin-panel-requests.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-requests.html'));
});

// Feedback
app.get('/admin-panel-feedbacks.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-feedbacks.html'));
});

// Settings
// Logout
// app.get('/admin-panel-media.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-media.html'));
// });


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/`);
})