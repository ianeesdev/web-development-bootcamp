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
app.use(express.static('DatabaseProject/css'));
app.use(express.static('DatabaseProject/js'));
app.use(express.static('DatabaseProject/Media'));
app.use(express.static('DatabaseProject/other-images'));
app.use(express.static('DatabaseProject/User/media-images'));
app.use(express.static('DatabaseProject/other-images/Media'));
app.use(express.static("DatabaseProject/plugins"));

const port = 5000;

// admin dashboard
app.get('/landing-page', (req, res) => {
    res.render(path.join(__dirname, "/views/landing-page"));
});

app.get('/user-panel-login', (req, res) => {
    res.render(path.join(__dirname, "/views/user-panel-login"));
});

var data = {};
//method to authorize login
app.post('/user-panel-login', (req, res) => {
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

app.get('/admin-panel-producers', (req, res) => {
    let producers;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT NAME, GENDER, COUNT(*) AS MOVIES FROM PERSON JOIN PRODUCER ON PERSON.PERSON_ID = PRODUCER.PERSON_ID JOIN "produced-by" ON PERSON.PERSON_ID = "produced-by".PRODUCER_PERSON_ID JOIN MEDIA ON MEDIA.MEDIA_ID = "produced-by".MEDIA_MEDIA_ID GROUP BY NAME, GENDER`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                producers = result.rows;
                res.render(path.join(__dirname, "/views/admin-panel-producers"), {producers});
                }
            )
        },
    )
});

app.get('/admin-panel-directors', (req, res) => {
    let directors;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT NAME, GENDER, COUNT(*) AS MOVIES FROM PERSON JOIN DIRECTOR ON PERSON.PERSON_ID = DIRECTOR.PERSON_ID JOIN "directed-by" ON PERSON.PERSON_ID = "directed-by".DIRECTOR_PERSON_ID JOIN MEDIA ON MEDIA.MEDIA_ID = "directed-by".MEDIA_MEDIA_ID GROUP BY NAME, GENDER`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                directors = result.rows;
                res.render(path.join(__dirname, "/views/admin-panel-directors"), {directors});
                }
            )
        },
    )
});

app.get('/admin-panel-videos', (req, res) => {
    let totalMovies = 0;
    let totalSeries = 0;
    let totalEpisodes = 0;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT COUNT(*) FROM MOVIE`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                totalMovies = result.rows;
                }
            )
        },
    )
    
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT COUNT(*) FROM SERIES`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                totalSeries = result.rows;
                }
            )
        },
    )
    
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT COUNT(*) FROM EPISODE`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                totalEpisodes = result.rows;
                }
            )
        },
    )
    setTimeout(() => {
        res.render(path.join(__dirname, "/views/admin-panel-videos"), {
            totalEpisodes, totalSeries, totalMovies
        }); 
    }, 600);
});

app.get('/admin-panel-movies', (req, res) => {
    let allMovies = {};
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT MEDIA_TITLE, DATE_RELEASED, RATING FROM MEDIA JOIN MOVIE ON MEDIA.MEDIA_ID = MOVIE.MEDIA_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                allMovies = result.rows;
                res.render(path.join(__dirname, "/views/admin-panel-movies"), {allMovies});
                }
            )
        },
    )
});

app.get('/admin-panel-series', (req, res) => {
    let allSeries = {};
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT MEDIA_TITLE, NO_OF_SEASONS, RATING FROM  MEDIA JOIN SERIES ON MEDIA.MEDIA_ID = SERIES.MEDIA_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                allSeries = result.rows;
                res.render(path.join(__dirname, "/views/admin-panel-series"), {allSeries});
                }
            )
        },
    )
});

app.get('/admin-panel-episodes', (req, res) => {
    let allEpisodes = {};
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT MEDIA_TITLE, EPISODE_TITLE, DATE_AIRED, SEASON_NO FROM SERIES JOIN MEDIA ON SERIES.MEDIA_ID = MEDIA.MEDIA_ID JOIN EPISODE ON SERIES.SERIES_ID = EPISODE.SERIES_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                allEpisodes = result.rows;
                res.render(path.join(__dirname, "/views/admin-panel-episodes"), {allEpisodes});
                }
            )
        },
    )
});

app.get('/admin-panel-actors', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-actors"));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/landing-page`);
})