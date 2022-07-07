const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const { DATE } = require('oracledb');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = 4000;
//oracledb.maxRows = 4;

// // const email = 'aneese421@gmail.com';
// // const pass = 'zz';
// // oracledb.getConnection({
// //     user: 'system', password: 'anees', connectString: 'localhost/orcl'
// //     },
// //     function(error, conection) {
// //         if(error) {
// //             return console.error(error);
// //         }
// //         conection.execute('SELECT EMAIL, PASSWORD FROM LOGIN WHERE EMAIL = :e AND PASSWORD = :p',
// //         [email, pass],
// //             function(error, result) {
// //                 if (error) {
// //                     return console.error(error);
// //                 }
// //                 return result.rows; 
// //             }
// //         )
// //     }
// // )

// // let email = 'ash162@gmail.com'
// // let pass = 'Ashsimps';

// // oracledb.getConnection({
// //     user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// // }, function (error, connection) {
// //     if (error) {
// //         return console.error(error);
// //     }
// //     connection.execute('SELECT CUSTOMER.CUSTOMER_ID, name, password, email, CONTACT, GENDER, DATE_CREATED,SUBSCRIPTION_TYPE,PAYMENT_METHOD,CARD_NO,SECURITY_CODE,CARDEXPIRY_DATE,END_DATE FROM customer JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID AND EMAIL = :e  AND PASSWORD = :p JOIN subscription ON subscription.customer_id = customer.customer_id WHERE subscription.end_date>current_date',
// //     [email, pass],
// //     function (error, result) {
// //         if (error) console.error(error);
// //             var length = result.rows.length;
// //             if (length != 0) {
// //                 data = result.rows[0];
// //                 console.log(data);
// //                 //res.render(path.join(__dirname, '/views/user-panel-profile'), {data});
// //             }
// //         }
// //     )
// // })

// function selectingUserFav() {
//     oracledb.getConnection({
//         user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
//     }, function (error, conection) {
//             if (error) {
//                 return console.error(error);
//             }
//             conection.execute(`SELECT MEDIA_TITLE, DATE_FAVORITE FROM customerfavorites JOIN MEDIA ON customerfavorites.MEDIA_MEDIA_ID = MEDIA.MEDIA_ID AND customerfavorites.customer_person_id = :e`,
//             ['P2'],
//                 function (error, result) {
//                     if (error) {
//                         return console.error(error);
//                     }
//                     let favlist = {};
//                     favlist = result.rows;
//                     console.log(favlist);
//                 }
//             )
//         },
//     )
//     oracledb.getConnection({
//         user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
//     }, function (error, conection) {
//             if (error) {
//                 return console.error(error);
//             }
//             conection.execute(`SELECT MEDIA_TITLE, DATE_ADDED_LATER FROM "Watch-later" JOIN MEDIALATER ON MEDIALATER."Watch-later_watchLater_ID" = "Watch-later".WATCHLATER_ID JOIN MEDIA ON MEDIALATER.MEDIA_MEDIA_ID = MEDIA.MEDIA_ID JOIN CUSTOMERLATER ON CUSTOMERLATER."Watch-later_watchLater_ID" = MEDIALATER."Watch-later_watchLater_ID" AND CUSTOMERLATER.CUSTOMER_PERSON_ID = :e `,
//             ['P2'],
//                 function (error, result) {
//                     if (error) {
//                         return console.error(error);
//                     }
//                     let watchLater = result.rows;
//                     console.log(watchLater);
//                 }
//             )
//         },
//     )
//     oracledb.getConnection({
//         user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
//     }, function (error, conection) {
//             if (error) {
//                 return console.error(error);
//             }
//             conection.execute(`SELECT DISTINCT PLAYLIST_NAME, MEDIA_TITLE, DATE_PLAYLIST_CREATED FROM PLAYLIST JOIN MEDIAPLAYLIST ON PLAYLIST.PLAYLIST_ID = MEDIAPLAYLIST.PLAYLIST_PLAYLIST_ID JOIN MEDIA ON MEDIAPLAYLIST.MEDIA_MEDIA_ID = MEDIA.MEDIA_ID JOIN CUSTOMERPLAYLISTS ON CUSTOMERPLAYLISTS.PLAYLIST_PLAYLIST_ID = MEDIAPLAYLIST.PLAYLIST_PLAYLIST_ID AND CUSTOMERPLAYLISTS.CUSTOMER_PERSON_ID = :e`,
//             ['P2'],
//                 function (error, result) {
//                     if (error) {
//                         return console.error(error);
//                     }
//                     let play = result.rows;
//                     console.log(play);
//                 }
//             )
//         },
//     )

// }
// selectingUserFav()
// // oracledb.getConnection({
// //     user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// //     },
// //     function(error, conection) {
// //         if(error) {
// //             return console.error(error);
// //         }
// //         conection.execute('SELECT MEDIA_TITLE, RATING, DESCRIPTION, VIDEO_DURATION, DATE_RELEASED FROM MEDIA JOIN MOVIE ON MEDIA.MEDIA_ID = MOVIE.MEDIA_ID AND MEDIA_TITLE = :e',
// //         [email],
// //         function (error, result) {
// //             if (error) console.error(error);
// //             console.log(result.rows[0])
// //         })
// //     }
// // )

// // oracledb.getConnection({
// //   user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// // // },function (error, conection) {
// // //   if (error) {
// // //       return console.error(error);
// // //   }
// // //   conection.execute(`Insert into "Video-requests" (CUSTOMER_ID,REQUEST_ID,VIDEO_NAME,STATUS) values (:u, :r, :n, :s)`,
// // //       ['C2', 'V' + 2, 'rrr', 'Pending'],
// // //       function (error) {
// // //           if (error) return console.error(error);
// // //           conection.commit(
// // //               function (error) {
// // //                   if (error) return console.error(error);
// // //                   console.log('Done');
// // //               }
// // //           )
// // //       }
// // //   )
// // // })



// // var id = 'C2';
// // oracledb.getConnection({
// //     user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// // }, function (error, conection) {
// //         if (error) {
// //             return console.error(error);
// //         }
// //         conection.execute(`SELECT MEDIA_TITLE, DATE_FAVORITE FROM customerfavorites JOIN MEDIA ON customerfavorites.MEDIA_MEDIA_ID = MEDIA.MEDIA_ID AND customerfavorites.customer_person_id = :e`,
// //         ['P2'], function (error, result) {
// //                 if (error) {
// //                     return console.error(error);
// //                 }
// //                 //var res = result.rows;
// //                 console.log(result.rows);
// //             }
// //         )
// //     },
// // )

// // function let() {

// // }

// // var favlist;
// // let f1 = (userID, f2) => {
// //     oracledb.getConnection({
// //         user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// //     }, function (error, conection) {
// //             if (error) {
// //                 return console.error(error);
// //             }
// //             conection.execute(`SELECT PERSON_ID FROM CUSTOMER WHERE CUSTOMER_ID = :E`,
// //             [userID], function (error, result) {
// //                     if (error) {
// //                         return console.error(error);
// //                     }
// //                     let temp = result.rows[0][0];
// //                     f2(temp);
// //                     //return temp;
// //                     //console.log(temp);
// //                 }
// //             )
// //         },
// //     )
// // }

// // let f2 = (id) => {
// //     //var favlist;
// //     oracledb.getConnection({
// //         user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// //     }, function (error, conection) {
// //             if (error) {
// //                 return console.error(error);
// //             }
// //             conection.execute(`SELECT MEDIA_TITLE, DATE_FAVORITE FROM customerfavorites JOIN MEDIA ON customerfavorites.MEDIA_MEDIA_ID = MEDIA.MEDIA_ID AND customerfavorites.customer_person_id = :e`,
// //             [id],
// //                 function (error, result) {
// //                     if (error) {
// //                         return console.error(error);
// //                     }
// //                     favlist = result.rows;
// //                     //console.log(favlist[0])
// //                 }
// //             )
// //         },
// //     )
// // }
// // f1('C2', f2);
// // console.log(favlist);

// // function selectingUserFav() {
// //     let userID = 'C2';
// //     var person_id;
// //     oracledb.getConnection({
// //         user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// //     }, function (error, conection) {
// //             if (error) {
// //                 return console.error(error);
// //             }
// //             conection.execute(`SELECT PERSON_ID FROM CUSTOMER WHERE CUSTOMER_ID = :E`,
// //             [userID], function (error, result) {
// //                     if (error) {
// //                         return console.error(error);
// //                     }
// //                     let temp = result.rows[0][0];
// //                     person_id = temp;
// //                     console.log(person_id);
// //                 }
// //             )
// //         },
// //     )
// //     console.log(person_id);
// //     let title = '';
// //     oracledb.getConnection({
// //         user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// //     }, async function (error, conection) {
// //             if (error) {
// //                 return console.error(error);
// //             }
// //             conection.execute(`SELECT MEDIA_TITLE, DATE_FAVORITE FROM customerfavorites JOIN MEDIA ON customerfavorites.MEDIA_MEDIA_ID = MEDIA.MEDIA_ID AND customerfavorites.customer_person_id = :e`,
// //             [person_id],
// //                 function (error, result) {
// //                     if (error) {
// //                         return console.error(error);
// //                     }
// //                     let favlist = result.rows;
// //                     //console.log(favlist)
// //                 }
// //             )
// //         },
// //     )
// // }
// // selectingUserFav();
// // function getID(num) {
// //     nu = num; 
// //     console.log(nu);
// // }


// //insert
// // oracledb.getConnection({
// //     user: 'system',
// //     password: 'anees',
// //     connectString: 'localhost/orcl'
// //     },
// //     function(error, conection) {
// //         if(error) {
// //             return console.error(error);
// //         }
// //         conection.execute(
// //             "INSERT INTO login VALUES (:email, :password)",
// //             ['aneese421@gmail.com', '12345'],
// //             function(error) {
// //                 if (error) {
// //                     return console.error(error);
// //                 }
// //                 conection.commit(
// //                     function(error) {
// //                         console.log('Done');
// //                     }
// //                 )
// //             }
// //         )
// //     }
// // )


// // oracledb.createPool ({
// //     user: 'system',
// //     password: 'anees',
// //     connectString: 'localhost/orcl',
// //     poolMin: 0,
// //     poolMax: 10,
// //     poolIncrement: 1,
// //     poolTimeout: 60
// //     },
// //     function(error, pool) {
// //         pool.getConnection(
// //             function(error, conection) {
// //                 if(error) {
// //                     return console.error(error);
// //                 }
// //                 conection.execute(
// //                     "SELECT ID FROM LOGIN ORDER BY ID FETCH FIRST 1 ROWS ONLY",
// //                     function(error, result) {
// //                         if (error) {
// //                             return console.error(error);
// //                         }
// //                         console.log(result.rows[0][0]);
// //                     }
// //                 )
// //             }
// //         )
// //     }
// // )


// // const poool = oracledb.createPool({
// //     user: 'dbProject',
// //     password: 'anees',
// //     connectString: 'localhost/orcl',
// //     poolAlias: 'hrpool'
// //   });
  
// // const connection = poool.getConnection('hrpool');

// // const result = connection.execute('SELECT MEDIA_TITLE, RATING, DESCRIPTION, VIDEO_DURATION, DATE_RELEASED FROM MEDIA JOIN MOVIE ON MEDIA.MEDIA_ID = MOVIE.MEDIA_ID AND MEDIA_TITLE = :e',
// // [email, password],
// // );
// // console.log(result.rows);

// var dateString = new Date();
// console.log(dateString.toDateString());

// var next = new Date();
// next.setDate(new Date().getDate() + 7);
// console.log(next.toDateString().split(' ').slice(1).join(' '));

let month = 7;
let year = 2022;
let aa = new Date();
let cardExp = new Date(year, month - 1, aa.getDate() + 1);
console.log(cardExp.toDateString());

//console.log(dateString.getDate() + 7, dateString.getUTCMonth(), dateString.getFullYear());

let totalEpisodes;
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
            console.log("P" + (totalEpisodes[0][0] + 50));
            }
        )
    },
)

// let email = "ash162@gmail.com";
// let pass = 'Ashsimps';
// oracledb.getConnection({
//     user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// }, function (error, connection) {
//     if (error) {
//         return console.error(error);
//     }
//     connection.execute('SELECT CUSTOMER.CUSTOMER_ID, name, password, email, CONTACT, GENDER, DATE_CREATED,SUBSCRIPTION_TYPE,PAYMENT_METHOD,CARD_NO,SECURITY_CODE,CARDEXPIRY_DATE,END_DATE FROM customer JOIN PERSON ON CUSTOMER.PERSON_ID = PERSON.PERSON_ID AND EMAIL = :e  AND PASSWORD = :p JOIN subscription ON subscription.customer_id = customer.customer_id WHERE subscription.end_date>current_date',
//     [email, pass],
//     function (error, result) {
//         if (error) console.error(error);
//             var length = result.rows.length;
//             if (length != 0) {
//                 data = result.rows;
//                 console.log(data);
//                 //res.render(path.join(__dirname, '/views/user-panel-profile'), {data});
//             }
//         }
//     )
// })


// oracledb.getConnection({
//     user: 'dbProject', password: 'anees', connectString: 'localhost/orcl'
// }, function (error, connection) {
//     if (error) {
//         return console.error(error);
//     }
//     connection.execute('SELECT SUBSCRIPTION_TYPE, PAYMENT_METHOD, END_DATE FROM SUBSCRIPTION WHERE CUSTOMER_ID = :e',
//     ["C2"],
//     function (error, result) {
//         if (error) console.error(error);
//             var length = result.rows.length;
//             if (length != 0) {
//                 data = result.rows;
//                 console.log(data);
//             }
//         }
//     )
// })