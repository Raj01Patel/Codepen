import React, { useState } from 'react';
import './Home.css';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Link, Route, Routes } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import Projects from '../Projects/Projects';
import Signup from '../SignUp/Signup';
import { useSelector } from 'react-redux';
import UserProfile from '../UserProfile/UserProfile';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchText, setSearchText] = useState('');
    const user = useSelector((state) => state.user?.user);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div className='main-container'>
            <div className={`leftbar ${isSidebarOpen ? '' : 'closed'}`}>
                <div className='toggle-sidebar' onClick={toggleSidebar}>
                    <DoubleArrowIcon className={`icon ${isSidebarOpen ? '' : 'rotate'}`} />
                </div>
                <div className={`logo ${isSidebarOpen ? '' : 'hidden'}`}>
                    <Link to={"/home"}>
                        <img src='https://blog.codepen.io/wp-content/uploads/2022/01/codepen-wordmark-display-inside-white@10x.png' alt='logo' />
                    </Link>
                    <p style={{ color: '#a1a0a0', fontSize: '12px' }}>TRY OUR ONLINE EDITOR</p>
                    <Link to={"/newProject"}>
                        <button className={`start-btn ${isSidebarOpen ? '' : 'hidden'}`}>
                            Start Coding
                        </button>
                    </Link>
                    {user && (
                        <Link to={"/home/projects"} style={{ textDecoration: "none" }}>
                            <button className={`home-btn ${isSidebarOpen ? '' : 'hidden'}`}><HomeIcon /> Home</button>
                        </Link>
                    )}
                </div>
            </div>
            <div className={`rightbar ${isSidebarOpen ? '' : 'expand'}`}>
                <div className='search-info'>
                    <div className='search-input'>
                        <IconButton>
                            <SearchIcon style={{ color: 'gray' }} />
                        </IconButton>
                        <input
                            type='text'
                            placeholder='Search here...'
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </div>
                    {!user && (
                        <div className='signup-btn'><Link style={{ textDecoration: 'none', color: 'white' }} to={"/home/auth"}>Sign Up</Link></div>
                    )}
                    {user && <UserProfile />}

                </div>
                <div className='user-card'>
                    <Routes>
                        <Route path='/*' element={<Projects searchText={searchText} />} />
                        <Route path='/auth' element={<Signup />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Home;
