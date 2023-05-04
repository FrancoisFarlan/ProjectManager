import * as bodyParser from "body-parser";
import express, {Request, Response} from "express";
import {BackendLogger} from "./logger/backend.logger";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UserModel} from './model/user.model'

class App {

    public express: express.Application;
    public logger: BackendLogger;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new BackendLogger();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        //this.express.use(express.static(path.join(__dirname, '../ui/build')));
    }

    private routes(): void {

        //Auth routes
        this.express.post("/register", async (req: Request, res: Response) => {

            // Our register logic starts here
            try {
                // Get user input
                const { firstName, lastName, email, password } = req.body;

                // Validate user input
                if (!(email && password && firstName && lastName)) {
                    res.status(400).send("All input is required");
                }

                // check if user already exist
                // Validate if user exist in our database
                const oldUser = await UserModel.findOne({ email });

                if (oldUser) {
                    return res.status(409).send("User Already Exist. Please Login");
                }

                //Encrypt user password
                const encryptedPassword = await bcrypt.hash(password, 10);

                // Create user in our database
                const user = await UserModel.create({
                    firstName,
                    lastName,
                    email: email.toLowerCase(), // sanitize: convert email to lowercase
                    password: encryptedPassword,
                });

                // Create and save token
                user.token = jwt.sign(
                    {user_id: user._id, email},
                    process.env.JWT_TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                // return new user
                res.status(201).json(user);
            } catch (err) {
                console.log(err);
            }
        });

        // this.express.post("/login", (req: Request, res: Response) => {
        //
        // });

        // handle undefined routes
        this.express.use("*", (req: Request, res: Response) => {
            res.send("This URL is incorrect");
        });
    }
}

export default new App().express;