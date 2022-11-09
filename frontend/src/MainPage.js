import React, {useEffect, useContext} from 'react';
import { useNavigate  } from "react-router-dom";
import axios from "axios";
import { useSelector } from 'react-redux';
import { actions as messengerActions} from "./slices/messengerSlice";
import { useDispatch } from 'react-redux';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import {Button} from "react-bootstrap";
import { io } from "socket.io-client";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";


const MainPage = () => {
    const userInfo = useSelector((state) => state.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const socket = io()
    axios.post('api/v1/login', { username: localStorage.getItem("loggedIn"), password: localStorage.getItem("password") }).then((response) => {
        console.log(userInfo)
    }).catch((err) => {
        alert("idk")
    });

    useEffect(() => {
        console.log(localStorage)
        // if (userInfo.name !== "") {
        //     navigate("/login")
        // } else {
            // console.log(localStorage.getItem("loggedIn"))
            // console.log(localStorage.getItem("password"))
            // axios.post('api/v1/login', { username: localStorage.getItem("loggedIn"), password: localStorage.getItem("password") }).then((response) => {
            //     console.log("authorization succeed")
            // })
        // }
        //socket.emit('newMessage', { body: "message text", channelId: 1, username: 'admin' });
    })

    const messengerInfo = useSelector((state) => state.messenger);
    if (messengerInfo.channels.length === 0) {
        axios.get('/api/v1/data', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((response) => {
            dispatch(messengerActions.setMessenger(response.data))
        })
    }

    const changeChannel = (e) => {
        console.log(e.target)
    }

    return (
        <Container>
            <Row>
                <Col sm={8}><h1>Chat</h1></Col>
                <Col sm={4}><h1><Button>Выйти</Button></h1></Col>

            </Row>
            <Row xs={2} md={4} lg={6}>
                <Col sm={4}><ListGroup>
                {messengerInfo.channels.map((ch) => <ListGroup.Item key={ch.id}><Button onClick={changeChannel}>{ch.name}</Button></ListGroup.Item>)}
            </ListGroup></Col>
                <Col sm={8}>
                    {messengerInfo.messages.map((ch) => <div key={ch.id}>{ch.username}: {ch.body}</div>)}
                </Col>
            </Row>
            <Row>
                <Col> </Col>
                <Col><Formik
                    initialValues={{ message: ''}}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        socket.emit('newMessage', {body: values.message, channelId: 1, username: localStorage.getItem("loggedIn")})
                        dispatch(messengerActions.updateState(values))
                        resetForm()
                    }}>
                    <Form>
                        <label>Message
                            <Field name="message" type="text" />
                        </label>
                        <button type="submit">Submit</button>
                    </Form>
                </Formik></Col>
            </Row>
        </Container>
    )
}
export default MainPage

