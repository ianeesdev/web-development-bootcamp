const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = 4000;

app.get('/' ,(req, res) => {
    res.sendFile(path.join(__dirname, 'landing-page.html'));
});

app.get('/sign-up.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sign-up.html'))
})

app.post('/sign-up.html', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pass;
    oracledb.getConnection({
        user: 'system', password: 'anees', connectString: 'localhost/orcl'
        },
        function(error, conection) {
            if(error) {
                return console.error(error);
            }
            conection.execute("SELECT ID FROM LOGIN ORDER BY ID FETCH FIRST 1 ROWS ONLY",
            function(error, result) {
                if (error) {
                    return console.error(error);
                }
                insertLoginInfo(result.rows[0][0], name, email, password); 
            })
        }
    )
    res.sendFile(path.join(__dirname, '/subscription.html'));
});

function insertLoginInfo(id, name, email, password) {
    let ID = id + 1;
    oracledb.getConnection({
        user: 'system', password: 'anees', connectString: 'localhost/orcl'
        },
        function(error, conection) {
            if(error) {
                return console.error(error);
            }
            conection.execute("INSERT INTO login VALUES (:id, :name, :email, :password)",
            [ID, name, email, password],
            function(error) {
                if (error) {
                    return console.error(error);
                }
                conection.commit(
                    function(error) {
                        console.log('Done');
                    }
                )
            })
        }
    )
}

app.get('/sign-in.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/sign-in.html', (req, res) => {
    const email = req.body.email;
    const pass = req.body.Password;
    oracledb.getConnection({
        user: 'system', password: 'anees', connectString: 'localhost/orcl'
    },
    function (error, connection) {
        if (error) {
            return console.error(error);
        }
        connection.execute('SELECT EMAIL, PASSWORD FROM LOGIN WHERE EMAIL = :e AND PASSWORD = :p',
        [email, pass],
        function(error, result) {
            if (error) {
                console.error(error);
            }
            var length = result.rows.length;
            if (length != 0) {
                res.sendFile(path.join(__dirname, '/User/user-panel/Home/user-panel-home.html'));
            }
            else {
                res.redirect('/sign-in.html');
            }
        })
    })
})


app.get('/user-panel/Home/user-panel-home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Home/user-panel-home.html'));
});

app.get('/user-panel/Profile/user-panel-profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Profile/user-panel-profile.html'));
});

app.get('/user-panel/Subscriptions/user-panel-subscriptions.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Subscriptions/user-panel-subscriptions.html'));
});

app.get('/user-panel/Search%20Videos/user-panel-search.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Search Videos/user-panel-search.html'));
});

app.get('/user-panel/Request%20Videos/user-panel-request.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Request Videos/user-panel-request.html'));
});

app.get('/user-panel/Lists/user-panel-list.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Lists/user-panel-list.html'));
});

app.get('/user-panel/Others/user-panel-others.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Others/user-panel-others.html'));
});

app.get('/subscription.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'subscription.html'))
})

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin-panel-actors.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin-panel-admin.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin-panel-customers.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin-panel-dashboard.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin-panel-directors.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin-panel-media.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin-panel-producers.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin-panel-profile.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin-panel-subscribers.html'))
// })

app.get('/customer-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'customer-panel-dashboard.html'))
})

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'customer-panel-profile.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'pricing.html'))
// })

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/`);
})