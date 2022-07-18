import React, {FormEvent} from 'react'
import styles from './Home.module.css'

interface PropTypes {
    changeCreationFormData: (event: FormEvent) => void,
    submitCreationFormData: (event: FormEvent) => void,
    setIsPrivate: (event: FormEvent) => void,
    isPrivate: boolean,
}
export function RoomCreationForm({changeCreationFormData, submitCreationFormData, setIsPrivate, isPrivate}: PropTypes) {
    return (
        <div className={styles.room_creation_form_container}>
            <form className={styles.room_creation_form}>
                <input type="text" placeholder="Room name" name="name" onChange={changeCreationFormData}/>
                <label id={styles["select_category"]}>Category</label>
                <select name="category" id={styles["select"]} autoComplete="off" required={true} onChange={changeCreationFormData}>
                    <option value="buildings">Buildings</option>
                    <option value="Movies">Movies</option>
                    <option value="Music">Music</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Water">Water</option>
                    <option value="Other">Other</option>
                </select>
                <input type="text" placeholder="Room size" name="size" onChange={changeCreationFormData}/>
                <input type="radio" id="private" name="private" value="private" checked={isPrivate} onClick={setIsPrivate}/>
                <label htmlFor="private" id={styles["radio_private"]}>Private</label>
                <input type="submit" id={styles["form_btn"]} value="create" onClick={submitCreationFormData}/>
            </form>
        </div>
    )
}