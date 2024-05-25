import React, { useState } from 'react'
import "./UserInfo.css"
import { useUserStore } from '../../../lib/userStore'
import { auth } from '../../../lib/firebase';
import { motion } from 'framer-motion';



function UserInfo() {

  const {currentUser} = useUserStore();
  const [more, setMore] = useState(false);

  return (
    <section className='user-info'>
      <div className="user">
        <img src={ currentUser.avatar || "./avatar.png"} alt="Profile Picture" width={60} />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="More" onClick={() => {setMore(!more)}}/>
        <img src="./edit.png" alt="Edit" />
      </div>
      { more && 
        <motion.div className="more-container"

        initial={{ opacity: 0, scale: 0.75 , translateX: 50}}
        animate={{ opacity: 1, scale: 1 , translateX: 0}}
        transition={{ease: 'easeInOut'}}
        // exit={{ opacity: 0, scale: 0 , translateX: 50}}
        
        >
          <button onClick={() => {auth.signOut()}}>Logout</button>
        </motion.div>
      }
    </section>
  )
}

export default UserInfo
