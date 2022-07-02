const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('DatabaseProject'));
app.use(express.static('DatabaseProject/views'));
app.use(express.static('DatabaseProject/css'));
app.use(express.static('DatabaseProject/js'));
app.use(express.static('DatabaseProject/Media'));
app.use(express.static('DatabaseProject/other-images'));

const port = 4000;

// landing page
app.get('/', (req, res) => {
    res.render(path.join(__dirname, "/views/landing-page"));
});

app.get('/user-panel-login', (req, res) => {
    res.render(path.join(__dirname, "/views/user-panel-login"));
});

app.get('/user-panel-signup', (req, res) => {
    res.render(path.join(__dirname, "/views/user-panel-signup"));
});

// getting info from html fields
app.post('/user-panel-signup', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pass;
    const gender = req.body.picker;
    const person_type = 'Customer';
    let person_id = 0;
    let cust_id = 0;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute("SELECT COUNT(*) FROM PERSON",
                function (error, result) {
                    if (error) {
                        return console.error(error);
                    }
                    person_id = result.rows[0][0];
                    insertPersonInfo(person_id, name, gender, person_type);
                }
            )
        },
        // function (error, conection) {
        //     if (error) {
        //         return console.error(error);
        //     }
        //     conection.execute("SELECT COUNT(*) FROM CUSTOMER",
        //     function (error, result) {
        //         if (error) {
        //             return console.error(error);
        //         }
        //         cust_id = result.rows[0][0];
        //         insertCustomer(person_id, cust_id, email, password);
        //     }
        //     )
        // }
    )
    res.redirect('/user-panel-subscription')
});

// method to add new user to database
function insertPersonInfo(id, name, gender, person_type) {
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    },function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("Insert into PERSON (PERSON_ID,NAME,GENDER,PERSON_TYPE) values (:id, :name, :gender, :person_type)",
            ["P" + (id + 2), name, gender, person_type],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                    }
                )
            }
        )
    })
}

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
        connection.execute('SELECT CUSTOMER.CUSTOMER_ID, name, password, email, CONTACT, GENDER, DATE_CREATED,SUBSCRIPTION_TYPE,PAYMENT_METHOD,CARD_NO,SECURITY_CODE,CARDEXPIRY_DATE,END_DATE FROM customer JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID AND EMAIL = :e  AND PASSWORD = :p JOIN subscription ON subscription.customer_id = customer.customer_id WHERE subscription.end_date>current_date',
        [email, pass],
        function (error, result) {
            if (error) console.error(error);
                var length = result.rows.length;
                if (length != 0) {
                    data = result.rows[0];
                    res.render(path.join(__dirname, '/views/user-panel-profile'), {data});
                }
            }
        )
    })
})

app.get('/user-panel-profile', (req, res) => {
    res.render(path.join(__dirname, '/views/user-panel-profile'), {data});    
})

app.get('/user-panel-search', (req, res) => {
    res.render(path.join(__dirname, '/views/user-panel-search'))
})

app.post('/user-panel-search', (req, res) => {
    const searchMovie = req.body.searchBox;
    const searchShow = req.body.showSearchBox;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, connection) {
        if (error) {
            return console.error(error);
        }
        connection.execute('SELECT MEDIA_TITLE, RATING, DESCRIPTION, VIDEO_DURATION, DATE_RELEASED FROM MEDIA JOIN MOVIE ON MEDIA_TITLE = :e',
        [searchMovie],
        function (error, result) {
            if (error) console.error(error);
                var length = result.rows.length;
                if (length != 0) {
                    var searchedMovie = {
                        "title"         : result.rows[0][0],
                        "rating"        : result.rows[0][1],
                        "description"   : result.rows[0][2],
                        "duration"      : result.rows[0][3],
                        "dateReleased"  : result.rows[0][4]
                    }
                    console.log(searchedMovie);
                    //res.render(path.join(__dirname, '/views/user-panel-search'), {searchedMovie});
                }
                // else {
                //     res.redirect('/login');
                // }
            }
        )
    })
})

app.get('/user-panel-request', (req, res) => {
    var reqData;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT VIDEO_NAME, DATE_REQUESTED, STATUS FROM "Video-requests" WHERE CUSTOMER_ID = :e`,
            [data[0]], function (error, result) {
                    if (error) {
                        return console.error(error);
                    }
                    reqData = result.rows;
                    res.render(path.join(__dirname, '/views/user-panel-request'), {data, reqData});
                }
            )
        },
    )
})

app.post('/user-panel-request', (req, res) => {
    let userID = req.body.userID;
    let media = req.body.mediaName;
    let status = 'Pending';
    let date = new Date();
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT COUNT(*) FROM "Video-requests"`,
                function (error, result) {
                    if (error) {
                        return console.error(error);
                    }
                    req_id = result.rows[0][0];
                    requestVideo(userID, req_id, media, status, date);
                    setTimeout(() => {
                        res.redirect('/user-panel-request')
                    }, 1000); 
                }
            )
        },
    )
})

// method to request video
function requestVideo(uID, rID, media, status, date) {
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    },function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute(`Insert into "Video-requests" (CUSTOMER_ID,REQUEST_ID,VIDEO_NAME,STATUS,DATE_REQUESTED) values (:u, :r, :n, :s, :d)`,
            [uID, 'V' + (rID + 2), media, status, date],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                    }
                )
            }
        )
    })
};

app.get('/user-panel-list', (req, res) => {
    var favlist = {};
    var playlist = {};
    var watchLater = {};
    let pid = data[0];
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT MEDIA_TITLE, DATE_FAVORITE FROM customerfavorites JOIN MEDIA ON customerfavorites.MEDIA_MEDIA_ID = MEDIA.MEDIA_ID JOIN CUSTOMER ON CUSTOMER.PERSON_ID = customerfavorites.customer_person_id AND CUSTOMER.CUSTOMER_ID = :e`,
            [pid],
                function (error, result) {
                    if (error) {
                        return console.error(error);
                    }
                    favlist = result.rows;
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
            conection.execute(`SELECT MEDIA_TITLE, DATE_ADDED_LATER FROM "Watch-later" JOIN MEDIALATER ON MEDIALATER."Watch-later_watchLater_ID" = "Watch-later".WATCHLATER_ID JOIN MEDIA ON MEDIALATER.MEDIA_MEDIA_ID = MEDIA.MEDIA_ID JOIN CUSTOMERLATER ON CUSTOMERLATER."Watch-later_watchLater_ID" = MEDIALATER."Watch-later_watchLater_ID" JOIN CUSTOMER ON CUSTOMER.PERSON_ID = CUSTOMERLATER.CUSTOMER_PERSON_ID AND CUSTOMER.CUSTOMER_ID = :e `,
            [pid],
                function (error, result) {
                    if (error) {
                        return console.error(error);
                    }
                    watchLater = result.rows;
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
            conection.execute(`SELECT DISTINCT PLAYLIST_NAME, MEDIA_TITLE, DATE_PLAYLIST_CREATED FROM PLAYLIST JOIN MEDIAPLAYLIST ON PLAYLIST.PLAYLIST_ID = MEDIAPLAYLIST.PLAYLIST_PLAYLIST_ID JOIN MEDIA ON MEDIAPLAYLIST.MEDIA_MEDIA_ID = MEDIA.MEDIA_ID JOIN CUSTOMERPLAYLISTS ON CUSTOMERPLAYLISTS.PLAYLIST_PLAYLIST_ID = MEDIAPLAYLIST.PLAYLIST_PLAYLIST_ID JOIN CUSTOMER ON CUSTOMERPLAYLISTS.CUSTOMER_PERSON_ID = CUSTOMER.PERSON_ID AND CUSTOMER.CUSTOMER_ID = :e`,
            [pid],
                function (error, result) {
                    if (error) {
                        return console.error(error);
                    }
                    playlist = result.rows;
                }
            )
        },
    )
    setTimeout(() => {
        res.render(path.join(__dirname, '/views/user-panel-list'), {favlist, playlist, watchLater})
    }, 2000);
})

app.get('/user-panel-others', (req, res) => {
    res.render(path.join(__dirname, '/views/user-panel-others'))
})

app.post('/user-panel-others', (req, res) => {
    let user_id = data[0];
    let feedback = req.body.feedbackText;
    let date = new Date();
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute("SELECT COUNT(*) FROM FEEDBACK",
                function (error, result) {
                    if (error) {
                        return console.error(error);
                    }
                    let feedback_id = result.rows[0][0];
                    insertFeedback(user_id, feedback_id, feedback, date);
                }
            )
        },
    )
})

function insertFeedback(uid, fid, text, date) {
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    },function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("Insert into FEEDBACK (CUSTOMER_ID, FEEDBACK_ID, FEEDBACK_TEXT, DATE_FEEDBACK_GIVEN) values (:a, :b, :c, :d)",
            [uid, "F" + (fid + 2), text, date],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                    }
                )
            }
        )
    })
}

app.get('/user-panel-play-movies', (req, res) => {
    res.render(path.join(__dirname, '/views/user-panel-play-movies'))
})

app.get('/user-panel-play-series', (req, res) => {
    res.render(path.join(__dirname, '/views/user-panel-list'))
})

// new customer subscription page
app.get('/user-panel-subscription', (req, res) => {
    res.render(path.join(__dirname, '/views/user-panel-subscription'), {data})
})

//users own subscription
app.get('/user-panel-subscriptions', (req, res) => {
    res.render(path.join(__dirname, '/views/user-panel-subscriptions'), {data})
})

// function insertCustomer(pid, cid, email, password) {
//     oracledb.getConnection({
//         user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
//     },
//     function (error, conection) {
//         if (error) {
//             return console.error(error);
//         }
//         conection.execute("Insert into CUSTOMER (PERSON_ID, CUSTOMER_ID, EMAIL, PASSWORD) values (:pid, :cid, :email, :password)",
//             ["P" + (pid + 2), "C" + (cid + 1), email, password],
//             function (error) {
//                 if (error) return console.error(error);
//                 conection.commit(
//                     function (error) {
//                         if (error) return console.error(error);
//                         console.log('Done');
//                     }
//                 )
//             }
//         )
//     })
// }

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/`);
})