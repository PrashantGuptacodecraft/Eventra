
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import { useApp } from './context/AppContext'
import Notes from './pages/Notes'

// import { useState } from 'react'

function App() {
  // const[selectedTab,setSelectedTab]=useState("Tasks")
  const { notes } = useApp()

  return (
  
   <div className='app-container'>
    
   <Sidebar></Sidebar>
    <div className='content'>
      <Header></Header>
      {/* {selectedTab===Task ? <Task></Task>:null} */}

      <h2>Total Notes: {notes.length}</h2>
    <Notes></Notes>
       <Footer></Footer>
    </div>

  
   </div>
   
   
  )
}

export default App
