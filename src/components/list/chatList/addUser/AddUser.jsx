import React, { useState } from 'react'
import "./AddUser.css"
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { update } from 'firebase/database';
import { useUserStore } from '../../../../lib/userStore';
import { connectStorageEmulator } from 'firebase/storage';

function AddUser() {

  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore();

  const Adduser = async (e) => {

    e.preventDefault();
    //Get form informations
    const formData = new FormData(e.target);
    const username = formData.get("username");
    try {

      //Get the users collection reference from the database
      const userRef = collection(db, "users");

      //Get a query of the username
      const q = query(userRef, where("username", "==", username));

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
    <div className='add-user'>
      <form onSubmit={Adduser}>
        <input type="text" name="username" id="username" placeholder='Username' />
        <button>Search</button>
      </form>
      {user && <div className="user">
        <div className="detail">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
      </div>}
    </div>
  )
}

export default AddUser
