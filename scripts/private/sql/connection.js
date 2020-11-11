var mysql = require('mysql2');
var conn = mysql.createPool({
    connectionLimit: 5,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

conn.on('error', function (err) {
    console.error(err);
});

module.exports = conn;