import { Request, Response } from 'express';
import { getErrorMessage } from '~/utils/errors.util';
import * as userServices from '~/services/user.service';

export const login = async (req: Request, res: Response) => {
    try {
        const foundUser = await userServices.login(req.body);
        res.status(200).send(foundUser);
    } catch (error) {
        return res.status(500).send(getErrorMessage(error));
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        await userServices.register(req.body);
        res.status(200).send('User registered successfully');
    } catch (error) {
        return res.status(500).send(getErrorMessage(error));
    }
};
