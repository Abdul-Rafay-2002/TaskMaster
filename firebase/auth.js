import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as authSignOut } from 'firebase/auth';
import { auth } from './firebase';

const AuthUserContext = createContext({ authUser: null, isLoading: true });

export default function useFirebaseAuth() {
	const [authUser, setAuthUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const clearUserData = () => {
		setIsLoading(false);
		setAuthUser(null);
	};

	const authStateIsChanged = async (user) => {
		setIsLoading(true);
		if (!user) {
			clearUserData();
			return;
		}
		setAuthUser({
			uid: user.uid,
			email: user.email,
			username: user.displayName,
		});
		setIsLoading(false);
	};
	const signOut = () => {
		authSignOut(auth).then(() => clearUserData());
	};
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, authStateIsChanged);
		return () => {
			unsubscribe();
		};
	}, []);

	return {
		authUser,
		isLoading,
		signOut,
		setAuthUser,
	};
}

export const AuthUserProvider = ({ children }) => {
	const auth = useFirebaseAuth();
	return (
		<AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
	);
};

export const useAuth = () => useContext(AuthUserContext);
