const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pabitra@2006',
    database: 'agriculture_supply_chain'
});

connection.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed");
        console.error(err);
        return;
    }
    console.log("MySQL Connected Successfully");
});

module.exports = connection;
