import React from 'react'
import '../css/Sidebar.css'
import { useActionData } from 'react-router-dom'
import { useAllData } from '../context/AllDataCOntext'

export default function Sidebar() {

  const {files} = useAllData();
  console.log(files);
  
  return (

    <>
    <div className='sidebar-main-div'>
   history
   <ul>
   { files.map( ( file ,index)=>(  
      <li>{file.name} </li>
   )
   )
    }
   </ul>
    
    </div>
    </>
  )
}
