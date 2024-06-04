import { useEffect } from 'react';
import Chat from './components/chat/Chat'
import Details from './components/details/Details'
import List from './components/list/List'
import Login from './components/login/Login';
import Notification from './components/notification/Notification'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useUserStore } from './lib/userStore';
import { useChatStore } from './lib/chatStore';
import { motion } from 'framer-motion';


const App = () => {

  const {currentUser, isLoading, fetchUserInfo} = useUserStore()
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
        fetchUserInfo(user?.uid);
    },)
    
    return () => {
      unSub();
    }
  }, [fetchUserInfo])
  

  if (isLoading){
    return <div className="loader"></div>
  }


  return (
    <motion.div className='app' initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.4}}>
      {
        currentUser ? (
          <>
            <List/>
            {chatId && <Chat/>}
            {chatId && <Details/>}
          </>
          ) : (<Login/>)
      }
      <Notification/>
    </motion.div>
  )
}

export default App