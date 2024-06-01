import React, { useState } from 'react'
import "./UserInfo.css"
import { useUserStore } from '../../../lib/userStore'
import { auth } from '../../../lib/firebase';
import { motion } from 'framer-motion';
import { useChatStore } from '../../../lib/chatStore';



function UserInfo() {

  const {currentUser} = useUserStore();
  const [more, setMore] = useState(false);
  const { chatId } = useChatStore();

  return (
    <section className='user-info'>
      <div className="user">
        <img src={ currentUser.avatar || "./avatar.png"} alt="Profile Picture" width={60} />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="More" onClick={() => {setMore(!more)}}/>
      </div>
      { more && 
        <motion.div className="more-container" style={{right: chatId ? '78%' : '8%'}}

        initial={{ opacity: 0, scale: 0.75 , translateX: 50}}
        animate={{ opacity: 1, scale: 1 , translateX: 0}}
        transition={{ease: 'easeInOut'}}
        // exit={{ opacity: 0, scale: 0 , translateX: 50}}
        
        >
          <button className='logout' onClick={() => {auth.signOut()}}>Logout</button>
        </motion.div>
      }
    </section>
  )
}

export default UserInfo
