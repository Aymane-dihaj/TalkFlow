import React, { useState } from 'react'
import "./Details.css"
import { auth, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore'
import { useChatStore } from '../../lib/chatStore'
import { motion } from 'framer-motion'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { connectStorageEmulator } from 'firebase/storage'

function Details() {
  const {otherUser, chatId, isCurrentUserBlocked, isOtherUserBlocked, changeBlock} = useChatStore()

  const [photosOption, setPhotosOption] = useState(false);
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!otherUser)
        return ;
    try {
      const usersRef = doc(db, "users", currentUser.id)
      await updateDoc(usersRef, {
        blocked: isOtherUserBlocked ? arrayRemove(otherUser.id) : arrayUnion(otherUser.id),
      })
      changeBlock()
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <motion.div className='detail'
    
      initial={{opacity: 0}}
      animate={{opacity: 1}}
    >
      <div className="user">
        <img src={otherUser?.avatar || "./avatar.png"} alt="" />
        <h2>{otherUser?.username}</h2>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src={photosOption ? "./arrowDown.png" : "./arrowUp.png"} alt="" onClick={() => {setPhotosOption(!photosOption)}}/>
          </div>
          {!photosOption &&
            <motion.div className="photos"
              initial={{translateY: -50}}
              animate={{translateY: 0}}
              transition={{duration: 0.3, type:'spring'}}
            >
              <div className="photo-item">
                <div className="photoInfos">
                  <img src="./bg.jpg" alt="" width={100}/>
                  <span>photo-123.png</span>
                </div>
                <img src="./download.png" alt="" className='icon' />
              </div>
              <div className="photo-item">
                <div className="photoInfos">
                  <img src="./bg.jpg" alt="" width={100}/>
                  <span>photo-123.png</span>
                </div>
                <img src="./download.png" alt="" className='icon' />
              </div>
              <div className="photo-item">
                <div className="photoInfos">
                  <img src="./bg.jpg" alt="" width={100}/>
                  <span>photo-123.png</span>
                </div>
                <img src="./download.png" alt="" className='icon' />
              </div>
            </motion.div>
          }
          </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock} >{

            isCurrentUserBlocked ? "You Are Blocked!" : isOtherUserBlocked ? `Unblock ${otherUser.username}` : `Block ${otherUser.username}`
              }
        </button>
        <button className='logout' onClick={() => {auth.signOut()}}>Logout</button>
      </div>
    </motion.div>
  )
}

export default Details
