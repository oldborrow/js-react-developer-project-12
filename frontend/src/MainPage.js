import React, {useEffect, useState} from 'react';
import { useNavigate  } from "react-router-dom";
import axios from "axios";
import { useSelector } from 'react-redux';
import { actions as messengerActions} from "./slices/messengerSlice";
import { useDispatch } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import {Button} from "react-bootstrap";
import { io } from "socket.io-client";
import {Field, Form, Formik} from "formik";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Header from "./Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const socket = io()
    const messengerInfo = useSelector((state) => state.messenger);



    useEffect(() => {
        socket.on('newMessage', (payload) => {
            console.log("in socket on newMessage")
            dispatch(messengerActions.updateState({body: payload.body, channelId: payload.channelId, username: payload.username}))
        })
        socket.on('newChannel', (payload) => {
            dispatch(messengerActions.addChannel(payload))
            //dispatch(messengerActions.setCurrentChannel(payload.id))
            toast("Канал создан", {autoClose: 5000})
        });
         if (localStorage.getItem("loggedIn") === "null" || localStorage.getItem("loggedIn") === null) {
             navigate("/login")
          } else {
             axios.post('api/v1/login', { username: localStorage.getItem("loggedIn"), password: localStorage.getItem("password") }).then((response) => {
            }).catch((err) => {
                alert(err)
            });
            if (messengerInfo.channels.length === 0) {
                axios.get('/api/v1/data', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("userToken")}`
                    }
                }).then((response) => {
                    dispatch(messengerActions.setMessenger(response.data))
                    console.log(response.data)
                })
            }
        }
     }, [])

    const changeChannel = (e) => {
        e.preventDefault()
        const newCurrentChannel = e.target.innerText
        const oldCurrentChannel = messengerInfo.channels.find((c) => c.id === messengerInfo.channelId).name

        if (newCurrentChannel !== oldCurrentChannel) {
            const newId = messengerInfo.channels.find((c) => c.name === newCurrentChannel).id
            dispatch(messengerActions.setCurrentChannel(newId))
        }
    }

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    const deleteChannel = () => {
        dispatch(messengerActions.deleteChannel(messengerInfo.channelId))
        socket.emit('removeChannel', { id: messengerInfo.channelId });
        console.log("deleting")
    }

    const [openDeleteChannel, setOpenDeleteChannel] = useState(false);
    const onOpenDeleteChannel = () => setOpenDeleteChannel(true);
    const onCloseDeleteChannel = () => {
        deleteChannel()
        setOpenDeleteChannel(false);
    }

    const logout = () => {
        localStorage.setItem("loggedIn", null)
        localStorage.setItem("password", null)
        localStorage.setItem("userToken", null)
        navigate("/login")
    }

    return (
        <Container>
            <div>
                <Modal open={open} onClose={onCloseModal} center>

                    <Formik
                        initialValues={{ channelName: ''}}
                        onSubmit={(values, { resetForm }) => {
                            socket.emit('newChannel', { name: "# " + values.channelName })
                            onCloseModal()
                        }}>
                        <Form>
                            <label>Имя канала
                                <Field name="channelName" type="text" />
                            </label>
                            <button type="submit">Отправить</button>
                        </Form>
                    </Formik>
                </Modal>

                <Modal open={openDeleteChannel} onClose={() => setOpenDeleteChannel(false)} center>
                    <h2>Удалить канал?</h2>
                    <Button onClick={onCloseDeleteChannel}>Да</Button>
                    <Button onClick={() => setOpenDeleteChannel(false)}>Нет</Button>
                </Modal>
            </div>
            <Row>
                <Col sm={8}><Header/></Col>
                <Col sm={4}><h1><Button onClick={logout}>Выйти</Button></h1></Col>
            </Row>
            <Row xs={2} md={4} lg={6}>
                <Col sm={4}><ListGroup>
                    <ListGroup.Item>Каналы <Button onClick={onOpenModal}>+</Button></ListGroup.Item>
                {messengerInfo.channels.map((ch) => ch.id === messengerInfo.channelId ? <ListGroup.Item key={ch.id}><h7>{ch.name}</h7> {ch.id === 1 ? null : <Button onClick={onOpenDeleteChannel}>-</Button>}</ListGroup.Item> : <ListGroup.Item key={ch.id}><Button onClick={changeChannel}>{ch.name}</Button></ListGroup.Item>)}

                </ListGroup></Col>
                <Col sm={8}>
                    {messengerInfo.messages.map((m) => m.channelId === messengerInfo.channelId ? <div key={m.id}>{m.username}: {m.body}</div> : null)}
                </Col>
            </Row>
            <Row>
                <Col> </Col>
                <Col><Formik
                    initialValues={{ message: ''}}
                    onSubmit={(values, { resetForm }) => {
                        socket.emit('newMessage', {body: values.message, channelId: messengerInfo.channelId, username: localStorage.getItem("loggedIn")})
                        //dispatch(messengerActions.updateState({body: values.message, channelId: messengerInfo.channelId, username: localStorage.getItem("loggedIn")}))
                        resetForm()
                    }}>
                    <Form>
                        <label>Новое сообщение
                            <Field name="message" type="text" aria-label={"Новое сообщение"}/>
                        </label>
                        <button type="submit" >Отправить</button>
                    </Form>
                </Formik></Col>
            </Row>
            <ToastContainer />
        </Container>
    )
}
export default MainPage

