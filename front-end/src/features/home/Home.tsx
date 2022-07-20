import React, {FormEvent, useEffect, useState} from 'react'
import axios from 'axios'
import styles from './Home.module.css'
import {Dashboard} from "./Dashboard";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {updateRooms, updateRoomsAreFetched, updateUserData, selectUser} from "./homeSlice";

interface HomeTypes {
    isSignUp: boolean,
    error?: string,
    isLoggedIn: boolean,
}

interface FormDataTypes {
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
    confirm_password: string,
}

const homeInit = {
    isSignUp: false,
    error: "",
    isLoggedIn: false,
}
const formDataInit = {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
}


export function Home() {
    const [homeData, setHomeData] = useState<HomeTypes>(homeInit);
    const [formData, setFormData] = useState<FormDataTypes>(formDataInit);
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser)
    useEffect(() => {
        axios.get('http://localhost:8000/user/', {withCredentials: true})
            .then((res) => {
                dispatch(updateUserData(res.data))
                setHomeData({
                    ...homeData,
                    isLoggedIn: true,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    },[])
    const signUp = () => {
        setHomeData({
            isSignUp: !homeData.isSignUp,
            error: "",
            isLoggedIn: false,
        })
    }
    const logout = () => {
        axios.post('http://localhost:8000/logout/', {'username': user.username})
            .then((res) => {
                setHomeData(homeInit);
                setFormData(formDataInit);
                dispatch(updateRoomsAreFetched())
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const handleChange = (event: FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLInputElement
        setFormData({
            ...formData,
            [target.name]: target.value,

        })
    }
    const submitSignUpForm = (event: FormEvent) => {
        event.preventDefault()
        for (const [_, value] of Object.entries(formData)) {
            if (!value) {
                setHomeData({...homeData, error: "Please fill all the fields!"})
                return
            }
        }
        if (formData.password !== formData.confirm_password) {
            setHomeData({...homeData, error: "Password did not match!"})
            return
        }

        axios.post('http://localhost:8000/signup/', formData)
            .then((res) => {
                setHomeData(homeInit);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const submitLoginForm = (event: FormEvent) => {
        event.preventDefault();
        axios.post('http://localhost:8000/login/', {
            'username': formData.username, 'password': formData.password
        }, {withCredentials: true})
            .then((res) => {
                dispatch(updateUserData(res.data))
                setHomeData({
                    ...homeInit,
                    isLoggedIn: true,
                });
            })
            .catch((err) => {
                setHomeData({
                    ...homeData,
                    error: "Credentials are incorrect!",
                })
            })
    }
    const getAvailableRooms = (event: React.MouseEvent<HTMLImageElement>) => {
        const target = event.target as HTMLImageElement
        axios.get(`http://localhost:8000/rooms/?category=${target.alt}`, {withCredentials:true})
            .then((res) => {
                dispatch(updateRooms(res.data))
                dispatch(updateRoomsAreFetched())
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <div>
            {!homeData.isLoggedIn ?
                <div>
                    {!homeData.isSignUp ?
                        <div className={styles.login_form_wrapper}>
                            <form className={styles.login_form}>
                                <label className={styles.form_title}>Sign in</label>
                                <input type="text" name="username" placeholder="Username" onChange={handleChange}/>
                                <input type="password" name="password" placeholder="Password" onChange={handleChange}/>
                                <input type="submit" value="submit" id={styles['form_btn']} onClick={submitLoginForm}/>
                            </form>
                            <div className={styles.login_helpers}>
                                <p onClick={signUp}>Create account</p>
                                <p>Forgot password?</p>
                            </div>
                            {homeData.error ? <div className={styles.error}><h4>{homeData.error}</h4></div> :
                                <div></div>}
                        </div>
                        :
                        <div className={styles.signup_form_wrapper}>
                            <form className={styles.signup_form}>
                                <label className={styles.form_title}>Sign up</label>
                                <input type="text" name="first_name" id="first_name" placeholder="First name"
                                       onChange={handleChange}/>
                                <input type="text" name="last_name" id="last_name" placeholder="Last name"
                                       onChange={handleChange}/>
                                <input type="text" name="email" id="email" placeholder="Email" onChange={handleChange}/>
                                <input type="text" name="username" id="username" placeholder="Username"
                                       onChange={handleChange}/>
                                <input type="password" name="password" id="password" placeholder="Password"
                                       onChange={handleChange}/>
                                <input type="password" name="confirm_password" id="confirm-password"
                                       placeholder="Re-enter password" onChange={handleChange}/>
                                <input type="submit" value="submit" id={styles['form_btn']} onClick={submitSignUpForm}/>
                            </form>
                            <div className={styles.signup_helpers}>
                                <p onClick={signUp}>Login</p>
                                <p>need help?</p>
                            </div>
                            {homeData.error ? <div className={styles.error}><p>{homeData.error}</p></div> : <div></div>}
                        </div>
                    }
                </div>
                :
                <Dashboard handleLogout={logout} getAvailableRooms={getAvailableRooms} />
            }
        </div>
    );
}
