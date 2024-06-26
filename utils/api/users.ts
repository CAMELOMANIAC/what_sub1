import {updateReturnType} from '../../interfaces/api/db';
import {userDataType} from '../../interfaces/api/users';
import executeQuery from '../../lib/db';
import {v4 as uuidv4} from 'uuid';
import ErrorMessage from './errorMessage';

//사용자 여러명의 정보
export const getUsersData = async (): Promise<userDataType[] | Error> => {
	const query = `SELECT * FROM user_table`;

	try {
		const results: userDataType[] | Error = await executeQuery({
			query: query,
			values: [],
		});
		if (Array.isArray(results) && results.length < 0) {
			throw new Error(ErrorMessage.NoResult);
		} else {
			return results;
		}
	} catch (err) {
		//실패하면 에러객체로 반환
		return err;
	}
};

//사용자 한명의 정보
export const getUserData = async (
	id: string,
): Promise<userDataType[] | Error> => {
	const query = `SELECT * FROM user_table WHERE BINARY user_id = ?`;
	const valuesId = id;

	try {
		const results: userDataType[] | Error = await executeQuery({
			query: query,
			values: [valuesId],
		});
		if (Array.isArray(results) && results.length < 1) {
			throw new Error(ErrorMessage.NoResult);
		} else {
			return results;
		}
	} catch (err) {
		return err;
	}
};

//사용자 이메일 정보
export const getEmail = async (id: string): Promise<string | Error> => {
	const query = `SELECT user_email FROM user_info_table WHERE BINARY user_table_user_id = ?`;
	const valuesId = id;

	try {
		const results: string | Error = await executeQuery({
			query: query,
			values: [valuesId],
		});
		if (Array.isArray(results) && results.length < 1) {
			throw new Error(ErrorMessage.NoResult);
		} else {
			return results;
		}
	} catch (err) {
		return err;
	}
};

//로그인시 아이디,비밀번호 검증
export const checkUser = async (
	id: string,
	pwd: string,
): Promise<string | Error> => {
	const query = `SELECT user_id, user_pwd FROM user_table WHERE BINARY user_id = ? AND BINARY user_pwd = ?`;
	const valuesId = id;
	const valuesPwd = pwd;

	try {
		const results: userDataType[] | Error = await executeQuery({
			query: query,
			values: [valuesId, valuesPwd],
		});

		if (Array.isArray(results) && results.length < 1) {
			throw new Error(ErrorMessage.NoResult);
		} else {
			if (results instanceof Error) {
				return results;
			} else {
				return results[0].user_id;
			}
		}
	} catch (err) {
		return err;
	}
};

//로그인시 세션 업데이트
export const updateSession = async (
	userId: string,
): Promise<string | Error> => {
	const query = 'UPDATE user_table SET user_session = ? WHERE user_id = ?';
	const valuesUserId = userId;
	const sessionId = uuidv4();

	try {
		const results: updateReturnType | Error = await executeQuery({
			query: query,
			values: [sessionId, valuesUserId],
		});

		if ('affectedRows' in results && results.affectedRows === 0) {
			throw new Error(ErrorMessage.UpdateError);
		} else {
			return sessionId;
		}
	} catch (err) {
		return err;
	}
};

//쿠키를 통해 로그인 세션여부를 체크하는 함수
export const checkSession = async (cookie): Promise<string | Error> => {
	const cookies = cookie
		.replaceAll(' ', '')
		.split(';')
		.map(item => {
			//받은 쿠키를 공백을 제거하고 배열로 만든후 다시 객체로 변환한다.
			const key = item.split('=')[0];
			const value = item.split('=')[1];
			return {key, value};
		});
	const userIdCookie = cookies.find(item => item.key === 'user');
	const userSessionCookie = cookies.find(item => item.key === 'session');

	const query =
		'SELECT user_id FROM user_table WHERE BINARY user_id = ? AND BINARY user_session = ?';

	type userIdType = Pick<userDataType, 'user_id'>; //useDatatype에서 user_id만 가져와서 사용하는 Pick 유틸리티 타입

	try {
		const results: userIdType | Error = await executeQuery({
			query: query,
			values: [userIdCookie.value, userSessionCookie.value],
		});

		if (Array.isArray(results) && results.length < 0) {
			throw new Error(ErrorMessage.NoResult);
		} else {
			if (results instanceof Error) {
				return results;
			} else {
				return results[0].user_id;
			}
		}
	} catch (err) {
		return err;
	}
};

//로그인시 인증완료를 마친 회원인지 체크하는 함수
export const checkAuthComplete = async (
	userId: string,
): Promise<true | Error> => {
	const query =
		'SELECT auth FROM user_info_table WHERE user_table_user_id = ?;';
	const valuesUserId = userId;

	try {
		const results: {auth: string}[] | Error = await executeQuery({
			query: query,
			values: [valuesUserId],
		});

		if (Array.isArray(results) && results.length < 1) {
			throw new Error(ErrorMessage.NoResult);
		} else if (results instanceof Error) {
			return results;
		} else if (results[0].auth === '1') {
			return true;
		} else {
			throw new Error(ErrorMessage.NoAuthComplete);
		}
	} catch (err) {
		return err;
	}
};

//회원가입 메일 인증번호 체크하는 함수
export const checkAuth = async (
	authNumber: string,
): Promise<boolean | Error> => {
	const query = 'SELECT auth_expired FROM user_info_table WHERE auth = ?;';
	const valuesAuthNumber = authNumber;

	try {
		const results: {auth_expired: Date}[] | Error = await executeQuery({
			query: query,
			values: [valuesAuthNumber],
		});

		if (Array.isArray(results) && results.length < 1) {
			throw new Error(ErrorMessage.NoResult);
		} else if (results instanceof Error) {
			return results;
		} else {
			if (results[0].auth_expired > new Date()) {
				return true; //만료되지 않음
			} else {
				return false; //만료됨
			}
		}
	} catch (err) {
		return err;
	}
};

//유저 테이블에 아이디와 비밀번호를 추가하는 함수
export const insertUser = async (
	userId: string,
	userPwd: string,
): Promise<updateReturnType | Error> => {
	const query = 'INSERT INTO user_table (user_id, user_pwd) VALUES (?, ?)';
	const valuesUserId = userId;
	const valuesUserPwd = userPwd;

	try {
		const results: updateReturnType | Error = await executeQuery({
			query: query,
			values: [valuesUserId, valuesUserPwd],
		});

		if ('affectedRows' in results && results.affectedRows === 0) {
			throw new Error(ErrorMessage.UpdateError);
		} else {
			return results;
		}
	} catch (err) {
		return err;
	}
};

//유저 인포 테이블에 정보를 추가하는 함수
export const insertUserInfo = async (
	userId: string,
	authorNumber: string,
	email: string,
): Promise<updateReturnType | Error> => {
	const query =
		'INSERT INTO user_info_table (user_table_user_id, auth, user_email, auth_expired) VALUES (?, ?, ?, ?)';
	const valuesUserId = userId;
	const valuesAuthorNumber = authorNumber;
	const valuesEmail = email;
	const date = new Date();
	date.setMinutes(date.getMinutes() + 30);

	try {
		const results: updateReturnType | Error = await executeQuery({
			query: query,
			values: [valuesUserId, valuesAuthorNumber, valuesEmail, date],
		});

		if ('affectedRows' in results && results.affectedRows === 0) {
			throw new Error(ErrorMessage.UpdateError);
		} else {
			return results;
		}
	} catch (err) {
		return err;
	}
};

//유저 인포 테이블에 카카오 유저 정보를 추가하는 함수
export const insertKakaoUserInfo = async (
	userId: string,
	kakaoCode: string,
): Promise<updateReturnType | Error> => {
	const query =
		'INSERT INTO user_info_table (user_table_user_id, user_kakao, auth) VALUES (?, ?, 1)';
	const valuesUserId = userId;
	const valuesKakaoCode = kakaoCode;

	try {
		const results: updateReturnType | Error = await executeQuery({
			query: query,
			values: [valuesUserId, valuesKakaoCode],
		});

		if ('affectedRows' in results && results.affectedRows === 0) {
			throw new Error(ErrorMessage.UpdateError);
		} else {
			return results;
		}
	} catch (err) {
		return err;
	}
};

//유저인포 테이블에 인증완료정보를 수정하는 함수
export const updateUserInfo = async (
	authNumber: string,
): Promise<updateReturnType | Error> => {
	const query =
		"UPDATE user_info_table SET auth='1', auth_expired=NULL WHERE auth = ?";
	const valuesAuthNumber = authNumber;

	try {
		console.log(authNumber);
		const results: updateReturnType | Error = await executeQuery({
			query: query,
			values: [valuesAuthNumber],
		});
		console.log(results);

		if ('affectedRows' in results && results.affectedRows === 0) {
			throw new Error(ErrorMessage.UpdateError);
		} else {
			return results;
		}
	} catch (err) {
		return err;
	}
};

//만료된 인증번호를 가진 컬럼을 찾는 함수
export const getExpiredAuth = async (
	authNumber?: string,
): Promise<Array<{auth: string; user_table_user_id: string}> | Error> => {
	if (authNumber) {
		const query =
			'SELECT auth, user_table_user_id FROM user_info_table WHERE auth = ? AND auth_expired < ?;';
		const valuesAuthNumber = authNumber;
		const nowDate = new Date();

		try {
			const results:
				| Array<{auth: string; user_table_user_id: string}>
				| Error = await executeQuery({
				query: query,
				values: [valuesAuthNumber, nowDate],
			});

			if (Array.isArray(results) && results.length < 0) {
				throw new Error(ErrorMessage.NoResult);
			} else {
				if (results instanceof Error) {
					return results;
				} else {
					return results;
				}
			}
		} catch (err) {
			return err;
		}
	} else {
		const query =
			'SELECT auth, user_table_user_id FROM user_info_table WHERE auth_expired < ?;';
		const nowDate = new Date();

		try {
			const results:
				| Array<{auth: string; user_table_user_id: string}>
				| Error = await executeQuery({query: query, values: [nowDate]});

			if (Array.isArray(results) && results.length < 0) {
				throw new Error(ErrorMessage.NoResult);
			} else {
				if (results instanceof Error) {
					return results;
				} else {
					return results;
				}
			}
		} catch (err) {
			return err;
		}
	}
};

//유저인포 여러명 제거
export const deleteUserInfo = async (
	authNumberArray: Array<{auth: string; user_table_user_id: string}>,
): Promise<boolean | Error> => {
	const valuesAuth = authNumberArray.map(item => item.auth);
	const placeHolder = valuesAuth.map(() => '?');
	const query = `DELETE FROM user_info_table WHERE auth IN (${placeHolder});`;

	try {
		const results: updateReturnType | Error = await executeQuery({
			query: query,
			values: valuesAuth,
		});

		if ('affectedRows' in results && results.affectedRows === 0) {
			return true;
		} else if (results instanceof Error) {
			return results;
		} else {
			return false;
		}
	} catch (err) {
		return err;
	}
};

//유저 아이디로 유저 정보 제거
export const deleteUserInfoFromUserId = async (userId: string) => {
	const query = `DELETE FROM user_info_table WHERE user_table_user_id = ?`;
	const valuesId = userId;

	const results: updateReturnType | Error = await executeQuery({
		query: query,
		values: [valuesId],
	});

	if ('affectedRows' in results && results.affectedRows === 0) {
		throw new Error(ErrorMessage.UpdateError);
	} else if (results instanceof Error) {
		throw new Error(ErrorMessage.DatabaseError);
	} else {
		return results;
	}
};

//유저 여러명 제거
export const deleteUser = async (
	authNumberArray: Array<{auth: string; user_table_user_id: string}>,
): Promise<boolean | Error> => {
	const valuesUserIdArray = authNumberArray.map(
		item => item.user_table_user_id,
	);
	const placeHolder = valuesUserIdArray.map(() => '?');
	const query = `DELETE FROM user_table WHERE user_id IN (${placeHolder}) `;

	try {
		const results: updateReturnType | Error = await executeQuery({
			query: query,
			values: valuesUserIdArray,
		});

		if ('affectedRows' in results && results.affectedRows === 0) {
			return true;
		} else if (results instanceof Error) {
			return results;
		} else {
			return false;
		}
	} catch (err) {
		return err;
	}
};

//유저 아이디로 유저 제거
export const deleteUserFromUserId = async (
	userId: string,
): Promise<boolean | Error> => {
	const query = `DELETE FROM user_table WHERE user_id = ? `;
	const valuesUserId = userId;
	const results: updateReturnType | Error = await executeQuery({
		query: query,
		values: [valuesUserId],
	});

	if ('affectedRows' in results && results.affectedRows === 0) {
		return true;
	} else if (results instanceof Error) {
		return results;
	} else {
		return false;
	}
};

//사용자 카카오 식별번호가 존재하는지 찾기
export const checkKakaoId = async (
	kakaoId: string,
): Promise<string | Error> => {
	const query = `SELECT user_table_user_id FROM user_info_table WHERE user_kakao = ?`;
	const valuesKakaoId = kakaoId;

	try {
		const results: string | Error = await executeQuery({
			query: query,
			values: [valuesKakaoId],
		});
		if (Array.isArray(results) && results.length < 1) {
			throw new Error(ErrorMessage.NoResult);
		} else {
			return results[0].user_table_user_id;
		}
	} catch (err) {
		return err;
	}
};

//비밀번호 변경
export const changePassword = async (id: string, passWord: string) => {
	const query = `UPDATE user_table SET user_pwd = ? WHERE user_id = ?`;
	const valuesPwd = passWord;
	const valuesId = id;

	const results: updateReturnType | Error = await executeQuery({
		query: query,
		values: [valuesPwd, valuesId],
	});

	if ('affectedRows' in results && results.affectedRows === 0) {
		throw new Error(ErrorMessage.UpdateError);
	} else if (results instanceof Error) {
		throw new Error(ErrorMessage.DatabaseError);
	} else {
		return results;
	}
};

//비밀번호를 가져오는 함수
export const getPassword = async (id: string) => {
	const query = `SELECT user_pwd FROM user_table WHERE user_id = ?`;
	const valuesId = id;

	const results: Array<{user_pwd: string}> | Error = await executeQuery({
		query: query,
		values: [valuesId],
	});

	if (Array.isArray(results) && results.length < 0) {
		throw new Error(ErrorMessage.NoResult);
	} else if (results instanceof Error) {
		throw new Error(ErrorMessage.DatabaseError);
	} else {
		return results;
	}
};
