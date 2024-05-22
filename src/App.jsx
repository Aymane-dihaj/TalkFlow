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


const App = () => {

  const {currentUser, isLoading, fetchUserInfo} = useUserStore()
  const { chatId } = useChatStore()

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
  console.log("CurrentUser: =========")
  console.log(currentUser)

  // auth.signOut()
  return (
    <div className='app'>
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
    </div>
  )
}

export default App