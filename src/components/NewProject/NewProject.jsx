import React, { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import './NewProject.css';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Link, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import { Menus, signOutAction } from '../../utils/helpers';
import { androidstudio } from '@uiw/codemirror-theme-androidstudio';
import { basicLight, basicDark } from '@uiw/codemirror-theme-basic';
import { materialDark, materialLight } from '@uiw/codemirror-theme-material';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { db } from '../../config/firebase.config';
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const themes = {
    Dark: 'dark',
    VscodeDark: vscodeDark,
    GithubDark: githubDark,
    GithubLight: githubLight,
    Androidstudio: androidstudio,
    BasicDark: basicDark,
    BasicLight: basicLight,
    MaterialDark: materialDark,
    MaterialLight: materialLight,
};


const NewProject = () => {
    const [html, setHtml] = useState("")
    const [css, setCss] = useState("")
    const [js, setJs] = useState("")
    const [output, setOutput] = useState("")
    const [istitle, setIstitle] = useState(false)
    const [title, setTitle] = useState("Untitled")
    const [themeList, setThemeList] = useState(false)
    const [menuList, setMenuList] = useState(false);
    const user = useSelector((state) => state.user?.user)
    const [theme, setTheme] = useState('dark');
    const { id } = useParams();
    const [projectUserId, setProjectUserId] = useState(null);
    const [projectExists, setProjectExists] = useState(false);
    const [splitDirection, setSplitDirection] = useState('horizontal');

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) {
                console.error('Project ID is undefined');
                setProjectExists(false);
                return;
            }

            try {
                const docRef = doc(db, "Projects", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const projectData = docSnap.data();

                    setHtml(projectData.html || "");
                    setCss(projectData.css || "");
                    setJs(projectData.js || "");
                    setTitle(projectData.title || "Untitled");
                    setOutput(projectData.output || "");
                    setProjectUserId(projectData.user?.uid || null);
                    setProjectExists(true);
                } else {
                    console.log('No such document!');
                    setProjectExists(false);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                setProjectExists(false);
            }
        };

        fetchProject();
    }, [id]);

    const onClickEdit = () => {
        setIstitle(!istitle)
    }

    const ThemeList = () => {
        setThemeList(!themeList);
        if (menuList === true) {
            setMenuList(false)
        }
    };

    const changeTheme = (themeName) => {
        setTheme(themeName);
    };

    const togglemenu = () => {
        setMenuList(!menuList)
        if (themeList === true) {
            setThemeList(false)
        }
    }

    useEffect(() => {
        updateOupput();
    }, [html, css, js])

    const updateOupput = () => {
        const combinedOutput = `
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                 ${html}
            <script>${js}</script>
            </body>
        </html>
        `
        setOutput(combinedOutput);
    }

    const saveProgram = async () => {
        const id = `${Date.now()}`;
        const _doc = {
            id: id,
            title: title,
            html: html,
            css: css,
            js: js,
            output: output,
            user: user
        };

        await setDoc(doc(db, "Projects", id), _doc).then((res) => {
            toast.success("Project Saved Successfully!");
        }).catch((err) => {
            console.log(err);
            toast.error("Error Saving Project");
        });
    };

    const editProgram = async () => {
        const _doc = {
            id: id,
            title: title,
            html: html,
            css: css,
            js: js,
            output: output,
            user: user
        };

        await setDoc(doc(db, "Projects", id), _doc).then((res) => {
            toast.success("Project Updated Successfully!");
        }).catch((err) => {
            console.log(err);
            toast.error("Error Updating Project");
        });
    };

    const toggleSplitDirection = () => {
        setSplitDirection(splitDirection === 'horizontal' ? 'vertical' : 'horizontal');
    };




    return (
        <>
            <div className='coding-section'>

                <header className='coding-header'>
                    <div className='edit-container'>
                        {user ? (
                            <Link to={"/home/projects"}>
                                <img src='https://blog.codepen.io/wp-content/uploads/2022/01/codepen-wordmark-display-inside-white@10x.png' height="30px" style={{ marginRight: '20px' }} />
                            </Link>
                        ) : (
                            <Link to={"/home/auth"}>
                                <img src='https://blog.codepen.io/wp-content/uploads/2022/01/codepen-wordmark-display-inside-white@10x.png' height="30px" style={{ marginRight: '20px' }} />
                            </Link>
                        )
                        }
                        <div className='edit-section'>
                            <div style={{ display: 'flex' }}>

                                {
                                    projectExists && user?.email === projectUserId ?
                                        (
                                            <p style={{ fontWeight: '600', marginRight: '10px' }}>{title}</p>
                                        ) :
                                        !projectExists && istitle ?
                                            (
                                                <>
                                                    <input className='input-edit' key={"TitleInput"} type='text' placeholder='Your title' value={title} onChange={(e) => setTitle(e.target.value)} />
                                                    <CheckIcon onClick={onClickEdit} style={{ color: '#10b981', cursor: 'pointer' }} />
                                                </>
                                            ) :
                                            projectExists && user?.email !== projectUserId ?
                                                (
                                                    <p style={{ fontWeight: '600', marginRight: '10px' }}>{title}</p>
                                                ) :
                                                (
                                                    <>
                                                        <p style={{ fontWeight: '600', marginRight: '10px' }}>{title}</p>
                                                        <EditIcon onClick={onClickEdit} style={{ color: '#10b981', cursor: 'pointer' }} />
                                                    </>
                                                )
                                }

                                <button className='follow-btn'>Follow +</button>
                            </div>
                        </div>
                    </div>

                    <div className='user-info2'>
                        {projectExists && user?.email === projectUserId ? (
                            <button onClick={editProgram} className='btn'>Update</button>
                        ) : !projectExists && user ? (
                            <button onClick={saveProgram} className='btn'>Save</button>
                        ) : !user ? (
                            <button className='btn1' title='SignUp or Login Pls '>Save</button>
                        ) : (
                            ""
                        )}

                        <div className={`theme ${themeList ? 'block' : ''}`}>
                            {Object.keys(themes).map((themeName) => (
                                <p key={themeName} className='theme-list' onClick={() => changeTheme(themeName)}>
                                    {themeName}
                                </p>
                            ))}
                        </div>
                        <div>
                            {user ?
                                (
                                    user?.photoURL ? (
                                        <img src={user?.photoURL} />
                                    ) : (
                                        <p className='user-name'>{user?.email[0]}</p>
                                    )
                                ) :
                                (

                                    <p className='user-name'><PersonIcon /></p>

                                )
                            }
                        </div>

                        <IconButton onClick={togglemenu}><KeyboardArrowDownIcon className='option' /></IconButton>

                        <div className={`menu ${menuList ? "" : "block"}`} >
                            {
                                Menus && Menus.map((menu) => (
                                    <Link className='menu-list' to={menu.uri} key={menu.uri}>
                                        {menu.name}
                                    </Link>
                                ))
                            }
                            {
                                user ? (
                                    <p onClick={signOutAction} className={`sign-out`}>Sign out</p>
                                ) : (
                                    <Link to={"/home/auth"} style={{ textDecoration: "none" }} onClick={signOutAction} className={`sign-out`}>SignUp</Link>
                                )
                            }
                        </div>
                        <IconButton onClick={toggleSplitDirection}><ViewModuleIcon style={{ color: "white" }} /></IconButton>
                        <IconButton onClick={ThemeList}><SettingsIcon style={{ color: 'white', margin: "auto 0px", cursor: 'pointer', backgroundColor: "#404040", borderRadius: '5px' }} /></IconButton>

                    </div>

                </header>

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <PanelGroup direction={splitDirection} className='code-container'>
                        <Panel>
                            <PanelGroup direction="horizontal">
                                <Panel>
                                    <div style={{ borderRight: "1px solid grey" }}>
                                        <div className='pane'>
                                            <div className='left-side'>
                                                <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/2048px-HTML5_logo_and_wordmark.svg.png' style={{ height: '30px' }} />
                                                <span>HTML</span>
                                            </div>
                                            <div className='pane1'>
                                                <SettingsIcon className='setting' onClick={ThemeList} />
                                                <KeyboardArrowDownIcon />
                                            </div>
                                        </div>
                                        <div className='codeMirror'>
                                            <CodeMirror value={html} height={splitDirection === "vertical" ? "340px" : "100vh"} color='black' theme={themes[theme]} extensions={[javascript({ jsx: true })]} onChange={(value) => { setHtml(value) }} />
                                        </div>
                                    </div>
                                </Panel>
                                <PanelResizeHandle />
                                <Panel>
                                    <div style={{ borderRight: "1px solid grey" }}>
                                        <div className='pane'>
                                            <div className='left-side'>
                                                <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1452px-CSS3_logo_and_wordmark.svg.png' style={{ height: '30px' }} />
                                                <span>CSS</span>
                                            </div>
                                            <div className='pane1'>
                                                <SettingsIcon className='setting' onClick={ThemeList} />
                                                <KeyboardArrowDownIcon />

                                            </div>
                                        </div>
                                        <div className='codeMirror'>
                                            <CodeMirror value={css} height={splitDirection === "vertical" ? "340px" : "100vh"} color='black' theme={themes[theme]} extensions={[javascript({ jsx: true })]} onChange={(value, viewUpdate) => { setCss(value) }} />
                                        </div>
                                    </div>
                                </Panel>
                                <PanelResizeHandle />
                                <Panel>
                                    <div style={{ borderRight: "1px solid grey" }}>
                                        <div className='pane'>
                                            <div className='left-side'>
                                                <img src='https://1000logos.net/wp-content/uploads/2020/09/JavaScript-Logo.png' style={{ height: '30px' }} />
                                                <span>JS</span>
                                            </div>
                                            <div className='pane1'>
                                                <SettingsIcon className='setting' onClick={ThemeList} />
                                                <KeyboardArrowDownIcon />
                                            </div>
                                        </div>
                                        <div className='codeMirror'>
                                            <CodeMirror value={js} height={splitDirection === "vertical" ? "340px" : "100vh"} color='black' theme={themes[theme]} extensions={[javascript({ jsx: true })]} onChange={(value, viewUpdate) => { setJs(value) }} />
                                        </div>
                                    </div>
                                </Panel>
                            </PanelGroup>
                        </Panel>
                        {splitDirection === "horizontal" && <PanelResizeHandle />}
                        <Panel>
                            <div className='bottom-pane'>
                                <iframe title='Result' srcDoc={output} style={{ border: "none", width: "100%", height: "100%" }} />
                            </div>
                        </Panel>
                    </PanelGroup>
                </div>

            </div>
        </>
    );
};

export default NewProject;


{/* <SplitPane split={splitDirection} minSize={100} className='code-container' >
    <SplitPane split="vertical" minSize={100} >
        <div style={{ borderRight: "1px solid grey" }}>
            <div className='pane'>
                <div className='left-side'>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/2048px-HTML5_logo_and_wordmark.svg.png' style={{ height: '30px' }} />
                    <span>HTML</span>
                </div>
                <div className='pane1'>
                    <SettingsIcon className='setting' onClick={ThemeList} />
                    <KeyboardArrowDownIcon />
                </div>
            </div>
            <div className='CodeMirror'>
                <CodeMirror value={html} height={splitDirection === "vertical" ? "100vh" : "340px"} color='black' theme={themes[theme]} extensions={[javascript({ jsx: true })]} onChange={(value) => { setHtml(value) }} />
            </div>
        </div>

        <div style={{ borderRight: "1px solid grey" }}>
            <div className='pane'>
                <div className='left-side'>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1452px-CSS3_logo_and_wordmark.svg.png' style={{ height: '30px' }} />
                    <span>CSS</span>
                </div>
                <div className='pane1'>
                    <SettingsIcon className='setting' onClick={ThemeList} />
                    <KeyboardArrowDownIcon />

                </div>
            </div>
            <div className='CodeMirror'>
                <CodeMirror value={css} height={splitDirection === "vertical" ? "100vh" : "340px"} color='black' theme={themes[theme]} extensions={[javascript({ jsx: true })]} onChange={(value, viewUpdate) => { setCss(value) }} />
            </div>
        </div>

        <div style={{ borderRight: "1px solid grey" }}>
            <div className='pane'>
                <div className='left-side'>
                    <img src='https://1000logos.net/wp-content/uploads/2020/09/JavaScript-Logo.png' style={{ height: '30px' }} />
                    <span>JS</span>
                </div>
                <div className='pane1'>
                    <SettingsIcon className='setting' onClick={ThemeList} />
                    <KeyboardArrowDownIcon />

                </div>
            </div>
            <div className='CodeMirror'>
                <CodeMirror value={js} height={splitDirection === "vertical" ? "100vh" : "340px"} color='black' theme={themes[theme]} extensions={[javascript({ jsx: true })]} onChange={(value, viewUpdate) => { setJs(value) }} />
            </div>
        </div>

    </SplitPane>
    <div className='bottom-pane'>
        <iframe title='Result' srcDoc={output} style={{ border: "none", width: "100%", height: "100%" }} />
    </div>
</SplitPane> */}