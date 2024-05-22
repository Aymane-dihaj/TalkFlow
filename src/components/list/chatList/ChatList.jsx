import React, { useEffect, useState } from 'react'
import "./ChatList.css"
import AddUser from "./addUser/AddUser"
import { useUserStore } from '../../../lib/userStore';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getDatabase } from 'firebase/database';
import { useChatStore } from '../../../lib/chatStore';

function ChatList() {

  const [addMode, setAddMode] = useState(false);
  const {currentUser} = useUserStore();
  const [chats, setChats] = useState([]);
  const {chatId, changeChat} = useChatStore();

  useEffect(() => {

    //GET A REFERENCE OF 'userchats' DOCUMENT FOR THE CURRENT USER
    const userChatsRef = doc(db, "userchats", currentUser.id);

    //LISTEN FOR CHANGES IN 'userchats' DOCUMENT FOR THE CURRENT USER
    const unSub = onSnapshot(userChatsRef, async (res) =>{

      //GET THE userchats.chats OF THE CURRENT USER
      const item = res.data().chats;
      console.log("iteeeeems")
      console.log(item)

      //MAKE PROMISES FOR ALL THE USERS THE THE CURRENT CLIENT HAVE IN HIS userchats
      const promises = item.map(async (item) => {
        
        //GET THE DOCUMENT OF THE OTHER USER
        const otherUserDocRef = doc(db, "users", item.receiverId);
        const otherUserDocSnap = await getDoc(otherUserDocRef);

        
        const otherUserInfos = otherUserDocSnap.data()
        // console.log(otherUserInfos)
        
        //RETURN THE CHAT OBJECT WITH THE OTHER USER INFORMATIONS INSIDE IT
        return {...item, otherUserInfos};
      });
      
      const chatData = await Promise.all(promises);

      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    })

    return () => {unSub()}; 
  }, [currentUser.id])


  const handleSelectedChat = async (chat) => {

    //!we are herer!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const userChats = 

    changeChat(chat.chatId, chat.otherUserInfos) 
  }

  return (
    <section className='chat-list'>
      <div className="search">
        <div className="search-bar">
          <img src="./search.png" alt="Search Icon" />
          <input type="text" placeholder='Search'/>
        </div>
        <img src={!addMode ?  "./plus.png" : "./minus.png"} onClick={() => {setAddMode(!addMode)}} className='add' alt="Add Icon"/>
      </div>
      {chats.map((chat) => (
          <div className="item" key={chat.chatId} onClick={() => handleSelectedChat(chat)}>
          <img src={chat.otherUserInfos.avatar || "./avatar.png"} alt="Avatar" />
          <div className="text">
            <span>{chat.otherUserInfos.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))
      }
      {addMode && <AddUser/>}
    </section>
  )
}

export default ChatList
