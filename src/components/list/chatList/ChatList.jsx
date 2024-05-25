import React, { useEffect, useState } from 'react'
import "./ChatList.css"
import AddUser from "./addUser/AddUser"
import { useUserStore } from '../../../lib/userStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getDatabase, update } from 'firebase/database';
import { useChatStore } from '../../../lib/chatStore';
import { motion } from 'framer-motion';

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

    const userChats = chats.map((item) => {
      const {user, ...rest} = item

      return rest
    })

    const chatIndex = userChats.findIndex(item=>item.chatId == chat.chatId)

    userChats[chatIndex].isSeen = true

    const userChatsRef = doc(db, "userchats", currentUser.id)

    try {
      
      await updateDoc(userChatsRef, {
        chats: userChats,
      })

      changeChat(chat.chatId, chat.otherUserInfos) 

    } catch (err) {
        console.log(err)      
    }


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
          <motion.div
            initial={{opacity: 0, translateY: 200}}
            animate={{opacity: 1, translateY: 0}}
            transition={{type: 'just'}}
          style={{
            backgroundColor: chat.isSeen ? "transparent" : "#0194E9"
            // background: "linear-gradient(90deg, #0194E9, #0368D8)"

          }} className="item" key={chat.chatId} onClick={() => handleSelectedChat(chat)}>
          <img src={chat.otherUserInfos.avatar || "./avatar.png"} alt="Avatar" />
          <div className="text">
            <span>{chat.otherUserInfos.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </motion.div>
      ))
      }
      {addMode && <AddUser/>}
    </section>
  )
}

export default ChatList
