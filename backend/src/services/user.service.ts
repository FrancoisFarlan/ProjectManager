import { DocumentDefinition } from 'mongoose';
import {IUser, UserModel} from '~/model/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function register(user: DocumentDefinition<IUser>): Promise<void> {
    await UserModel.create(user);
}

export async function login(user: DocumentDefinition<IUser>) {
    const foundUser = await UserModel.findOne({ email: user.email });

    if (!foundUser) {
        return new Error('Invalid credentials');
    }

    const isMatch = bcrypt.compareSync(user.password, foundUser.password);

    if (isMatch) {
        const token = jwt.sign({ _id: foundUser._id?.toString(), email: foundUser.email }, process.env.JWT_TOKEN_KEY, {
            expiresIn: '2 days',
        });

        return { user: { _id: foundUser._id, email: foundUser.email }, token: token };
    } else {
        return new Error('Invalid credentials');
    }
}