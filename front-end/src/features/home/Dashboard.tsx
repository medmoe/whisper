import React from 'react'
import styles from './Dashboard.module.css'
import home from '../../assets/icons/home_icon.svg'
import profile from '../../assets/icons/profile_icon.svg'
import logout from '../../assets/icons/logout_icon.png'
import {categories} from "../../assets/icons/icons";
interface PropTypes{
    handleLogout: () => void
}

export function Dashboard({handleLogout}: PropTypes) {
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
            <div className={styles.content}>
                <div className={styles.category_container}>
                {categories.map((url, idx) => {
                    return (
                    <div key={idx} className={styles.category}>
                        <img src={url} alt="icon" />
                    </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}