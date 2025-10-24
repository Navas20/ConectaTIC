import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "conectatic_bd"
});

db.connect(err => {
  if (err) {
    console.error("❌ Error de conexión a MySQL:", err);
    return;
  }
  console.log("✅ Base de datos conectada desde config/db.js");
});

export default db;
