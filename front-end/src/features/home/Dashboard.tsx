import React, {FormEvent, useState} from 'react'
import styles from './Dashboard.module.css'
import home from '../../assets/icons/home_icon.svg'
import profile from '../../assets/icons/profile_icon.svg'
import logout from '../../assets/icons/logout_icon.png'
import {categories, categories_object} from "../../assets/icons/icons";
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import {selectRooms, selectRoomsAreFetched, selectUser, updateRoomsAreFetched, Room} from "./homeSlice";
import {RoomCreationForm} from "./RoomCreationForm";
import axios from "axios";
import pr from './../../assets/icons/private.png'
import not_pr from './../../assets/icons/not_private.png'
import {ChatRoom} from "./ChatRoom";

interface PropTypes {
    handleLogout: () => void
    getAvailableRooms: (event: React.MouseEvent<HTMLImageElement>) => void
}

interface RoomInfo {
    roomName: string;
    category: string;
}


export function Dashboard({handleLogout, getAvailableRooms}: PropTypes) {
    const rooms = useAppSelector(selectRooms);
    const roomsAreFetched = useAppSelector(selectRoomsAreFetched);
    const user = useAppSelector(selectUser);
    const [showRoomCreationForm, setShowRoomCreationForm] = useState(false);
    const [showRoomData, setShowRoomData] = useState(false);
    const [roomInfo, setRoomInfo] = useState<RoomInfo>({roomName:"", category:""})
    const initialState: Room = {
        owner: user.id,
        name: "",
        size: "",
        private: false,
        category: "buildings",
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
                dispatch(updateRoomsAreFetched());
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const showCategories = () => {
        dispatch(updateRoomsAreFetched());
        setShowRoomCreationForm(false);
    }
    const showRoomDetails = (event: FormEvent) => {
        setShowRoomData(true);
        const target = event.target as HTMLElement
        const [name, category] = target.id.split(",");
        setRoomInfo({
            roomName: name,
            category: category,
        })
    }
    const exitRoom = () => {
        setShowRoomData(false);
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
                        <div>
                            {!showRoomData ?
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
                                                <tr key={id} className={styles.table_row} onClick={showRoomDetails} >
                                                    <th id={`${elem.name},${elem.category}`}>{elem.name}</th>
                                                    <th><img src={categories_object[elem.category]} alt="category"/>
                                                    </th>
                                                    <th>{elem.size}</th>
                                                    {elem.private ? <th><img src={not_pr} alt="private"/></th> :
                                                        <th><img src={pr} alt="not private"/></th>}
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                    <button className={styles.btn} onClick={createRoom}>Create room</button>
                                    <button className={styles.btn} onClick={showCategories}>showCategories</button>
                                </div>
                                :
                                <ChatRoom exitRoom={exitRoom} roomName={roomInfo.roomName} category={roomInfo.category} />
                            }
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