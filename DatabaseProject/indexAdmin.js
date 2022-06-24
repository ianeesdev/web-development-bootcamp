const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('DatabaseProject/admin-panel'));
app.use(express.static('DatabaseProject/admin-panel/Actors'));
app.use(express.static('DatabaseProject/admin-panel/Admin'));
app.use(express.static('DatabaseProject/admin-panel/Customers'));
app.use(express.static('DatabaseProject/admin-panel/Dashboard'));
app.use(express.static('DatabaseProject/admin-panel/Directors'));
app.use(express.static('DatabaseProject/admin-panel/Episodes'));
app.use(express.static('DatabaseProject/admin-panel/Feedbacks'));
app.use(express.static('DatabaseProject/admin-panel/Movies'));
app.use(express.static('DatabaseProject/admin-panel/Producers'));
app.use(express.static('DatabaseProject/admin-panel/Profile'));
app.use(express.static('DatabaseProject/admin-panel/Requests'));
app.use(express.static('DatabaseProject/admin-panel/Series'));
app.use(express.static('DatabaseProject/admin-panel/Subscribers'));
app.use(express.static('DatabaseProject/admin-panel/Videos'));
app.use(express.static('DatabaseProject/User/media-images'));
app.use(express.static('DatabaseProject/other-images'));
app.use(express.static('DatabaseProject/other-images/Actors'));
app.use(express.static('DatabaseProject/other-images/Admin'));
app.use(express.static('DatabaseProject/other-images/Customers'));
app.use(express.static('DatabaseProject/other-images/Directors'));
app.use(express.static('DatabaseProject/other-images/Media'));
app.use(express.static('DatabaseProject/other-images/Producers'));
app.use(express.static("DatabaseProject/plugins"));
app.use(express.static('DatabaseProject/other-images/Media/Movies'));
app.use(express.static('DatabaseProject/other-images/Media/Series'));

const port = 4000;


// admin dashboard
app.get('/' ,(req, res) => {
    res.redirect("admin-panel-dashboard.html");
});

// admin profile
// app.get('/admin-panel-profile.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-profile.html'));
// });

// // admins
// app.get('/admin-panel-admin.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-admin.html'));
// });

// // customers
// app.get('/admin-panel-customers.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-customers.html'));
// });

// // subscriptions
// app.get('/admin-panel-subscribers.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-subscribers.html'));
// });

// // Actor
// app.get('/admin-panel-actors.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-actors.html'));
// });

// // Producer
// app.get('/admin-panel-producers.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-producers.html'));
// });

// // Director
// app.get('/admin-panel-directors.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-directors.html'));
// });

// // Videos
// app.get('/admin-panel-videos.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-videos.html'));
// });

// // Requests
// app.get('/admin-panel-requests.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-requests.html'));
// });

// Feedback
// app.get('/admin-panel-feedbacks.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-feedbacks.html'));
// });

// Settings
// Logout
// app.get('/admin-panel-media.html' ,(req, res) => {
//     res.sendFile(path.join(__dirname, '/Admin/admin-panel-media.html'));
// });

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/`);
})