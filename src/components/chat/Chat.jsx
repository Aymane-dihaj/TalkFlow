import React, { useDebugValue, useEffect, useReducer, useRef, useState } from 'react'
import "./Chat.css"
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload'
import { connectStorageEmulator } from 'firebase/storage';
import { motion } from 'framer-motion';
import { useImgStore } from '../../lib/imgStore';
import { format, formatDistanceToNow } from 'date-fns';

function Chat() {

  const [openEmojis, setOpenEmojis] = useState(false);
  const [TextMessage, setTextMessage] = useState('');
  const [chat, setChat] = useState();
  const {chatId, otherUser, isCurrentUserBlocked, isOtherUserBlocked} = useChatStore();
  const { currentUser } = useUserStore()
  const [img, setImg] = useState({
    file: null,
    url: "",
  })
  const [imgLoading, setImgLoading] = useState(false);
  const { images, pushImg} = useImgStore();



	const handleImg = (e) => {
		if (e.target.files[0]){
			setImg({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0])
			})
		}
	}




  const handelEmoji = (e) =>{
      setTextMessage(TextMessage + e.emoji);
      setOpenEmojis(false);
  }



  const endRef = useRef(null);
  
  
  useEffect(() => {
    
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data())
    })
    
    
    return () => {unSub()}
  }, [chatId]) 
  
  
  
  
  const handleSend = async () => {
    
    if (TextMessage == "" && !img.url)
      return;
    
    let imgUrl = null;
    
      try {
        
        //CREATE AN IMG URL IF THE USER SENDS AN IMAGE
        if (img.url){
          setImgLoading(true);
          imgUrl = await upload(img.file);
          pushImg(imgUrl);
          setImgLoading(false);
        }

        
        //ADD A NEW MESSAGE IN THE CHATS DATABASE
        await updateDoc(doc(db, "chats", chatId), {
          messages:arrayUnion({
            senderId: currentUser.id,
            TextMessage,
            createdAt: new Date(),
            ...(imgUrl && {img: imgUrl})
          })
        })
        
        setTextMessage('')
        setImg({
          file: null,
          url: ""
        })
        
        //LOOP THROUGH THE USERS AND UPDATE EACH 'userchats' 
        const usersIDs = [currentUser.id, otherUser.id].forEach( async (id) => {
          
          //CREATE A REF OF 'userchats' DOCUMENT OF THE USER
          const userChatRef = doc(db, "userchats", id);
          
          //GET THE USERCHATS DOCUMENT FROM THE FIRESTORE
          const userChatSnap = await getDoc(userChatRef);
          
          
          if (userChatSnap.exists()){
            
            const userChatData = userChatSnap.data();

            //FIND THE INDEX OF THE USERCHAT
            const currentChatIndex = userChatData.chats.findIndex(chat => chat.chatId === chatId);
            if (!TextMessage)
              userChatData.chats[currentChatIndex].lastMessage = id === currentUser.id ? `You: Photo` : 'Photo';
            else 
              userChatData.chats[currentChatIndex].lastMessage = id === currentUser.id ? `You: ${TextMessage}` : TextMessage; 
            userChatData.chats[currentChatIndex].isSeen = id === currentUser.id ? true : false;
            userChatData.chats[currentChatIndex].updatedAt = Date.now();
            
            //UPADATE THE 'userchats' DOC 
            await updateDoc(userChatRef, {
              chats: userChatData.chats,
            })
            
          }
        })
        
      }catch (error) {
        console.log(error)
      }
      
     
      
    }

    const goDown = () => {
      endRef.current?.scrollIntoView({behavior: "smooth"})
    }

    
      useEffect(() => {
          endRef.current?.scrollIntoView({behavior: "smooth"})
      }, [handleSend])
    

      const handleKeyPress = (key) => {
          if (key.code === "Enter")
            handleSend()
      }
    
      
    
    return (
      <section className='chat'>
      <div className="top">
        <div className="user">
          <img src={!isCurrentUserBlocked ? otherUser?.avatar : "./avatar.png"} alt="" />
          <div className="text">
            <span>{isCurrentUserBlocked ? 'User' : otherUser?.username}</span>
          </div>
        </div>
        <div className="icons">
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="main">
        {chat?.messages?.map((message) => ( 
          
            <motion.div
          className={
            message.senderId === currentUser?.id ? "message own" : "message"
          }

          initial={{translateX: message.senderId === currentUser.id ?  100 : -100}}
          animate={{translateX: 0}}
          

            key={message?.createdAt}

          >
            <div className="texts" >
              {message.img && <img src={message.img} alt="" />}
              <p style={{display: message.TextMessage ? 'flex' : 'none'}}>{message.TextMessage}</p>
              <span style={{justifyContent: message.senderId === currentUser?.id ? 'end' : 'start'}}>{formatDistanceToNow(message.createdAt.toDate(), {addSuffix: true})}</span>
            </div>
          </motion.div>
        ))}
        { img.url &&
          <div className='message own' style={{opacity: 0.5}}>
            <div className="texts">
              <img src={imgLoading ? './loading1.svg' : img.url} alt="" />
            </div>
          </div>
        }
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="goDown" onClick={goDown}>
          <img src="./arrowDown.png" alt=""/>
        </div>
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
            <input onChange={handleImg} type="file" style={{display: 'none'}} name="file" id="file" />
        </div>
        <div className="input-container">
          
          <input disabled={isCurrentUserBlocked || isOtherUserBlocked} style={{cursor: isCurrentUserBlocked || isOtherUserBlocked ? 'not-allowed' : 'text'}} value={TextMessage} onKeyPress={handleKeyPress} type="text" onChange={(e) => {setTextMessage(e.target.value)}} placeholder={isCurrentUserBlocked || isOtherUserBlocked ? 'You Cannot Send Any Message' : 'Type a Message'}/>
          <div className="emojis">
            <img src="./emoji.png" alt="" onClick={() => {setOpenEmojis(!openEmojis)}}/>
            <div className="emoji-container">
              <EmojiPicker open={openEmojis} onEmojiClick={handelEmoji} theme='dark' searchPlaceHolder='' emojiStyle='apple' width={300} height={420}/>
            </div>
          </div>
        </div>
          <button disabled={isCurrentUserBlocked || isOtherUserBlocked} className='send-btn' onClick={handleSend}>
            Send
          </button>
      </div>
      
    </section>
    )
  }

export default Chat
