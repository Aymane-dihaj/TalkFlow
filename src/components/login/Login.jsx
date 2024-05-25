import React, { useState } from 'react'
import "./Login.css"
import toast from 'react-hot-toast'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import upload from '../../lib/upload'
import { motion } from 'framer-motion'


function Login() {


	const [waitRegister, setWaitRegister] = useState(false);
	const [waitLogin, setWaitLogin] = useState(false);

	const [avatar, setAvatar] = useState({
		file: null,
		url: "",
	})

	const handleAvatar = (e) => {
		if (e.target.files[0]){
			setAvatar({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0])
			})
		}
	}


	//LOGIN PROCESS
	const handleLogin = async (e) => {
		e.preventDefault();
		setWaitLogin(true);

		const formData = new FormData(e.target);

		const {email, password} = Object.fromEntries(formData);

		try{
			await signInWithEmailAndPassword(auth, email, password)
			setWaitLogin(false);
			toast.success("You are Logged In");
		}
		catch (error) {
			console.log(error.message)
			setWaitLogin(false);
			toast.error(error.message);
		}
	}

	//REGISTER PROCESS
	const handleRegister = async (e) => {
		e.preventDefault();
		setWaitRegister(true);

		//GETTING THE FORM INPUTS
		const formData = new FormData(e.target);
		
		const {username, email, password} = Object.fromEntries(formData);
		
		if (!avatar.file){
			setWaitRegister(false);
			return toast.error("Profile Picture is required!");
		}
	
		//CHECK IF THE USERNAME IS ALREADY TAKEN
		const usersCollection = collection(db, "users");
			
		const q = query(usersCollection, where("username", "==", username.toLowerCase()));
			
		const querySnapshot = await getDocs(q);
			
		if (!querySnapshot.empty){
			setWaitRegister(false);
			return toast.error("Username is already taken!");
		}

		try {
			
			//CREATE A USER DOCUMENT INSIDE THE 'USERS COLLECTION'
			const res = await createUserWithEmailAndPassword(auth, email, password);
			const userUID = res.user.uid

			//GET THE USER IMAGE URL TO USE IT LATER
			const imgUrl = await upload(avatar.file);

			//!IF THE 'users' COLLECTION DOSN'T EXISTS IT WILL BE CREATED
			await setDoc(doc(db, "users", userUID), {
				username: username.toLowerCase(),
				email: email.toLowerCase(),
				avatar: imgUrl,
				id: userUID,
				blocked: [],

			});
			
			//IF THE 'userchats' DOCUMENT DO NOT EXIST CREATE A COLLECTION NAMED 'userchats' 
			//WITH A DOCUMENT UNDER THE NAME OF 'userUID' VALUE
			await setDoc(doc(db, "userchats", userUID), {
				chats: [],
			});

			username = "";
			email = "";
			password = "";
			setWaitRegister(false);
			toast.success("Account Created Successfully You Can Login Now");


		} catch (error) {
			console.log(error.message)
			setWaitRegister(false);
			toast.error(error.message);
		}
	}

  return (
	<div className='login'>
		<motion.div className='login-container'
					initial={{ opacity: 0, translateX: -150}}
					animate={{ opacity: 1, translateX: 0}}
					transition={{type: 'spring', duration: 1}}
		>
			<h2>Welcome Back!</h2>
			<form onSubmit={handleLogin}>
				<div className="inputContainer">
					<p>Email</p>
					<input required type="text" name="email" placeholder="Email" />
				</div>
				<div className="inputContainer">
					<p>Password</p>
					<input required type="password" name="password" placeholder='Password' />
				</div>
				<button disabled={waitLogin}>{waitLogin ? "Loading..." : "Login"}</button>
			</form>
		</motion.div>
		<motion.div className="separator"
							initial={{ opacity: 0, translateY: -350}}
							animate={{ opacity: 1, translateY: 0}}
							transition={{type: 'spring', duration: 1}}
			></motion.div>
		<motion.div className='login-container'
						initial={{ opacity: 0, translateX: 150}}
						animate={{ opacity: 1, translateX: 0}}
						transition={{type: 'spring', duration: 1}}
			>
			<h2>Sign Up</h2>
			<form onSubmit={handleRegister}>
				<label htmlFor="file" >
					<img src={avatar.url || "./avatar.png"} alt="" />
					Upload an image
				</label>
				<input style={{display: 'none'}} type="file" name="file" id="file" onChange={handleAvatar}/>
				<div className="inputContainer">
					<p>Username</p>
					<input type="text" name="username" placeholder="username" required/>
				</div>
				<div className="inputContainer">
					<p>Email</p>
					<input type="text" name="email" placeholder="Enter Your Email" required/>
				</div>
				<div className="inputContainer">
					<p>Password</p>
					<input type="password" name="password" placeholder='Enter Your Password' required/>
				</div>
				<button disabled={waitRegister}>{waitRegister ? "..." : "Sign Up"}</button>
			</form>
		</motion.div>
	</div>
  )
}

export default Login
