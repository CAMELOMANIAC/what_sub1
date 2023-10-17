/*import { NextApiRequest, NextApiResponse } from 'next'
import { sampleUserData } from '../../../utils/sample-data'

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!Array.isArray(sampleUserData)) {
      throw new Error('Cannot find user data')
    }

    res.status(200).json(sampleUserData)
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler*/

import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../lib/db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const results = await executeQuery({ query: 'SELECT * FROM user_table', values: [] });

      if (!Array.isArray(results)) {
        throw new Error('Cannot find user data')
      } else {
        res.status(200).json(results);
      }
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else if (req.method === 'POST') {
    // POST 요청 처리
  } else if (req.method === 'PUT') {
    // PUT 요청 처리
  } else if (req.method === 'DELETE') {
    // DELETE 요청 처리
  } else {
    // 그 외의 HTTP 메서드 처리
    res.status(405).send({ message: 'Method Not Allowed' });
  }
}

export default handler