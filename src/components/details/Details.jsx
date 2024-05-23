import React from 'react'
import "./Details.css"
import { auth } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore'
import { useChatStore } from '../../lib/chatStore'

function Details() {
  const {otherUser} = useChatStore()
  
  
  return (
    <section className='detail'>
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>{otherUser.username}</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
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
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button>Block User</button>
        <button className='logout' onClick={() => {auth.signOut()}}>Logout</button>
      </div>
    </section>
  )
}

export default Details
