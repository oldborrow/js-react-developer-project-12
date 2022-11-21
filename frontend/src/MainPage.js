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

    const [onChannelCreation, setCreateChannel] = useState(false)
    const [onChannelRenaming, setChannelRenaming] = useState(false)
    const [onChannelDeletion, setChannelDeletion] = useState(false)
    useEffect(() => {
        socket.on('newMessage', (payload) => {
            console.log("in socket on newMessage")
            dispatch(messengerActions.updateState({body: payload.body, channelId: payload.channelId, username: payload.username}))
        })
        socket.on('newChannel', (payload) => {
            dispatch(messengerActions.addChannel(payload))
            //toast("Канал создан", {autoClose: 5000})
            setCreateChannel(true)
            setTimeout(() => setCreateChannel(false), "5000")
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

    const changeChannel = (id) => {
        dispatch(messengerActions.setCurrentChannel(id))
    }

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    let [modifiableChannelId, setModifiableChannelId] = useState(null)
    const deleteChannel = () => {
        dispatch(messengerActions.deleteChannel(modifiableChannelId))
        socket.emit('removeChannel', { id: modifiableChannelId });
        console.log("deleting channel with id " + modifiableChannelId)
        setChannelDeletion(true)
        setTimeout(() => setChannelDeletion(false), "5000")
    }

    const [openModifyChannel, setOpenModifyChannel] = useState(false);


    const onOpenModifyChannel = (id) => {
        setModifiableChannelId(id)
        setOpenModifyChannel(true);
        console.log(modifiableChannelId)
    }
    const onCloseModifyChannel = () => {
        deleteChannel()
        setModifiableChannelId(null)
        setOpenModifyChannel(false);
        setClickedDelete(false)
    }

    const logout = () => {
        localStorage.setItem("loggedIn", null)
        localStorage.setItem("password", null)
        localStorage.setItem("userToken", null)
        navigate("/login")
    }

    const [changeChannelName, setChangeChannelName] = useState(false);
    const [clickedDelete, setClickedDelete] = useState(false)
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

                <Modal open={openModifyChannel} onClose={() => {
                    setOpenModifyChannel(false)
                    setChangeChannelName(false)
                    setClickedDelete(false)
                }} center>
                    {/*() => renameChannel(messengerInfo.channelId)*/}
                    <Button onClick={() => setChangeChannelName(true)}>Переименовать</Button>
                    <Button onClick={() => setClickedDelete(true)}>Удалить</Button>
                    {clickedDelete ? <Button className={"btn-danger"} onClick={onCloseModifyChannel}>Опасно</Button> : null}
                    {changeChannelName ? <Formik
                        initialValues={{ newName: ''}}
                        onSubmit={(values, { resetForm }) => {
                            console.log(values)
                            socket.emit('renameChannel', { id: modifiableChannelId, name: values.newName });
                            console.log("renaming channel " + modifiableChannelId)
                            setModifiableChannelId(null)
                            setChannelRenaming(true)
                            setTimeout(() => setChannelRenaming(false), "5000")
                            // socket.emit('newMessage', {body: values.message, channelId: messengerInfo.channelId, username: localStorage.getItem("loggedIn")})
                            // //dispatch(messengerActions.updateState({body: values.message, channelId: messengerInfo.channelId, username: localStorage.getItem("loggedIn")}))
                            // resetForm()
                        }}>
                        <Form>
                            <label>Имя канала
                                <Field name="newName" type="text" aria-label={"Имя канала"}/>
                            </label>
                            <button type="submit" >Отправить</button>
                        </Form>
                    </Formik> : null}
                </Modal>
            </div>
            <Row>
                <Col sm={8}><Header/></Col>
                <Col sm={4}><h1><Button onClick={logout}>Выйти</Button></h1></Col>
            </Row>
            <Row xs={2} md={4} lg={6}>
                <Col sm={4}><ListGroup>
                    <ListGroup.Item>Каналы <Button onClick={onOpenModal}>+</Button></ListGroup.Item>
                {messengerInfo.channels.map((ch) => ch.id === 1 || ch.id === 2 ? <ListGroup.Item key={ch.id}><Button onClick={() => changeChannel(ch.id)}>{ch.name}</Button></ListGroup.Item> : <ListGroup.Item key={ch.id}><Button onClick={() => changeChannel(ch.id)}> {ch.name}</Button> <Button onClick={() => onOpenModifyChannel(ch.id)}>Управление каналом</Button></ListGroup.Item>)}

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
            {onChannelCreation ? <h5>Канал создан</h5> : null}
            {onChannelRenaming ? <h5>Канал переименован</h5> : null}
            {onChannelDeletion ? <h5>Канал удалён</h5> : null}
        </Container>
    )
}
export default MainPage

