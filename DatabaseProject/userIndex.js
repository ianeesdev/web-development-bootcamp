const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = 4000;

// landing page
app.get('/landing-page.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing-page.html'));
});

app.get('/landing-page.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing-page.css'));
});

// sign up and login
app.get('/sign-up.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sign-up.html'))
})

app.get('/form.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.css'));
});

app.get('/form.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.js'))
});

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
            conection.execute("SELECT MAX(ID) FROM LOGIN",
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

// method to add new user to database
function insertLoginInfo(id, name, email, password) {
    oracledb.getConnection({
        user: 'system', password: 'anees', connectString: 'localhost/orcl'
        },
        function(error, conection) {
            if(error) {
                return console.error(error);
            }
            conection.execute("INSERT INTO login VALUES (:id, :name, :email, :password)",
            [id + 1, name, email, password],
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

//method to authorize login
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

// user profile screens and methods

// user panel home
app.get('/user-panel-home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Home/user-panel-home.html'))
});

app.get('/user-panel-home.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Home/user-panel-home.css'))
});

app.get('/user-panel-home.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Home/user-panel-home.js'))
});

//user panel profile
app.get('/user-panel-profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Profile/user-panel-profile.html'))
});

app.get('/user-panel-profile.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Profile/user-panel-profile.css'))
});

// user panel subscription
app.get('/user-panel-subscriptions.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Subscriptions/user-panel-subscriptions.html'));
});

app.get('/user-panel-subscriptions.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Subscriptions/user-panel-subscriptions.css'))
});

app.get('/user-panel-subscriptions.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Subscriptions/user-panel-subscriptions.js'))
});

// user panel search
app.get('/user-panel-search.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Search Videos/user-panel-search.html'));
});

app.get('/user-panel-search.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Search Videos/user-panel-search.css'))
});

app.get('/user-panel-search.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Search Videos/user-panel-search.js'))
});

// user panel request
app.get('/user-panel-request.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Request Videos/user-panel-request.html'));
});

app.get('/user-panel-request.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Request Videos/user-panel-request.css'))
});

app.get('/user-panel-request.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Request Videos/user-panel-request.js'))
});

// user panel list
app.get('/user-panel-list.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Lists/user-panel-list.html'));
});

app.get('/user-panel-list.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Lists/user-panel-list.css'));
});

app.get('/user-panel-list.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Lists/user-panel-list.js'));
});

// user panel others
app.get('/user-panel-others.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Others/user-panel-others.html'));
});

app.get('/user-panel-others.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Others/user-panel-others.css'));
});

app.get('/users-panel-others.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'User/user-panel/Others/users-panel-others.js'));
});

// app.get('/subscription.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'subscription.html'))
// })

// app.get('/sign-in.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'pricing.html'))
// })

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/landing-page.html`);
})