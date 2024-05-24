import React, { useState } from 'react'
import "./UserInfo.css"
import { useUserStore } from '../../../lib/userStore'
import { auth } from '../../../lib/firebase';



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
        <div className="more-container">
          <button onClick={() => {auth.signOut()}}>Logout</button>
        </div>
      }
    </section>
  )
}

export default UserInfo
