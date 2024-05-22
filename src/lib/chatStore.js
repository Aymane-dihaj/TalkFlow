import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { create } from 'zustand'
import { db } from './firebase';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  chatId: null,
  otherUser: null, 
  isCurrentUserBlocked: false,
  isOtherUserBlocked: false,
  changeChat: async (chatId, otherUser) =>{

    const currentUser = useUserStore.getState().currentUser;

    //  CHECK IF CURRENT USER IS BLOCKED
      if (otherUser.blocked.includes(currentUser.id)){

            return set({
               chatId,
               otherUser: null,
               isCurrentUserBlocked: true,
               isOtherUserBlocked: false,
            })
      }
      
      //  CHECK IF THE OtherUser IS BLOCKED
      else if (currentUser.blocked.includes(otherUser.id)){

            return set({
               chatId,
               otherUser,
               isCurrentUserBlocked: false,
               isOtherUserBlocked: true,
            })  
         }
      else{
         //RETURN THE CHAT ID AND THE OTHER USER INFORMATIONS
         return set({
            chatId,
            otherUser,
            isCurrentUserBlocked: false,
            isOtherUserBlocked:  false,
         })
      }
  },

  handleBlock: () => {
    set((state) => ({isOtherUserBlocked: !isOtherUserBlocked}))
  }
}))