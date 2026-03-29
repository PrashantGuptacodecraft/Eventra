
import './App.css'

import { useApp } from './context/AppContext'

// Components
import Header  from './components/Header'
import Sidebar from './components/Sidebar'
import Footer  from './components/Footer'
// import Toast   from './components/Toast'

// Pages
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Tasks      from './pages/Tasks'
import Events     from './pages/Events'
import Hackathons from './pages/Hackathons'
import QnA        from './pages/QnA'
import Notes      from './pages/Notes'
import Profile    from './pages/Profile'
import Admin      from './pages/Admin'

// import { useState } from 'react'

function App() {
  // const[selectedTab,setSelectedTab]=useState("Tasks")
  const { notes } = useApp()

  return (
  
    <div>

 
   <div className='app-container'>
    
   <Sidebar></Sidebar>
    <div className='content'>
      <Header></Header>
      {/* {selectedTab===Task ? <Task></Task>:null} */}

      <h2>Total Notes: {notes.length+1}</h2>
      <Dashboard></Dashboard>
    <Notes></Notes>
    <Events></Events>
    
    
    </div>
   </div>
       <Footer></Footer>
  
   </div>
   
   
  )
}

export default App
