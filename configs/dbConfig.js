const mysql = require("mysql");
const pool = mysql.createPool({
  host: "boschdb.cv7jmsw1ctyg.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "123456789",
  database: "boschdb",
});

module.exports = pool;
