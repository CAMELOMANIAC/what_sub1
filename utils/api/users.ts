import { updateReturnType } from "../../interfaces/api/db";
import { userDataType } from "../../interfaces/api/users";
import executeQuery from "../../lib/db"
import { v4 as uuidv4 } from 'uuid';

//사용자 여러명의 정보
export const getUsersData = async (): Promise<userDataType[] | Error> => {

    const query = `SELECT * FROM user_table`

    try {
        const results: userDataType[] | Error = await executeQuery({ query: query, values: [] });
        if (Array.isArray(results) && results.length < 0) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results;
        }
    } catch (err) {//실패하면 에러객체로 반환
        return err;
    }
}

//사용자 한명의 정보
export const getUserData = async (id: string): Promise<userDataType[] | Error> => {

    const query = `SELECT * FROM user_table WHERE BINARY user_id = ?`
    const valuesId = id;

    try {
        const results: userDataType[] | Error = await executeQuery({ query: query, values: [valuesId] });
        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results;
        }
    } catch (err) {
        return err;
    }
}

//로그인시 아이디,비밀번호 검증
export const checkUser = async (id: string, pwd: string): Promise<string | Error> => {

    const query = `SELECT user_id, user_pwd FROM user_table WHERE BINARY user_id = ? AND BINARY user_pwd = ?`
    const valuesId = id;
    const valuesPwd = pwd;

    try {
        const results: userDataType[] | Error = await executeQuery({ query: query, values: [valuesId, valuesPwd] });

        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            if (results instanceof Error) {
                return results
            } else {
                return results[0].user_id;
            }
        }
    } catch (err) {
        return err;
    }
}

//로그인시 세션 업데이트
export const updateSession = async (userId: string): Promise<string | Error> => {

    const query = 'UPDATE user_table SET user_session = ? WHERE user_id = ?'
    const valuesUserId = userId;
    const sessionId = uuidv4();

    try {
        const results: updateReturnType | Error = await executeQuery({ query: query, values: [sessionId, valuesUserId] });

        if ('affectedRows' in results && results.affectedRows === 0) {
            throw new Error('일치하는 행이 없거나 이미 수정되어 수정할 수 없음');
        } else {
            return sessionId;
        }

    } catch (err) {
        return err
    }
}

//쿠키를 통해 로그인 세션여부를 체크하는 함수
export const checkSession = async (cookie): Promise<string | Error> => {
    //받은 쿠키를 공백을 제거하고 배열로 만든후 다시 객체로 변환한다.
    const cookies = cookie.replaceAll(' ', '').split(';').map((item) => {
        const key = item.split('=')[0]
        const value = item.split('=')[1]
        return { key, value }
    });
    const userIdCookie = cookies.find(item => item.key === 'user');
    const userSessionCookie = cookies.find(item => item.key === 'session');

    const query = 'SELECT user_id FROM user_table WHERE BINARY user_id = ? AND BINARY user_session = ?'

    type userIdType = Pick<userDataType, 'user_id'>

    try {
        const results: userIdType | Error = await executeQuery(
            { query: query, values: [userIdCookie.value, userSessionCookie.value] }
        );

        if (Array.isArray(results) && results.length < 0) {
            throw new Error('적합한 결과가 없음')
        } else {
            if (results instanceof Error) {
                return results
            } else {
                return results[0].user_id;
            }
        }
    } catch (err) {
        return err
    }
}