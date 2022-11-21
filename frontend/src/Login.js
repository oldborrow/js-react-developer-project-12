import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Header from './Header';

function Login() {
  const navigate = useNavigate();
  const [wrongData, setWrongData] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('loggedIn') !== 'null' && localStorage.getItem('loggedIn') !== null) {
      navigate('/');
    }
  });
  return (
    <>
      <Header />
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
            localStorage.setItem('loggedIn', values.login);
            localStorage.setItem('password', values.password);
            localStorage.setItem('userToken', response.data.token);
            navigate('/');
          }).catch((err) => {
            console.log(err);
            setWrongData(true);
          });
          setSubmitting(false);
        }}
      >
        <Form>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>
            Ваш ник
            <Field name="login" type="text" />
            <ErrorMessage name="login" />
          </label>

          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>
            Пароль
            <Field name="password" type="text" />
            <ErrorMessage name="password" />
          </label>

          <button type="submit">Войти</button>
        </Form>
      </Formik>
      {wrongData ? <h7>Неверные имя пользователя или пароль</h7> : null}
      <h1>Зарегистрироваться</h1>
      <Button onClick={() => navigate('/signup')}>Регистрация</Button>
    </>
  );
}

export default Login;
