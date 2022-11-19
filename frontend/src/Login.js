import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import {useEffect} from "react";

export default () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("loggedIn") !== "null" && localStorage.getItem("loggedIn") !== null) {
            navigate("/")
        }
    })
    return (
        <>
        <h1>Login</h1>
        <Formik
            initialValues={{ login: '', password: '' }}
            validationSchema={Yup.object({
                login: Yup.string()
                    .max(15, 'Must be 15 characters or less')
                    .required('Required'),
                password: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
            })}
            onSubmit={(values, { setSubmitting }) => {
                axios.post('api/v1/login', { username: values.login, password: values.password }).then((response) => {
                    localStorage.setItem("loggedIn", values.login)
                    localStorage.setItem("password", values.password)
                    localStorage.setItem("userToken", response.data.token)
                    navigate("/")
                })
                setSubmitting(false);

            }}
        >
            <Form>
                <label>Username
                <Field name="login" type="text" />
                <ErrorMessage name="login" />
                </label>

                <label>Password
                <Field name="password" type="text" />
                <ErrorMessage name="password" />
                </label>

                <button type="submit">Submit</button>
            </Form>
        </Formik>
            <h3>Are you a new user?</h3>
            <button onClick={() => navigate("/signup")}>Sign up here</button>
        </>
    )
}