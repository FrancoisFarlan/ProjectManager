import {Schema, model, Model} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// 1. Create an interface representing a document in MongoDB.
interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token?: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type:String, required: false }
});

userSchema.plugin(uniqueValidator);

// 3. Create a Model.
export const UserModel: Model<IUser> = model<IUser>('User', userSchema);
