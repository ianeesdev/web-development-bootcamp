const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = 4000;

app.get('/' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-dashboard.html'));
});

app.get('/admin-panel-actors.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-actors.html'));
});

app.get('/admin-panel-admin.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-admin.html'));
});

app.get('/admin-panel-customers.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-customers.html'));
});

app.get('/admin-panel-directors.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-directors.html'));
});

// app.get('/admin-panel-media.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-media.html'));
// });

app.get('/admin-panel-producers.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-producers.html'));
});

app.get('/admin-panel-profile.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-profile.html'));
});

app.get('/admin-panel-subscribers.html' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/Admin/admin-panel-subscribers.html'));
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/`);
})