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
app.get('/landing-page', (req, res) => {
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
    let person_id;
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
                setTimeout(() => {
                    insertCustomer(person_id, email, password);
                }, 300);
                res.redirect("user-panel-subscription");
            }
        )
    },
    )
});

// method to add new user to database
function insertPersonInfo(id, name, gender, person_type) {
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
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

//method to add customer to customer table
var cust_id = '';
function insertCustomer(pid, email, password) {
    let date = new Date();
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("SELECT COUNT(*) FROM CUSTOMER",
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                cust_id = "C" + (result.rows[0][0] + 1);
            })
        }
    )
    setTimeout(() => {
        oracledb.getConnection({
            user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
        },
            function (error, conection) {
                if (error) {
                    return console.error(error);
                }
                conection.execute("Insert into CUSTOMER (PERSON_ID, CUSTOMER_ID, EMAIL, PASSWORD, DATE_CREATED) values (:p, :c, :e, :p, :d)",
                    ["P" + (pid + 2), cust_id, email, password, date],
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
    }, 300);

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
        connection.execute('SELECT CUSTOMER.CUSTOMER_ID, name, password, email, CONTACT, GENDER, DATE_CREATED, SUBSCRIPTION_TYPE, PAYMENT_METHOD, CARD_NO, SECURITY_CODE, CARDEXPIRY_DATE, END_DATE, PERSON.PERSON_ID FROM customer JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID AND EMAIL = :e  AND PASSWORD = :p JOIN subscription ON subscription.customer_id = customer.customer_id WHERE subscription.end_date>current_date',
            [email, pass],
            function (error, result) {
                if (error) console.error(error);
                var length = result.rows.length;
                if (length != 0) {
                    data = result.rows[0];
                    res.render(path.join(__dirname, '/views/user-panel-profile'), { data });
                }
                else {
                    res.redirect('user-panel-login#redirect');
                }
            }
        )
    })
})

app.get('/user-panel-profile', (req, res) => {
    res.render(path.join(__dirname, '/views/user-panel-profile'), { data });
})

//users all subscription
app.get('/user-panel-subscriptions', (req, res) => {
    let subscriptionData = {};
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, connection) {
        if (error) {
            return console.error(error);
        }
        connection.execute('SELECT SUBSCRIPTION_TYPE, PAYMENT_METHOD, END_DATE FROM SUBSCRIPTION WHERE CUSTOMER_ID = :e',
            [data[0]],
            function (error, result) {
                if (error) console.error(error);
                subscriptionData = result.rows;
                res.render(path.join(__dirname, '/views/user-panel-subscriptions'), { data, subscriptionData })
            }
        )
    })
})

app.get('/user-panel-search', (req, res) => {
    let movieData = {};
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute(`SELECT MEDIA_TITLE, DESCRIPTION, RATING, VIDEO_DURATION FROM MEDIA JOIN MOVIE ON MEDIA.MEDIA_ID = MOVIE.MEDIA_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                movieData = result.rows;
            })
    },
    )
    let seriesData = {};
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute(`SELECT MEDIA_TITLE, NO_OF_SEASONS, DESCRIPTION, RATING FROM MEDIA JOIN SERIES ON MEDIA.MEDIA_ID = SERIES.MEDIA_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                seriesData = result.rows;
            })
    },
    )
    setTimeout(() => {
        res.render(path.join(__dirname, '/views/user-panel-search'), { movieData, seriesData });
    }, 800);
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
                        "title": result.rows[0][0],
                        "rating": result.rows[0][1],
                        "description": result.rows[0][2],
                        "duration": result.rows[0][3],
                        "dateReleased": result.rows[0][4]
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
                res.render(path.join(__dirname, '/views/user-panel-request'), { data, reqData });
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
    }, function (error, conection) {
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
        conection.execute(`SELECT PLAYLIST.PLAYLIST_NAME, COUNT(*) AS Videos, PLAYLIST.DATE_PLAYLIST_CREATED FROM PERSON JOIN CUSTOMERPLAYLISTS ON PERSON_ID = CUSTOMER_PERSON_ID JOIN PLAYLIST ON CUSTOMERPLAYLISTS.PLAYLIST_PLAYLIST_ID = PLAYLIST.PLAYLIST_ID JOIN MEDIAPLAYLIST ON MEDIAPLAYLIST.PLAYLIST_PLAYLIST_ID = PLAYLIST.PLAYLIST_ID JOIN MEDIA ON MEDIA_MEDIA_ID = MEDIA.MEDIA_ID JOIN CUSTOMER ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID WHERE CUSTOMER_ID = :e GROUP BY PLAYLIST.PLAYLIST_NAME, PLAYLIST.DATE_PLAYLIST_CREATED`,
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
        res.render(path.join(__dirname, '/views/user-panel-list'), { favlist, playlist, watchLater })
    }, 800);
})


app.post('/user-panel-list', (req, res) => {
    console.log('HELLLLLO');
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute(`DELETE FROM customerfavorites WHERE CUSTOMER_PERSON_ID = :e`,
            [data[13]],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        res.redirect('/user-panel-list');
                    }
                )
            })
    },
    )
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
    }, function (error, conection) {
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
    res.render(path.join(__dirname, '/views/user-panel-subscription'));
})

app.post('/user-panel-subscription', (req, res) => {
    const cardNo = req.body.card_no;
    const cardExpMonth = req.body.month;
    const cardExpYear = req.body.year;
    const cvv_no = req.body.cvv_no;
    const subscriptionType = req.body.type;
    const paymentMethod = 'Debit';
    const startDate = new Date();
    let subscription_id = '';
    let temp = new Date();
    let cardExp = new Date(cardExpYear, cardExpMonth - 1, temp.getDate());
    let packagePrice = 0;
    let endDate = new Date();
    switch (subscriptionType) {
        case 'Basic':
            packagePrice = 450;
            endDate.setDate(new Date().getDate() + 7);
            break;
        case 'Standard':
            packagePrice = 800;
            endDate.setDate(new Date().getDate() + 30);
            break;
        case 'Premium':
            endDate.setDate(new Date().getDate() + 365);
            packagePrice = 1500;
            break;
        default:
            break;
    }

    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("SELECT COUNT(*) FROM SUBSCRIPTION",
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                subscription_id = "SU" + (result.rows[0][0] + 1);
                setTimeout(() => {
                    insertSubscription(cust_id, subscription_id, subscriptionType, packagePrice, paymentMethod, cardNo, cvv_no, cardExp, startDate, endDate);
                }, 400);
                setTimeout(() => {
                    res.redirect('user-panel-login');
                }, 500);
            }
        )
    },
    )
})

function insertSubscription(cid, sid, subType, packagePrice, payMethod, cardNo, cvvNo, cardExp, startDate, endDate) {
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("INSERT INTO SUBSCRIPTION (CUSTOMER_ID, SUBSCRIPTION_ID, SUBSCRIPTION_TYPE, PACKAGE_PRICE, PAYMENT_METHOD, CARD_NO, SECURITY_CODE, CARDEXPIRY_DATE, START_DATE, END_DATE) values (:a, :b, :c, :d, :e, :f, :g, :h, :i, :j)",
            [cid, sid, subType, packagePrice, payMethod, cardNo, cvvNo, cardExp, startDate, endDate],
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

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/landing-page`);
})