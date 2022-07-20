import React from 'react'
import styles from './UserOutput.module.css'
export interface UserOutputData {
    username: string,
    userText: string,
}
export function UserOutput({username, userText}: UserOutputData) {
    return (
        <div className={styles.messages_container}>
            <div className={styles.user_image}><p>{username}</p></div>
            <div className={styles.user_text}>{userText}</div>
        </div>
    )
}