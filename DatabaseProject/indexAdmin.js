const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('DatabaseProject'));
app.use(express.static('DatabaseProject/views'));
app.use(express.static("DatabaseProject/User"))
app.use(express.static('DatabaseProject/Media'));
app.use(express.static('DatabaseProject/same-panels'));
app.use(express.static('DatabaseProject/other-images'));
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
app.use(express.static('DatabaseProject/other-images/Actors'));
app.use(express.static('DatabaseProject/other-images/Admin'));
app.use(express.static('DatabaseProject/other-images/Customers'));
app.use(express.static('DatabaseProject/other-images/Directors'));
app.use(express.static('DatabaseProject/other-images/Media'));
app.use(express.static('DatabaseProject/other-images/Producers'));
app.use(express.static("DatabaseProject/plugins"));
app.use(express.static('DatabaseProject/other-images/Media/Movies'));
app.use(express.static('DatabaseProject/other-images/Media/Series'));

const port = 5000;

// admin dashboard
app.get('/landing-page.html', (req, res) => {
    res.redirect("landing-page.html");
});

app.get('/login', (req, res) => {
    res.render(path.join(__dirname, "/views/login"));
});

var data = {};
//method to authorize login
app.post('/login', (req, res) => {
    const email = req.body.email;
    const pass = req.body.Password;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, connection) {
        if (error) {
            return console.error(error);
        }
        connection.execute('SELECT ADMIN.ADMIN_ID, NAME, PASSWORD, EMAIL, CONTACT, GENDER FROM ADMIN JOIN PERSON ON ADMIN.PERSON_ID = PERSON.PERSON_ID AND EMAIL = :e  AND PASSWORD = :p',
        [email, pass],
        function (error, result) {
            if (error) console.error(error);
                var length = result.rows.length;
                if (length != 0) {
                    data = result.rows[0];
                    res.redirect('/admin-panel-dashboard');
                }
            }
        )
    })
})

app.get('/admin-panel-dashboard', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-dashboard"));
})

app.get('/admin-panel-profile', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-profile"), {data});
});

app.get('/admin-panel-admin', (req, res) => {
    var adminData;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT NAME, EMAIL, PASSWORD, GENDER FROM ADMIN JOIN PERSON ON ADMIN.PERSON_ID = PERSON.PERSON_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                adminData = result.rows;
                res.render(path.join(__dirname, '/views/admin-panel-admin'), {adminData});
            })
        },
    )
});

app.get('/admin-panel-customers', (req, res) => {
    var cust_Data;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT NAME, EMAIL, PASSWORD, GENDER FROM CUSTOMER JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                cust_Data = result.rows;
                res.render(path.join(__dirname, '/views/admin-panel-customers'), {cust_Data});
            })
        },
    )
});

app.get('/admin-panel-subscribers', (req, res) => {
    var subscription_data;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT NAME, EMAIL, PASSWORD, GENDER, SUBSCRIPTION_TYPE, END_DATE FROM CUSTOMER JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID JOIN SUBSCRIPTION ON subscription.customer_id = customer.customer_id WHERE subscription.end_date>current_date`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                subscription_data = result.rows;
                res.render(path.join(__dirname, "/views/admin-panel-subscribers"), {subscription_data});
            })
        },
    )
});

app.get('/admin-panel-requests', (req, res) => {
    var reqData;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT NAME, VIDEO_NAME, DATE_REQUESTED, STATUS FROM "Video-requests" JOIN CUSTOMER ON "Video-requests".CUSTOMER_ID = CUSTOMER.CUSTOMER_ID JOIN PERSON ON PERSON.PERSON_ID = CUSTOMER.PERSON_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                reqData = result.rows;
                res.render(path.join(__dirname, "/views/admin-panel-requests"), {reqData});
                }
            )
        },
    )
});

app.get('/admin-panel-feedbacks', (req, res) => {
    let feedbacks;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT NAME, FEEDBACK_TEXT, DATE_FEEDBACK_GIVEN FROM CUSTOMER JOIN FEEDBACK ON CUSTOMER.CUSTOMER_ID = FEEDBACK.CUSTOMER_ID JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                feedbacks = result.rows;
                res.render(path.join(__dirname, "/views/admin-panel-feedbacks"), {feedbacks});
                }
            )
        },
    )
});

app.get('/admin-panel-actors', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-actors"));
});

app.get('/admin-panel-directors', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-directors"));
});

app.get('/admin-panel-episodes', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-episodes"));
});

app.get('/admin-panel-movies', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-movies"));
});

app.get('/admin-panel-producers', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-producers"));
});

app.get('/admin-panel-series', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-series"));
});

app.get('/admin-panel-videos', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-videos"));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/landing-page.html`);
})