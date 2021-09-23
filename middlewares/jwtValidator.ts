import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { DefaultResponseMessage } from '../types/DefaultResponseMessage';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtValidator = (handler : NextApiHandler) => 
    async (req : NextApiRequest, res : NextApiResponse<DefaultResponseMessage>) => {

    const {MY_SECRET_KEY} = process.env;

    if(!MY_SECRET_KEY) {
        return res.status(500).json({ error: 'Internal error' });
    }

    if(!isValidRequest(req)) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    if(req.method !== 'OPTIONS') {
        const authorization = req.headers['authorization'];

        if(!authorization) {
            return res.status(401).json({ error: 'Missing access token' });
        }

        const token = authorization.substr(7);

        if(!token) {
            return res.status(401).json({ error: 'Missing access token' });
        }

        try {
            const decodedToken = jwt.verify(token, MY_SECRET_KEY) as JwtPayload;

            if (!decodedToken){
                return res.status(401).json({ error: 'Invalid access token'});
            }

            if (req.body){
                req.body.userId = decodedToken._id;
            } else if(req.query){
                req.query.userId = decodedToken._id;
            }
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({ error: 'Internal error'});
        }
    }

    return handler(req, res);
}

export default jwtValidator;

function isValidRequest(req: NextApiRequest) {
    return req && req.headers;
}