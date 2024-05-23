import React, { useDebugValue, useEffect, useReducer, useRef, useState } from 'react'
import "./Chat.css"
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload'
import { connectStorageEmulator } from 'firebase/storage';

function Chat() {

  const [openEmojis, setOpenEmojis] = useState(false);
  const [TextMessage, setTextMessage] = useState('');
  const [chat, setChat] = useState();
  const {chatId, otherUser} = useChatStore();
  const { currentUser } = useUserStore()
  const [img, setImg] = useState({
    file: null,
    url: "",
  })


  const handelEmoji = (e) =>{
      setTextMessage(TextMessage + e.emoji);
      setOpenEmojis(false);
  }



  const endRef = useRef(null);
  
  
  useEffect(() => {
    
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      console.log("useEffect: chat updated")
      setChat(res.data())
    })
    
    
    return () => {unSub()}
  }, [chatId]) 
  
  
  
  
  const handleSend = async () => {
    
    console.log("Send button clicked")
    
    if (TextMessage == "")
      return;
    
    let imgUrl = null;
    
      try {
        
        //CREATE AN IMG URL IF THE USER SENDS AN IMAGE
        if (img.url){
          imgUrl = await upload(img.file);
        }
        
        //UPDATE THE 'chats' DOCUMENT FOR THE 
        await updateDoc(doc(db, "chats", chatId), {
          messages:arrayUnion({
            senderId: currentUser.id,
            TextMessage,
            createdAt: new Date(),
            ...(imgUrl && {img: imgUrl})
          })
        })
        
        setTextMessage('')
        
        //CREATE A REF OF 'userchats' DOCUMENT OF THE CURRENT USER ID
        const userChatRef = doc(db, "userchats", currentUser.id);
        
        //GET THE DOCUMENT FROM THE FIRESTORE
        const userChatSnap = await getDoc(userChatRef);
        
        
        if (userChatSnap.exists()){
          
          const userChatData = userChatSnap.data();
          
            const currentChatIndex = userChatData.chats.findIndex(chat => chat.chatId === chatId);
            userChatData[currentChatIndex].lastMessage = TextMessage
            userChatData[currentChatIndex].isSeen = true;
            userChatData[currentChatIndex].updatedAt = Date.now();
          
          //UPADATE THE 'userchats' DOC OF THE 
          await updateDoc(userChatRef, {
            chats: userChatData.chats,
          })
          
        }
        
      }catch (error) {
        console.log(error)
      }
      
      
    }

    
      useEffect(() => {
          endRef.current?.scrollIntoView({behavior: "smooth"})
      }, [handleSend])
    
    
    
    return (
      <section className='chat'>
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>{otherUser?.username}</span>
            <p>aliquid rerum  Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p> 
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="main">
        {chat?.messages?.map((message) => (
          <div
            key={message?.createAt}

            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.TextMessage}</p>
              {/* <span>{format(message.createdAt.toDate())}</span> */}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" /><img src="./camera.png" alt="" /><img src="mic.png" alt="" />
        </div>
        <input value={TextMessage} type="text" onChange={(e) => {setTextMessage(e.target.value)}} placeholder='Type a message...'/>
        <div className="emojis">
          <img src="./emoji.png" alt="" onClick={() => {setOpenEmojis(!openEmojis)}}/>
          <div className="emoji-container">
            <EmojiPicker open={openEmojis} onEmojiClick={handelEmoji} theme='dark' searchPlaceHolder='' width={300} height={420}/>
          </div>
        </div>
        <button className='send-btn' onClick={handleSend}>Send</button>
      </div>
      
    </section>
    )
  }

export default Chat
