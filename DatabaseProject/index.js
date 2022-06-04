const http = require('http');
const fs = require('fs');
const { url } = require('inspector');

const hostname = '127.0.0.1';
const port = process.env.PORT || 5000;

const landingPage = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/landing-page.html');
const login = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/login.html');
const signup = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/sign-up.html');
const subscription = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/subscription.html');
const adminPanelActors = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/admin-panel-actors.html');
const adminPanelAdmin = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/admin-panel-admin.html');
const adminPanelCustomers = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/admin-panel-customers.html');
const adminPanelDashboard = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/admin-panel-dashboard.html');
const adminPanelDirectors = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/admin-panel-directors.html');
const adminPanelMedia = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/admin-panel-media.html');
const adminPanelProducers = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/admin-panel-producers.html');
const adminPanelProfile = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/admin-panel-profile.html');
const adminPanelSubscribers = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/admin-panel-subscribers.html');
const customerPanelDashboard = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/customer-panel-dashboard.html');
const customerPanelProfile = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/customer-panel-profile.html');
const pricing = fs.readFileSync('D:/Visual Studio/Javascript/DatabaseProject/pricing.html');

const server = http.createServer((req, res) => {
    console.log(req.url);
    url = req.url;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    if (url == '/') {
        res.end(landingPage);
    }
    else if (url == '/sign-up.html') {
        res.end(signup);
    }
    else if (url == '/sign-in.html') {
        res.end(login);
    }
    else if (url == '/subscription.html') {
        res.end(subscription);
    }
    else if (url == '/customer-dashboard.html') {

    }
    else {
        res.end("<h1>Error 404 - Page not found</h1>");
        res.statusCode = 404;
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// function onRequest(request, response) {
//     fs.readFile('D:/Visual Studio/Javascript/Database Project/sign-up.html','utf8', function(error, data) {
//         if (error) {
//             response.writeHead(404);
//             response.write('<h1>Contents you are looking for-not found</h1>');
//         }
//         else {
//             response.writeHead(200, {'Content-Type': 'text/html'});
//             response.write(data);
//         }
//         response.end();
//     });
// }

// const server = http.createServer(onRequest);
// server.listen(port, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });
