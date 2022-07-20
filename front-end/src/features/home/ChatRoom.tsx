import React, {FormEvent, KeyboardEventHandler, useEffect, useState} from 'react'
import styles from './ChatRoom.module.css'
import exit from './../../assets/icons/logout_icon.png'
import {UserOutput, UserOutputData} from "./UserOutput";
import {selectUser} from "./homeSlice";
import {useAppSelector} from "../../app/hooks";

interface PropTypes {
    exitRoom: () => void;
    category: string;
    roomName: string;
}

let chatSocket: WebSocket;

export function ChatRoom({exitRoom, category, roomName}: PropTypes) {
    const [message, setMessage] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<UserOutputData[]>([])
    const user = useAppSelector(selectUser)
    useEffect(() => {
        chatSocket = new WebSocket(
            `ws://localhost:8000/ws/chat/${category}/${roomName}/`
        );
        chatSocket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            setChatMessages(state => ([...chatMessages, {username: data.username, userText: data.message}]))
        })
    }, [chatMessages])


    const handleChange = (event: FormEvent) => {
        const target = event.target as HTMLInputElement
        setMessage(target.value);
    }
    const sendMessage = () => {
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': user.username,
        }));
        setMessage("");
    }
    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter") {
            chatSocket.send(JSON.stringify({
                'message': message,
                'username': user.username,
            }));
            setMessage("");
        }
    }
    return (
        <div>
            <div className={styles.textAreaContainer}>
                {chatMessages.map((node, id) => {
                    return <UserOutput username={node.username} userText={node.userText} key={id}/>
                })}
            </div>
            <div className={styles.availableUsersContainer}>

            </div>
            <div className={styles.controllers}>
                <div id={styles["send"]} onClick={sendMessage}><p>send</p></div>
                <div id={styles["exit"]}>
                    <p onClick={exitRoom}>exit</p>
                    <img src={exit} alt="exit"/>
                </div>
            </div>
            <div className={styles.messaging_container}>
                <input type="text" size={100} onChange={handleChange} value={message} onKeyDown={keyDownHandler}/>
            </div>

        </div>
    )
}