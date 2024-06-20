import React, { useState, useEffect } from 'react';
import './UserAuthinput.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';

const UserAuthinput = ({ label, placeholder, isPass, Icon, setStateFunction, setGetEmailValidationStatus }) => {

    const [value, setValue] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    useEffect(() => {
        if (placeholder === "Email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const status = emailRegex.test(value);
            setIsEmailValid(status);
            setGetEmailValidationStatus(status);
        }
    }, [value, placeholder, setGetEmailValidationStatus]);

    const handleTextChange = (e) => {
        setValue(e.target.value);
        setStateFunction(e.target.value);
    }



    return (
        <div className='user-auth'>
            <div className='input-group'>
                <label>{label}</label>
                <div className={`input-wrapper ${!isEmailValid && placeholder === "Email" && value.length > 0 ? 'invalid' : ''}`}>
                    <Icon className='input-icon' />
                    <input
                        type={isPass ? (showPass ? 'text' : 'password') : 'text'}
                        placeholder={placeholder}
                        value={value}
                        onChange={handleTextChange}
                        className='auth-input'
                    />
                    {isPass && (
                        <IconButton type="button" onClick={() => setShowPass(!showPass)}>
                            {showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    )}
                </div>
                {!isEmailValid && placeholder === "Email" && value.length > 0 && (
                    <div className="error-message">Please enter a valid email.</div>
                )}
            </div>
        </div>
    );
}

export default UserAuthinput;
