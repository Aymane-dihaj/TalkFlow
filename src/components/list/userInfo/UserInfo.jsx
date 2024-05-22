import React from 'react'
import "./UserInfo.css"
import { useUserStore } from '../../../lib/userStore'

function UserInfo() {

  const {currentUser} = useUserStore();

  return (
    <section className='user-info'>
      <div className="user">
        <img src={ currentUser.avatar || "./avatar.png"} alt="Profile Picture" width={60} />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="More" />
        <img src="./video.png" alt="Video" />
        <img src="./edit.png" alt="Edit" />
      </div>
    </section>
  )
}

export default UserInfo
