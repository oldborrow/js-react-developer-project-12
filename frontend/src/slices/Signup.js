import * as Yup from "yup";
import axios from "axios";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useNavigate} from "react-router-dom";

export default () => {
    const navigate = useNavigate();

    return (<>
        <h1>Sign up</h1>
    <Formik
        initialValues={{ login: '', password: '', confirmPassword: '' }}
        validationSchema={Yup.object({
            login: Yup.string()
                .max(20, 'Must be from 3 to 20 characters')
                .min(3, 'Must be from 3 to 20 characters')
                .required('Required'),
            password: Yup.string().min(6, 'Must be 6 characters or more').required('Required'),
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
        </>
    )
}