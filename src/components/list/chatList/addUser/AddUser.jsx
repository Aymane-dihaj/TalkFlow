import React, { useState } from 'react'
import "./AddUser.css"
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { update } from 'firebase/database';
import { useUserStore } from '../../../../lib/userStore';
import { connectStorageEmulator } from 'firebase/storage';
import { motion } from 'framer-motion';

function AddUser() {
  
  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore();
  const [duplicate, setDuplicate] = useState(false);

  const Adduser = async (e) => {

    e.preventDefault();
    //Get form informations
    const formData = new FormData(e.target);
    const username = formData.get("username");
    try {

      //Get the users collection reference from the database
      const usersRef = collection(db, "users");

      //Get a query of the username
      const q = query(usersRef, where("username", "==", username));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty){
      setUser(querySnapshot.docs[0].data());
      
    }
      
    } catch (error) {
      console.log(error)
    }

  }


  const handleAdd = async () => {


    
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    
    try {


      const usersRef = doc(userChatsRef, currentUser.id);
      const userchatsSnap = await getDoc(usersRef);


        const data = userchatsSnap.data();
        
        
        const dup = data.chats.find(item => item.receiverId === user.id);
        
        if (dup){
          setDuplicate(true);
          return ;
        }else{
          setDuplicate(false);
        }

      
      const newChatRef = doc(chatRef)
      
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: []
      });
      
      await updateDoc(doc(userChatsRef, user.id), {
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        })
      })


      
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      })
      
      
    } catch (error) {
        console.log(error);
    }

  }

  return (
    <motion.div className='add-user'

      initial={{opacity: 0}}
      animate={{opacity: 1}}

    >
      <form onSubmit={Adduser}>
        <input type="text" name="username" id="username" placeholder='Username' />
        <button>Search</button>
      </form>
      {user && <div className="user" style={{opacity: duplicate ? 0.5 : 1}}>
        <div className="detail">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
      </div>}
    </motion.div>
  )
}

export default AddUser
