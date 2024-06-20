import React, { useEffect, useState } from 'react'
import './App.css'
import Home from './components/Home/Home'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { auth, db } from './config/firebase.config'
import { collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore'
import Spiner from './components/Spiner'
import { useDispatch } from 'react-redux'
import { SET_USER } from './context/actions/userActions'
import NewProject from './components/NewProject/NewProject'
import { SET_PROJECTS } from './context/actions/ProjectActions'

const App = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(useCred => {

      if (useCred) {
        setDoc(doc(db, "Users", useCred?.uid), useCred?.providerData[0]).
          then(() => {
            dispatch(SET_USER(useCred?.providerData[0]))
            navigate("/home/projects", { replace: true })
          })
      }
      else {
        navigate("/home/auth", { replace: true });
      }

      setInterval(() => {
        setIsLoading(false)
      }, 3000)

    })

    return () => unsubscribe()
  }, [])


  useEffect(() => {
    const projectQuery = query(
      collection(db, "Projects"),
      orderBy("id", "desc")
    )

    const unsubscribe = onSnapshot(projectQuery, (querySnaps => {
      const projectList = querySnaps.docs.map(doc => doc.data())
      dispatch(SET_PROJECTS(projectList));
    }))

    return unsubscribe;
  }, []);


  return (
    <>
      {
        isLoading ?
          (
            <div className='spiner'>
              <Spiner />
            </div>
          ) :
          (
            <div>
              <Routes>
                <Route path='/home/*' element={<Home />} />
                <Route path='/newProject' element={<NewProject />} />
                <Route path='/newProject/:id' element={<NewProject />} />
                <Route path='*' element={<Navigate to={"/home"} />} />
              </Routes>
            </div>
          )
      }
    </>
  )
}

export default App
