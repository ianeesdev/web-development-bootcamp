const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('DatabaseProject'));
app.use(express.static("DatabaseProject/User"))
app.use(express.static('DatabaseProject/Media'));
app.use(express.static('DatabaseProject/same-panels'));
app.use(express.static('DatabaseProject/other-images'));
app.use(express.static('DatabaseProject/User/user-panel/Play'));
app.use(express.static('DatabaseProject/User/user-panel/Profile'));
app.use(express.static('DatabaseProject/User/user-panel/Lists'));
app.use(express.static('DatabaseProject/User/user-panel/Others'));
app.use(express.static('DatabaseProject/User/user-panel/Request Videos'));
app.use(express.static('DatabaseProject/User/user-panel/Search Videos'));
app.use(express.static('DatabaseProject/User/user-panel/Subscriptions'));

const port = 4000;

// landing page
app.get('/landing-page.html', (req, res) => {
    res.redirect("landing-page.html");
});

app.post('/user-panel-sign-up.html', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pass;
    const gender = req.body.picker;
    const person_type = 'Customer';
    let person_id = 0;
    let cust_id = 0;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    },
        function (error, conection) {
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
    res.redirect("user-panel-subscription.html");
});

// method to add new user to database
function insertPersonInfo(id, name, gender, person_type) {
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    },
    function (error, conection) {
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

//method to authorize login
app.post('/login.html', (req, res) => {
    const email = req.body.email;
    const pass = req.body.Password;
    oracledb.getConnection({
        user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
    },
    function (error, connection) {
        if (error) {
            return console.error(error);
        }
        connection.execute('SELECT EMAIL, PASSWORD FROM CUSTOMER WHERE EMAIL = :e AND PASSWORD = :p',
            [email, pass],
            function (error, result) {
                if (error) {
                    console.error(error);
                }
                var length = result.rows.length;
                if (length != 0) {
                    res.redirect('user-panel-profile.html');
                }
                else {
                    res.redirect('login.html');
                }
            }
        )
    })
})

// showing user data on profile page
// function showUserData() {
//     oracledb.getConnection({
//         user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
//     },
//         function (error, conection) {
//             if (error) {
//                 return console.error(error);
//             }
//             conection.execute('SELECT NAME, PASSWORD, EMAIL, CONTACT, GENDER, DATE_CREATED FROM CUSTOMER JOIN PERSON ON PERSON.PERSON_ID = CUSTOMER.PERSON_ID AND EMAIL = :e',
//                 [email],
//                 function (error, result) {
//                     if (error) console.error(error);
//                     else return result.rows;
//                 }
//             )
//         }
//     )
// }

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/landing-page.html`);
})