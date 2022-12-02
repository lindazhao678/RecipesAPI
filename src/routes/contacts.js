const express = require('express');
const mysql = require('mysql');
const router = express.Router();

//Create Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'recipes',
    insecureAuth : true,
    port: 8889
})

function connectMySQL(){
    console.log("connectMySQL")
    return pool;
}
  
router.post('/', (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;

    const connection = connectMySQL();
    const queryString = "INSERT INTO contacts (first_name, last_name, email, message, date) VALUES (?,?,?,?,?)"
    connection.query(queryString, [firstName, lastName, email, message, new Date()], (err, results, fields) => {
        if(err){
            res.send(`Failed to insert new contact: ${err}`);
            res.sendStatus(500);
            next(new Error(`Failed to insert new contact: ${err}`));
        }
        res.send(`Inserted a new contact with id: ${results.insertId}`);
    });  
});

router.get('/', (req, res, next) => {
  
    const connection = connectMySQL();
    const queryString = "select * from contacts";
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            res.send(`Something is wrong ${err}`);
            next(new Error(`Something is wrong ${err}`));
        }
        res.json(rows);
    });
});

module.exports = router;