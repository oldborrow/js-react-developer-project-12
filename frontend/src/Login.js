import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import {useEffect} from "react";
import Header from "./Header";

export default () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("loggedIn") !== "null" && localStorage.getItem("loggedIn") !== null) {
            navigate("/")
        }
    })
    return (
        <>
            <Header/>
        <h1>Войти</h1>
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
                }).catch((err) => {
                    alert("Неверные имя пользователя или пароль")
                })
                setSubmitting(false)
            }}
        >
            <Form>
                <label>Ваш ник
                <Field name="login" type="text" />
                <ErrorMessage name="login" />
                </label>

                <label>Пароль
                <Field name="password" type="text" />
                <ErrorMessage name="password" />
                </label>

                <button type="submit">Войти</button>
            </Form>
        </Formik>
            <h1>Зарегистрироваться</h1>
            <button onClick={() => navigate("/signup")}>Регистрация</button>
        </>
    )
}