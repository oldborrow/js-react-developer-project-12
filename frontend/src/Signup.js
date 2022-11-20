import * as Yup from "yup";
import axios from "axios";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Header from "./Header";

export default () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("loggedIn") !== "null" && localStorage.getItem("loggedIn") !== null) {
            navigate("/")
        }
    })
    return (<>
            <Header/>
        <h3>Зарегистрироваться</h3>
    <Formik
        initialValues={{ login: '', password: '', confirmPassword: '' }}
        validationSchema={Yup.object({
            login: Yup.string()
                .max(20, 'От 3 до 20 символов')
                .min(3, 'От 3 до 20 символов')
                .required('Required'),
            password: Yup.string().min(6, 'Не менее 6 символов').required('Required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
        })}
        onSubmit={(values, { setSubmitting }) => {
            axios.post('/api/v1/signup', { username: values.login, password: values.password }).then((response) => {
                localStorage.setItem("loggedIn", values.login)
                localStorage.setItem("password", values.password)
                localStorage.setItem("userToken", response.data.token)
                navigate("/")
            }).catch((err) => {
                alert("User already exists")
                console.log(err)
            });
            setSubmitting(false);

        }}
    >
        <Form>
            <label>Имя пользователя
                <Field name="login" type="text" />
                <ErrorMessage name="login" />
            </label>

            <label>Пароль
                <Field name="password" type="text" />
                <ErrorMessage name="password" />
            </label>

            <label>Подтверждение пароля
                <Field name="confirmPassword" type="text" />
                <ErrorMessage name="confirmPassword" />
            </label>

            <button type="submit">Зарегистрироваться</button>
        </Form>
    </Formik>


        </>
    )

}