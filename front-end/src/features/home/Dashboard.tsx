import React, {FormEvent, useState} from 'react'
import styles from './Dashboard.module.css'
import home from '../../assets/icons/home_icon.svg'
import profile from '../../assets/icons/profile_icon.svg'
import logout from '../../assets/icons/logout_icon.png'
import {categories} from "../../assets/icons/icons";
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import {selectRooms, selectRoomsAreFetched, selectUser, updateRoomsAreFetched, Room} from "./homeSlice";
import {RoomCreationForm} from "./RoomCreationForm";
import axios from "axios";

interface PropTypes {
    handleLogout: () => void
    getAvailableRooms: (event: React.MouseEvent<HTMLImageElement>) => void
}


export function Dashboard({handleLogout, getAvailableRooms}: PropTypes) {
    const rooms = useAppSelector(selectRooms);
    const roomsAreFetched = useAppSelector(selectRoomsAreFetched);
    const user = useAppSelector(selectUser);
    const [showRoomCreationForm, setShowRoomCreationForm] = useState(false);
    const initialState: Room = {
        owner: user.id,
        name: "",
        size: "",
        private: false,
        category: "other",
    }
    const [roomCreationData, setRoomCreationData] = useState<Room>(initialState);
    const dispatch = useAppDispatch();

    const createRoom = () => {
        setShowRoomCreationForm(true);
    }
    const changeCreationFormData = (event: FormEvent) => {
        const target = event.target as HTMLInputElement
        setRoomCreationData({
            ...roomCreationData,
            [target.name]: target.value,
        })
    }
    const setIsPrivate = () => {
        setRoomCreationData({
            ...roomCreationData,
            private: !roomCreationData.private,
        })
    }
    const submitCreationFormData = (event: FormEvent) => {
        event.preventDefault();
        axios.post('http://localhost:8000/rooms/', roomCreationData, {withCredentials: true})
            .then((res) => {
                setShowRoomCreationForm(false);
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const showCategories = () => {
        dispatch(updateRoomsAreFetched());
        setShowRoomCreationForm(false);
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.sidebar}>
                <div className={styles.sidebar_items_container}>
                    <div className={styles.sidebar_item}>
                        <img src={home} alt="home"/>
                        <p>Dashboard</p>
                    </div>
                    <div className={styles.sidebar_item}>
                        <img src={profile} alt="profile"/>
                        <p>Profile</p>
                    </div>
                    <div className={styles.sidebar_item}>
                        <img src={logout} alt="logout"/>
                        <p onClick={handleLogout}>Logout</p>
                    </div>
                </div>
            </div>
            {!roomsAreFetched ?
                <div className={styles.content}>
                    <div className={styles.category_container}>
                        {categories.map(({name, url}, idx) => {
                            return (
                                <div key={idx} className={styles.category}>
                                    <img src={url} alt={name} onClick={getAvailableRooms}/>
                                    <div className={styles.helper_text}>
                                        <p>{name}</p>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>
                :
                <div className={styles.content}>
                    {!showRoomCreationForm ?
                        <div className={styles.rooms_list_container}>
                            <table className={styles.rooms_table}>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>category</th>
                                    <th>size</th>
                                    <th>Private</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rooms.map((elem, id) => {
                                    return (
                                        <tr key={id}>
                                            <th>{elem.name}</th>
                                            <th>{elem.category}</th>
                                            <th>{elem.size}</th>
                                            <th>{elem.private}</th>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                            <button className={styles.btn} onClick={createRoom}>Create room</button>
                            <button className={styles.btn} onClick={showCategories}>showCategories</button>
                        </div>
                        :
                        <RoomCreationForm changeCreationFormData={changeCreationFormData}
                                          submitCreationFormData={submitCreationFormData}
                                          setIsPrivate={setIsPrivate}
                                          isPrivate={roomCreationData.private}
                        />
                    }
                </div>
            }
        </div>
    )
}