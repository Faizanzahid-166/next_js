import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "mysql.railway.internal",
  user: "root",
  password: "nlScUvVVyLAcJZinojGvuHatflWBORDk",
  database: "railway",
});

export default pool;
