import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send('Please authenticate');
        }

        (req as CustomRequest).token = jwt.verify(token, process.env.JWT_TOKEN_KEY);

        next();
};