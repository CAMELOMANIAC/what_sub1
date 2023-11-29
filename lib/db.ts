// db.js
import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT!),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    multipleStatements: true//기본적으로 sql인젝션 공격을 방지하기 위해 다중 문장은 지원하지 않는다.(다중 문장 지원을 위해서는 이 옵션을 켜야 한다.)
  }
});

//이곳에서 에러처리 하지 않고 에러처리는 비즈니스 로직에서 처리합니다
const executeQuery = async<T>({ query, values }: { query: string, values: string[] }): Promise<T|Error> => {
  const results = await db.query<T>(query, values); // db.query 함수에도 제네릭을 적용합니다.
  await db.end();
  return results;
}



export default executeQuery;
