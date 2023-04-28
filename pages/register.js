import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import { auth } from '@/firebase/firebase';
import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider,
} from 'firebase/auth';
import { useAuth } from '../firebase/auth';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';

const RegisterForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState(null);
    const [useremail, setUseremail] = useState(null);
    const [userpassword, setUserpassword] = useState(null);
    const { authUser, isLoading, setAuthUser } = useAuth();

    useEffect(() => {
        if (!isLoading && authUser) {
            router.push("/");
        }
    }, [authUser, isLoading]);

    //Created Google Provider Instance
    const provider = new GoogleAuthProvider();

    //Created Github Provider Instance
    const githubProvider = new GithubAuthProvider();

    // Implemented a custom initialization of user functionality in Firebase
    const signUpHandler = async () => {
        if (!username || !userpassword || !useremail) return;

        try {
            const {user} = await createUserWithEmailAndPassword(
                auth,
                useremail,
                userpassword
            );
            await updateProfile(auth.currentUser, {
                displayName: username,
            });
            setAuthUser({
                uid: user.uid,
                email: user.email,
                username: user.displayName,
            })
            console.log(user);
        } catch (error) {
            console.error('An Error Occured!!', error);
        }
    };
    // Implemented a functionlity of google account Sign in with firebase..
    const signInWithGoogle = async () => {
        const user = await signInWithPopup(auth, provider);
        console.log(user);
    };
    // Implemented a functionlity of google account Sign in with firebase..
    const signInWithGithub = async () => {
        const user = await signInWithPopup(auth, githubProvider);
        console.log(user);
    };
    return isLoading || (!isLoading && authUser) ? <Loading /> : (
        <main className='flex lg:h-[100vh]'>
            <div className='w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start'>
                <div className='p-0 md:p-8 w-[600px]'>
                    <h1 className='text-6xl font-semibold text-center'>Sign Up</h1>
                    <p className='mt-6 ml-1 text-center'>
                        Already have an account ?{' '}
                        <span className='underline hover:text-blue-400 cursor-pointer' onClick={() => window.open("/login", "_self")}>
                            Login
                        </span>
                    </p>
                    <div className='flex gap-2 flex-col md:flex-row'>
                        <div
                            onClick={signInWithGoogle}
                            className='bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group'>
                            <FcGoogle size={22} />
                            <span className='font-medium text-black group-hover:text-white'>
                                Login with Google
                            </span>
                        </div>
                        <div
                            onClick={signInWithGithub}
                            className='bg-black  text-white w-full py-4 mt-10 rounded-full transition-transform  active:scale-90 flex justify-center items-center gap-4 cursor-pointer group'>
                            <AiFillGithub size={22} className='text-white' />
                            <span className='font-medium  group-hover:text-white'>
                                Login with Github
                            </span>
                        </div>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className='mt-8 pl-1 flex flex-col'>
                            <label>Name</label>
                            <input
                                required
                                onChange={(e) => setUsername(e.target.value)}
                                type='text'
                                className='font-medium border-b border-black p-1 outline-0 focus-within:border-orange-400'
                            />
                        </div>
                        <div className='mt-8 pl-1 flex flex-col'>
                            <label>Email</label>
                            <input
                                required
                                onChange={(e) => setUseremail(e.target.value)}
                                type='email'
                                className='font-medium border-b border-black p-1 outline-0 focus-within:border-orange-400'
                            />
                        </div>
                        <div className='mt-8 pl-1 flex flex-col'>
                            <label>Password</label>
                            <input
                                required
                                onChange={(e) => setUserpassword(e.target.value)}
                                type='password'
                                className='font-medium border-b border-black p-1 outline-0 focus-within:border-blue-400'
                            />
                        </div>
                        <button
                            onClick={signUpHandler}
                            className='bg-black table m-auto text-white w-44 py-4 mt-8 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90'>
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
            <div
                className='w-[50%] bg-slate-400 bg-cover bg-right-top hidden lg:block'
                style={{
                    backgroundImage: "url('/login-banner.jpg')",
                }}></div>
        </main>
    );
};

export default RegisterForm;
