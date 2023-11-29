export type userDataType = {
    user_id: string,
    user_pwd: string,
    user_session: string | null
}

export type updateReturnType = {
    fieldCount: number,
    affectedRows: number,
    insertId: number,
    serverStatus: number,
    warningCount: number,
    message: string,
    protocol41: boolean,
    changedRows: number
}