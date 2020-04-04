/**
 * Required Database Modules
 */
const mysql = require('mysql');

/**
 * Database Connection
 */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'P@ssw0rd',
    database: 'dartsapp_db',
    multipleStatements: true
});

connection.connect((err) => {
    if(err){
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});


//
// connection.end((err) => {
//     // The connection is terminated gracefully
//     // Ensures all remaining queries are executed
//     // Then sends a quit packet to the MySQL server.
// });

module.exports = {
    connection: function () {
        return connection;
    }
};