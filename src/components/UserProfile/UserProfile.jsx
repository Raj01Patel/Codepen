import React, { useState } from 'react'
import './UserProfile.css'
import {  IconButton } from '@mui/material'
import { useSelector } from 'react-redux'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Menus, signOutAction } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const [menuList, setMenuList] = useState(false);
    const user = useSelector((state) => state.user?.user)

    const togglemenu = () => {
        setMenuList(!menuList)
    }

    return (
        <div className='user-info'>
            
            {
                user?.photoURL ? (
                    <img src={user?.photoURL} />
                ) : (
                    <p className='user-name'>{user?.email[0]}</p>
                )
            }


            <IconButton onClick={togglemenu}><KeyboardArrowDownIcon className='option' /></IconButton>

            <div className={`menu ${menuList ? "" : "block"}`} >
                {
                    Menus && Menus.map((menu) => (
                        <Link className='menu-list' to={menu?.uri} key={menu?.uri}>
                            {menu.name}
                        </Link>
                    ))
                }
                <p onClick={signOutAction} className={`sign-out`}>Sign out</p>
            </div>

        </div>
    )
}

export default UserProfile