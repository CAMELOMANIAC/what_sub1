// db.js
import mysql from 'mysql2/promise';

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: (process.env.MYSQL_PORT as unknown as number),
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//이곳에서 에러처리 하지 않고 에러처리는 비즈니스 로직에서 처리합니다
const executeQuery = async<T>({ query, values }: { query: string, values: Array<string|string[]|number|number[]|Date> }): Promise<T | Error> => {
  const connection = await db;
  const [results] = await connection.query(query, values);
  return results as T | Error;
}
export default executeQuery;
