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

app.get('/admin-panel-login', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-login"));
});

var loginData = {};
//method to authorize login
app.post('/admin-panel-login', (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
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
                    loginData = result.rows[0];
                    res.redirect('/admin-panel-dashboard');
                }
                else {
                    res.redirect('admin-panel-login#redirect');
                }
            }
        )
    })
})

app.get('/admin-panel-signup', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-signup"));
})

// getting info from html fields
app.post('/admin-panel-signup', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pass;
    const gender = req.body.picker;
    const person_type = 'Admin';
    let newPerson;
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
                newPerson = "P" + (result.rows[0][0] + 50);
                insertPerson(newPerson, name, gender, person_type);
                setTimeout(() => {
                    insertAdmin(newPerson, email, password);
                }, 300);
                res.redirect("admin-panel-login");
            }
        )
    })
});

function insertAdmin(pid, email, password) {
    let newAdminId = '';
    let date = new Date();
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("SELECT COUNT(*) FROM ADMIN",
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                newAdminId = "A" + (result.rows[0][0] + 50);
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
                conection.execute("INSERT INTO ADMIN (PERSON_ID, ADMIN_ID, EMAIL, PASSWORD, DATE_CREATED) values (:p, :c, :e, :p, :d)",
                    [pid, newAdminId, email, password, date],
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

app.get('/admin-panel-dashboard', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-dashboard"));
})

app.get('/admin-panel-profile', (req, res) => {
    res.render(path.join(__dirname, "/views/admin-panel-profile"), {loginData});
});

app.get('/admin-panel-admin', (req, res) => {
    var adminData;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT PERSON.PERSON_ID, NAME, EMAIL, PASSWORD, GENDER FROM ADMIN JOIN PERSON ON ADMIN.PERSON_ID = PERSON.PERSON_ID`,
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

app.get('/admin-panel-admin/:id', (req, res) => {
    let adminID = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM PERSON WHERE PERSON_ID = :e`,
            [adminID],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-admin');
                    }
                )
            })
        },
    )
})

app.get('/admin-panel-customers', (req, res) => {
    var cust_Data;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT PERSON.PERSON_ID, NAME, EMAIL, PASSWORD, GENDER FROM CUSTOMER JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID`,
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

app.get('/admin-panel-customers/:id', (req, res) => {
    let cID = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM PERSON WHERE PERSON_ID = :e`,
            [cID],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-customers');
                    }
                )
            })
        },
    )
})

app.get('/admin-panel-subscribers', (req, res) => {
    var subscription_data;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT SUBSCRIPTION.SUBSCRIPTION_ID, NAME, EMAIL, PASSWORD, GENDER, SUBSCRIPTION_TYPE, END_DATE FROM CUSTOMER JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID JOIN SUBSCRIPTION ON subscription.customer_id = customer.customer_id WHERE subscription.end_date>current_date`,
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

app.get('/admin-panel-subscribers/:id', (req, res) => {
    let sid = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM SUBSCRIPTION WHERE SUBSCRIPTION_ID = :e`,
            [sid],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-subscribers');
                    }
                )
            })
        },
    )
})

app.get('/admin-panel-requests', (req, res) => {
    var reqData;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT REQUEST_ID, NAME, VIDEO_NAME, DATE_REQUESTED, STATUS FROM "Video-requests" JOIN CUSTOMER ON "Video-requests".CUSTOMER_ID = CUSTOMER.CUSTOMER_ID JOIN PERSON ON PERSON.PERSON_ID = CUSTOMER.PERSON_ID`,
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

app.get('/admin-panel-requests/:id', (req, res) => {
    let reqID = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM "Video-requests" WHERE REQUEST_ID = :e`,
            [reqID],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-requests');
                    }
                )
            })
        },
    )
})

app.get('/admin-panel-feedbacks', (req, res) => {
    let feedbacks;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT FEEDBACK_ID, NAME, FEEDBACK_TEXT, DATE_FEEDBACK_GIVEN FROM CUSTOMER JOIN FEEDBACK ON CUSTOMER.CUSTOMER_ID = FEEDBACK.CUSTOMER_ID JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID`,
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

app.get('/admin-panel-feedbacks/:id', (req, res) => {
    let fID = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM FEEDBACK WHERE FEEDBACK_ID = :e`,
            [fID],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-feedbacks');
                    }
                )
            })
        },
    )
})

app.get('/admin-panel-actors', (req, res) => {
    let actors;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT PERSON.PERSON_ID, NAME, GENDER, MEDIA_TITLE, CHARACTER_NAME, MEDIA_TYPE, RATING FROM PERSON JOIN ACTOR ON PERSON.PERSON_ID = ACTOR.PERSON_ID JOIN CHARACTER ON CHARACTER.ACTOR_ID = ACTOR.ACTOR_ID JOIN MEDIA ON MEDIA.MEDIA_ID = CHARACTER.MEDIA_ID`,
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                actors = result.rows;
                res.render(path.join(__dirname, "/views/admin-panel-actors"), {actors});
                }
            )
        },
    )
});

app.get('/admin-panel-actors/:id', (req, res) => {
    let actorID = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM PERSON WHERE PERSON_ID = :e`,
            [actorID],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-actors');
                    }
                )
            })
        },
    )
})

app.post('/admin-panel-actors', (req, res) => {
    let actorName = req.body.name;
    let actorGender = req.body.picker;
    const personType = 'Actor';
    let personID = '';
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
                personID = "P" + (result.rows[0][0] + 50);
                insertPerson(personID, actorName, actorGender, personType);
                setTimeout(() => {
                    insertActor(personID);
                }, 300);
                res.redirect('/admin-panel-actors');
            }
        )
    })
})

// method to add new user to database
function insertPerson(id, name, gender, person_type) {
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("Insert into PERSON (PERSON_ID,NAME,GENDER,PERSON_TYPE) values (:id, :name, :gender, :person_type)",
            [id, name, gender, person_type],
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

function insertActor(personID) {
    let actorID = '';
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("SELECT COUNT(*) FROM ACTOR",
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                actorID = "A" + (result.rows[0][0] + 50);
            }
        )
    })
    setTimeout(() => {
        oracledb.getConnection({
            user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
        }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute("Insert into ACTOR (PERSON_ID, ACTOR_ID) values (:pID, :aID)",
                [personID, actorID],
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

app.get('/admin-panel-producers', (req, res) => {
    let producers;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT PERSON.PERSON_ID, NAME, GENDER, COUNT(*) AS MOVIES FROM PERSON JOIN PRODUCER ON PERSON.PERSON_ID = PRODUCER.PERSON_ID JOIN "produced-by" ON PERSON.PERSON_ID = "produced-by".PRODUCER_PERSON_ID JOIN MEDIA ON MEDIA.MEDIA_ID = "produced-by".MEDIA_MEDIA_ID GROUP BY PERSON.PERSON_ID, NAME, GENDER`,
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

app.get('/admin-panel-producers/:id', (req, res) => {
    let pid = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM PERSON WHERE PERSON_ID = :e`,
            [pid],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-producers');
                    }
                )
            })
        },
    )
})

app.post('/admin-panel-producers', (req, res) => {
    let producerName = req.body.name;
    let producerGender = req.body.picker;
    let type = 'Producer';
    let personID = '';
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
                personID = "P" + (result.rows[0][0] + 50);
                insertPerson(personID, producerName, producerGender, type);
                setTimeout(() => {
                    insertProducer(personID);
                }, 300);
                res.redirect('/admin-panel-producers');
            }
        )
    })
})

function insertProducer(personID) {
    let producerID = '';
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("SELECT COUNT(*) FROM PRODUCER",
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                producerID = "PR" + (result.rows[0][0] + 50);
            }
        )
    })
    setTimeout(() => {
        oracledb.getConnection({
            user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
        }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute("INSERT INTO PRODUCER (PERSON_ID, PRODUCER_ID) values (:pID, :prID)",
                [personID, producerID],
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

app.get('/admin-panel-directors', (req, res) => {
    let directors;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT PERSON.PERSON_ID, NAME, GENDER, COUNT(*) AS MOVIES FROM PERSON JOIN DIRECTOR ON PERSON.PERSON_ID = DIRECTOR.PERSON_ID JOIN "directed-by" ON PERSON.PERSON_ID = "directed-by".DIRECTOR_PERSON_ID JOIN MEDIA ON MEDIA.MEDIA_ID = "directed-by".MEDIA_MEDIA_ID GROUP BY PERSON.PERSON_ID, NAME, GENDER`,
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

app.get('/admin-panel-directors/:id', (req, res) => {
    let DIR_ID = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM PERSON WHERE PERSON_ID = :e`,
            [DIR_ID],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-directors');
                    }
                )
            })
        },
    )
})

app.post('/admin-panel-directors', (req, res) => {
    let directorName = req.body.name;
    let directorGender = req.body.picker;
    let typed = "Director";
    let p_ID;
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
                p_ID = "P" + (result.rows[0][0] + 50);
                insertPerson(p_ID, directorName, directorGender, typed);
                setTimeout(() => {
                    insertDirector(p_ID);
                }, 500);
                res.redirect('/admin-panel-directors');
            }
        )
    })
})

function insertDirector(personID) {
    let directorID = '';
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
        if (error) {
            return console.error(error);
        }
        conection.execute("SELECT COUNT(*) FROM DIRECTOR",
            function (error, result) {
                if (error) {
                    return console.error(error);
                }
                directorID = "D" + (result.rows[0][0] + 50);
            }
        )
    })
    setTimeout(() => {
        oracledb.getConnection({
            user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
        }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute("INSERT INTO DIRECTOR (PERSON_ID, DIRECTOR_ID) values (:pID, :dID)",
                [personID, directorID],
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
    }, 600);
}

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
            conection.execute(`SELECT MEDIA.MEDIA_ID, MEDIA_TITLE, DATE_RELEASED, RATING FROM MEDIA JOIN MOVIE ON MEDIA.MEDIA_ID = MOVIE.MEDIA_ID`,
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

app.get('/admin-panel-movies/:id', (req, res) => {
    let movieID = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM MEDIA WHERE MEDIA_ID = :e`,
            [movieID],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-movies');
                    }
                )
            })
        },
    )
})

app.get('/admin-panel-series', (req, res) => {
    let allSeries = {};
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT MEDIA.MEDIA_ID, MEDIA_TITLE, NO_OF_SEASONS, RATING FROM  MEDIA JOIN SERIES ON MEDIA.MEDIA_ID = SERIES.MEDIA_ID`,
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

app.get('/admin-panel-series/:id', (req, res) => {
    let seriesID = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM MEDIA WHERE MEDIA_ID = :e`,
            [seriesID],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-series');
                    }
                )
            })
        },
    )
})

app.get('/admin-panel-episodes', (req, res) => {
    let allEpisodes = {};
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`SELECT EPISODE.EPISODE_ID, MEDIA_TITLE, EPISODE_TITLE, DATE_AIRED, SEASON_NO FROM SERIES JOIN MEDIA ON SERIES.MEDIA_ID = MEDIA.MEDIA_ID JOIN EPISODE ON SERIES.SERIES_ID = EPISODE.SERIES_ID`,
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

app.get('/admin-panel-episodes/:id', (req, res) => {
    let episodeID = req.params.id;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    }, function (error, conection) {
            if (error) {
                return console.error(error);
            }
            conection.execute(`DELETE FROM EPISODE WHERE EPISODE_ID = :e`,
            [episodeID],
            function (error) {
                if (error) return console.error(error);
                conection.commit(
                    function (error) {
                        if (error) return console.error(error);
                        console.log('Done');
                        res.redirect('/admin-panel-episodes');
                    }
                )
            })
        },
    )
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/landing-page`);
})