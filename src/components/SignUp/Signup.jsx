import React, { useState } from 'react'
import './Signup.css'
import UserAuthinput from '../UserAuthinput/UserAuthinput'
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { IconButton } from '@mui/material';
import { singInWithGithub, singInWithGoogle } from '../../utils/helpers';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase.config.js';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [getEmailValidationStatus, setGetEmailValidationStatus] = useState(false)
    const [isLogin, setisLogin] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    const createNewUser = async () => {

        if (getEmailValidationStatus) {
            await createUserWithEmailAndPassword(auth, email, password).then((userCred) => {
                if (userCred) {
                    toast.success("Create Account Successfully!");
                }
            }).catch(error => {
                console.log(error)
                toast.error("Error");
            })
        }
    }

    const loginWithEmailPassword = async () => {
        if (getEmailValidationStatus) {
            await signInWithEmailAndPassword(auth, email, password).then((userCred) => {
                if (userCred) {
                    toast.success("Login Successfully!");
                }
            }).catch(error => {
                console.log(error)
                if (error.message.includes("user-not-found")) {
                    setAlert(true)
                    setAlertMsg("Invalid Id : Use not found")
                }
                else if (error.message.includes("wrong-password")) {
                    setAlert(true)
                    setAlertMsg("Password Missmatch")
                }
                else {
                    setAlert(true)
                    setAlertMsg("Invalid UserId or Password")
                }

                setInterval(() => {
                    setAlert(false)
                }, 5000)
            })
        }
    }

    return (
        <div className='signup-page'>
            <img src='https://blog.codepen.io/wp-content/uploads/2022/01/codepen-wordmark-display-inside-white@10x.png' alt='Logo' />

            <div>
                <p>Join with Us! ❤️</p>
                <div className='signup-fild'>
                    <UserAuthinput label="Email" placeholder="Email" isPass={false} Icon={EmailIcon} setStateFunction={setEmail} setGetEmailValidationStatus={setGetEmailValidationStatus} />
                    <UserAuthinput label="Password" placeholder="Password here" isPass={true} Icon={LockIcon} setStateFunction={setPassword} />
                    {
                        !isLogin ?
                            (
                                <IconButton onClick={createNewUser} className='signup-login-btn'>
                                    <button>Sign Up</button>
                                </IconButton>
                            ) :
                            (
                                <IconButton onClick={loginWithEmailPassword} className='signup-login-btn'>
                                    <button>Login</button>
                                </IconButton>
                            )
                    }

                    {
                        alert && (<p style={{ color: 'red' }}>{alertMsg}</p>)
                    }

                    {
                        !isLogin ?
                            (
                                <p style={{ marginBottom: '10px' }}>Already Have an account!<span onClick={() => setisLogin(!isLogin)} style={{ color: '#10b981', cursor: 'pointer', fontWeight: '600' }}> Login Here</span></p>
                            ) :
                            (
                                <p style={{ marginBottom: '10px' }}>Doesn't Have an account!<span onClick={() => setisLogin(!isLogin)} style={{ color: '#10b981', cursor: 'pointer', fontWeight: '600' }}> Create Here</span></p>
                            )
                    }

                    <hr />

                    <div onClick={singInWithGoogle} className='google-signup'>
                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png' />
                        <h4 >Sign in with Google</h4>
                    </div>

                    <div onClick={singInWithGithub} className='google-signup'>
                        <img src='https://cdn.icon-icons.com/icons2/2428/PNG/512/github_black_logo_icon_147128.png' />
                        <h4>Sign in with GitHub</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup

