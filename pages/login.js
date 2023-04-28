import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../firebase/auth';
import { auth } from '@/firebase/firebase';
import {
	GoogleAuthProvider,
	signInWithPopup,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';

const Provider = new GoogleAuthProvider();

const LoginForm = () => {
	const router = useRouter();
	const [useremail, setUseremail] = useState(null);
	const [userpassword, setUserpassword] = useState(null);
	const { authUser, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && authUser) {
			router.push("/");
		}
	}, [authUser, isLoading, router]);

	//Login Button Handler Functionality
	const loginHandler = async () => {
		if (!userpassword || !useremail) return;
		try {
			const user = await signInWithEmailAndPassword(
				auth,
				useremail,
				userpassword
			);
			console.log(user);
		} catch (error) {
			console.error(error);
		}
	};

	// Implemented a functionlity of google account Sign in with firebase..
	const signInWithGoogle = async () => {
		try {
			const user = await signInWithPopup(auth, Provider);
			console.log(user);
		} catch (error) {
			console.error(error);
		}
	};

	return isLoading || (!isLoading && authUser) ? <Loading /> : (
		<main className='flex lg:h-[100vh] '>
			<div className='w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start '>
				<div className='p-0 md:p-8 w-[600px] '>
					<h1 className='text-6xl font-semibold text-center'>Login</h1>
					<p className='mt-6 ml-1 text-center'>
						Don't have an account ?{' '}
						<span
							className='underline hover:text-blue-400 cursor-pointer'
							onClick={() => window.open('/register', '_self')}>
							Sign Up
						</span>
					</p>
					<form onSubmit={(e) => e.preventDefault()}>
						<div className='bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group'>
							<FcGoogle size={22} />
							<span
								className='font-medium text-black group-hover:text-white'
								onClick={signInWithGoogle}>
								Login with Google
							</span>
						</div>

						<div className='mt-10 pl-1 flex flex-col'>
							<label>Email</label>
							<input
								type='email'
								required
								onChange={(e) => setUseremail(e.target.value)}
								className='font-medium border-b border-black p-4 outline-0 focus-within:border-orange-400'
							/>
						</div>
						<div className='mt-10 pl-1 flex flex-col'>
							<label>Password</label>
							<input
								type='password'
								required
								onChange={(e) => setUserpassword(e.target.value)}
								className='font-medium border-b border-black p-4 outline-0 focus-within:border-orange-400'
							/>
						</div>
						<button
							onClick={loginHandler}
							className='bg-black table m-auto text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90'>
							Sign in
						</button>
					</form>
				</div>
			</div>
			<div
				className='w-[40%] bg-slate-400 bg-cover bg-right-top hidden lg:block'
				style={{
					backgroundImage: "url('/login-banner.jpg')",
				}}></div>
		</main>
	);
};

export default LoginForm;
