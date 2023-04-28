import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';
import { GoSignOut } from 'react-icons/go';
import { useAuth } from '../firebase/auth';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';
import React, { useEffect, useState } from 'react';
import {
	collection,
	addDoc,
	getDocs,
	where,
	query,
	deleteDoc,
	updateDoc,
	doc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Image from 'next/image';

export default function Home() {
	const router = useRouter();
	const { authUser, isLoading, signOut } = useAuth();
	const [itemInput, setItemInput] = useState('');
	const [items, setItems] = useState([]);

	useEffect(() => {
		if (!isLoading && !authUser) {
			router.push('/login');
		}
		if (!!authUser) {
			fetchItems(authUser.uid);
		}
	}, [authUser, isLoading]);

	//Add Items Functionality
	const addItems = async () => {
		try {
			// Add a new document with a firebase random generated id.
			// Add a new todo document to the "TaskMaster" collection in Firestore with the current user's ID.
			const docRef = await addDoc(collection(db, 'TaskMaster'), {
				owner: authUser.uid,
				item: itemInput,
				completed: false,
			});
			console.log('Document written with ID: ', docRef.id);

			fetchItems(authUser.uid);
			setItemInput('');
		} catch (error) {
			console.error(error);
		}
	};

	//Delete Items Functionality
	const deleteItem = async (docId) => {
		try {
			await deleteDoc(doc(db, 'TaskMaster', docId));
			fetchItems(authUser.uid);
		} catch (error) {
			console.error(error);
		}
	};
	// Check the Item when the task is completed functionality..
	const CheckedItemHandler = async (event, docId) => {
		try {
			const docRefs = doc(db, 'TaskMaster', docId);
			await updateDoc(docRefs, {
				completed: event.target.checked,
			});
			fetchItems(authUser.uid);
		} catch (error) {
			console.error(error);
		}
	};

	//Fetch Items Functionality to the Firebase Database
	const fetchItems = async (uid) => {
		try {
			// Create a Firestore query to fetch all the todos for the user with the given ID.
			const q = query(collection(db, 'TaskMaster'), where('owner', '==', uid));

			// Execute the query and get a snapshot of the results.
			const querySnapshot = await getDocs(q);

			let data = [];
			querySnapshot.forEach((doc) => {
				// Extract the data from each todo document and add it to the data array.
				console.log(doc.id, ' => ', doc.data());
				data.push({ ...doc.data(), id: doc.id });
			});

			setItems(data);
		} catch (error) {
			console.error(error);
		}
	};
	// Hit enter to add an item to the content list functionality
	const onKeyUp = (event) => {
		if (event.key === 'Enter' && itemInput.length > 0) {
			addItems();
		}
	};

	return !authUser ? (
		<Loading />
	) : (
		<main className=''>
			<div
				type='button'
				className='bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer'>
				<GoSignOut size={18} onClick={signOut} />
				<span>Logout</span>
			</div>
			<div className='max-w-3xl mx-auto mt-5 p-8'>
				<div className='bg-white -m-6 p-3 sticky top-0'>
					<div className='flex justify-center flex-col items-center'>
						<a href='/' className='w-[150px] mb-5'>
							<Image src='/logo.png' alt='logo' />
						</a>
						<h1 className='text-3xl md:text-7xl font-black'>TASK MASTER</h1>
					</div>
					<div className='flex items-center gap-1 mt-5'>
						<input
							placeholder={`👋 Hello ${authUser.username}, What to do Today?`}
							type='text'
							className='font-semibold placeholder:text-gray-400 border-[2px] border-black h-[50px] grow shadow-sm rounded px-4 focus-visible:outline-yellow-400 text-sm transition-all duration-300'
							autoFocus
							value={itemInput}
							onChange={(e) => setItemInput(e.target.value)}
							onKeyUp={onKeyUp}
						/>
						<button
							onClick={addItems}
							className='w-[60px] h-[50px] rounded bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]'>
							<AiOutlinePlus size={30} color='#fff' />
						</button>
					</div>
				</div>
				<div className='my-10'>
					{items.length > 0 &&
						items.map((item) => (
							<div
								key={item.id}
								className='flex items-center justify-between mt-4'>
								<div className='flex items-center gap-3'>
									<input
										id={`todo-${item.id}`}
										type='checkbox'
										className='w-4 h-4 accent-orange-400 rounded-full text-white'
										checked={item.completed}
										onChange={(e) => CheckedItemHandler(e, item.id)}
									/>
									<label
										htmlFor={`todo-${item.id}`}
										className={`font-sm font-medium ${
											item.completed ? 'line-through ' : 'font-semibold'
										}`}>
										{item.item}
									</label>
								</div>

								<div className='flex items-center gap-3'>
									<MdDeleteForever
										onClick={() => deleteItem(item.id)}
										size={24}
										className='text-red-400 hover:text-red-600 cursor-pointer'
									/>
								</div>
							</div>
						))}
				</div>
			</div>
		</main>
	);
}
