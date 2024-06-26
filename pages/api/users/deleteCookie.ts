import {NextApiRequest, NextApiResponse} from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const cookieName = 'session';
		res.setHeader(
			'Set-Cookie',
			`${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`,
		);

		res.status(200).end();
	} else {
		res.status(405).end();
	}
};
export default handler;
