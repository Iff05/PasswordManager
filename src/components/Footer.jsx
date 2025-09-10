import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons'; // Import the specific icon

const Footer = () => {
  return (
    <div className='bg-purple-800 text-white flex flex-col justify-center items-center  bottom-0 left-0 w-full '>
      <div className="logo font-bold  text-white text-2xl ">
        <span className='text-purple-500'> &lt;</span>
        <span>Pass</span><span className='text-purple-500'>OP/&gt;</span>
      </div>
      <div className='flex'>
        Created with <FontAwesomeIcon icon={faHeart} className="text-red-500 p-1" /> By Iffath
      </div>
    </div>
  )
}

export default Footer;   