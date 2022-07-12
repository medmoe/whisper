import React, {FormEvent, useEffect, useState} from 'react'
import axios from 'axios'
import styles from './Home.module.css'

interface HomeTypes {
    isLogin: boolean,
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
    isLogin: false,
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
    useEffect(() => {
        const session_id = localStorage.getItem("session_id")
        if(!homeData.isLoggedIn){
            if (session_id) {
                axios.post("http://localhost:8000/user/", {"session_id": session_id})
                    .then((res) => {
                        setHomeData({
                            ...homeData,
                            isLoggedIn: true,
                        })
                        setFormData({
                            ...formData,
                            first_name: res.data.first_name,
                            last_name: res.data.last_name,
                            email: res.data.email,
                            username: res.data.username,
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        }
    })
    const signUp = () => {
        setHomeData({
            isSignUp: true,
            isLogin: false,
            error: "",
            isLoggedIn: false,
        })
    }
    const login = () => {
        setHomeData({
            isLogin: true,
            isSignUp: false,
            error: "",
            isLoggedIn: false,
        })
    }
    const logout = () => {
        axios.post('http://localhost:8000/logout/', {'username': formData.username})
            .then((res) => {
                setHomeData(homeInit);
                setFormData(formDataInit);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const goHome = () => {
        setHomeData(homeInit);
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
        })
            .then((res) => {
                localStorage.setItem("session_id", res.data.session_id)
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
    return (
        <div>
            {homeData.isLoggedIn ?
                <div className={styles.nav_bar}>
                    <ul>
                        <li>Home</li>
                        <li onClick={logout}>Logout</li>
                        <li>Welcome!, {formData.username}</li>
                    </ul>
                </div>
                :
                <div className={styles.nav_bar}>
                    <ul>
                        <li onClick={goHome}>Home</li>
                        <li onClick={login}>Login</li>
                        <li onClick={signUp}>Sign up</li>
                    </ul>
                </div>
            }

            {homeData.isSignUp ?
                <div className={styles.form_wrapper}>
                    <form className={styles.auth_form}>
                        <label htmlFor="first_name">First name: </label>
                        <input type="text" name="first_name" id="first_name" onChange={handleChange}/>
                        <label htmlFor="last_name">Last name: </label>
                        <input type="text" name="last_name" id="last_name" onChange={handleChange}/>
                        <label htmlFor="email">Email:</label>
                        <input type="text" name="email" id="email" onChange={handleChange}/>
                        <label htmlFor="username">Username:</label>
                        <input type="text" name="username" id="username" onChange={handleChange}/>
                        <label htmlFor="password">Password: </label>
                        <input type="password" name="password" id="password" onChange={handleChange}/>
                        <label htmlFor="confirm_password">Re-enter password:</label>
                        <input type="password" name="confirm_password" id="confirm-password" onChange={handleChange}/>
                        <input type="submit" value="submit" onClick={submitSignUpForm}/>
                    </form>
                </div> : <></>}
            {homeData.isLogin ?
                <div className={styles.form_wrapper}>
                    <form className={styles.auth_form}>
                        <label htmlFor="username">Username: </label>
                        <input type="text" name="username" onChange={handleChange}/>
                        <label htmlFor="password">Password: </label>
                        <input type="password" name="password" onChange={handleChange}/>
                        <input type="submit" value="submit" onClick={submitLoginForm}/>
                    </form>
                </div>
                : <></>}
            {homeData.error ? <div className={styles.error}><h4>{homeData.error}</h4></div> : <></>}
        </div>
    );
}
