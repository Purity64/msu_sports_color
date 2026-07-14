import mysql from "mysql2/promise";

declare global {
  var mysqlPool: mysql.Pool | undefined;
}