import { Component } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

type Props = {};

type State = {
    redirect: string | null,
    email: string,
    password: string,
    loading: boolean,
    message: string
};

export default class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            redirect: null,
            email: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (currentUser) {
            this.setState({ redirect: "/profile" });
        }
    }

    componentWillUnmount() {
        window.location.reload();
    }

    validationSchema() {
        return Yup.object().shape({
            email: Yup.string().required("Email is required"),
            password: Yup.string().required("Password is required"),
        });
    }

    handleLogin(formValue: { email: string; password: string }) {
        const { email, password } = formValue;

        this.setState({
            message: "",
            loading: true
        });


        AuthService.login(email, password).then(
            () => {
                this.setState({
                    redirect: "/profile"
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }

        const { loading, message } = this.state;

        const initialValues = {
            email: "",
            password: "",
        };

        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Formik
                        initialValues={initialValues}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleLogin}
                        validateOnChange={false}
                        validateOnBlur={false}
                    >
                        <Form>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field name="email" type="email" className="form-control mb-3 mt-1" />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="alert alert-danger pt-2 pb-2"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className="form-control mb-3 mt-1" />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="alert alert-danger pt-2 pb-2"
                                />
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block mt-3 w-100" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Login</span>
                                </button>
                            </div>

                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                        </Form>
                    </Formik>
                </div>
            </div>
        );
    }
}