import mysql from "mysql2/promise";

let pool2: mysql.Pool;

if (process.env.NODE_ENV === "production") {
  pool2 = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || "3306"),
    waitForConnections: true,
    connectionLimit: 10, // จำกัดไม่ให้เชื่อมต่อพร้อมกันเกิน 10 รายการ
    queueLimit: 0,
  });
} else {
  // ในช่วง Development ป้องกันไม่ให้ Next.js ทำการ Re-create pool ทุกครั้งที่เซฟโค้ด
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: parseInt(process.env.DB_PORT || "3306"),
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }
  pool2 = global.mysqlPool;
}

export const pool = pool2;