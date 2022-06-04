const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = 4000;
//oracledb.maxRows = 4;

const email = 'aneese421@gmail.com';
const pass = 'zz';
oracledb.getConnection({
    user: 'system', password: 'anees', connectString: 'localhost/orcl'
    },
    function(error, conection) {
        if(error) {
            return console.error(error);
        }
        conection.execute('SELECT EMAIL, PASSWORD FROM LOGIN WHERE EMAIL = :e AND PASSWORD = :p',
        [email, pass],
            function(error, result) {
                if (error) {
                    return console.error(error);
                }
                return result.rows; 
            }
        )
    }
)

// function getID(num) {
//     nu = num; 
//     console.log(nu);
// }


//insert
// oracledb.getConnection({
//     user: 'system',
//     password: 'anees',
//     connectString: 'localhost/orcl'
//     },
//     function(error, conection) {
//         if(error) {
//             return console.error(error);
//         }
//         conection.execute(
//             "INSERT INTO login VALUES (:email, :password)",
//             ['aneese421@gmail.com', '12345'],
//             function(error) {
//                 if (error) {
//                     return console.error(error);
//                 }
//                 conection.commit(
//                     function(error) {
//                         console.log('Done');
//                     }
//                 )
//             }
//         )
//     }
// )


// oracledb.createPool ({
//     user: 'system',
//     password: 'anees',
//     connectString: 'localhost/orcl',
//     poolMin: 0,
//     poolMax: 10,
//     poolIncrement: 1,
//     poolTimeout: 60
//     },
//     function(error, pool) {
//         pool.getConnection(
//             function(error, conection) {
//                 if(error) {
//                     return console.error(error);
//                 }
//                 conection.execute(
//                     "SELECT ID FROM LOGIN ORDER BY ID FETCH FIRST 1 ROWS ONLY",
//                     function(error, result) {
//                         if (error) {
//                             return console.error(error);
//                         }
//                         console.log(result.rows[0][0]);
//                     }
//                 )
//             }
//         )
//     }
// )
