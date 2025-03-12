import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import  Home  from '../src/components/Home.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import UserHomePage from './components/UserHomePage'
import UserProfile from './components/UserProfile.jsx'
import { ToastContainer, toast } from 'react-toastify';


const router=createBrowserRouter([{
  path:"/",
  element:<App/>,
  children:[
    {index:true,
      element:<Home/>
    }
    ,
    {
  path:"/login",
      element:<Login/>
    },
    {
      path:"signup" ,
      element:<Signup/>
    },
    {
      path:"userhome" ,
      element:<UserHomePage/>
    },{
      path:"userprofile" ,
      element:<UserProfile/>
    }
  ]
}])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    <ToastContainer />
      </Provider>
  </StrictMode>,
)
