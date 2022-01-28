import React from 'react';
import { UserDataBasic } from '../types/types';
import cookies from '../utils/Cookies';

const defaultUserState: LocalUserData = {
	userData: {
		id: -1,
		displayName: '',
		netWorth: 0,
		netEarnings: 0,
	},
	accessToken: '',
};

interface LocalUserData {
	userData: UserDataBasic;
	accessToken: string;
}

interface UseAuth {
	authed: boolean;
	user: LocalUserData;
	login: (responseData: LocalUserData, saveCookie: boolean) => void;
	logout: () => void;
}

const AuthenticationContext = React.createContext<UseAuth>(null!);

function useAuth() {
	const [authed, setAuthed] = React.useState(false);
	const [user, setUser] = React.useState(defaultUserState);

	const login = (responseData: LocalUserData, saveCookie: boolean) => {
		setUser(responseData);
		setAuthed(true);
		if (saveCookie) {
			//TODO: SET HTTP ONLY(NEEDS HTTPS)
			cookies.set('dnjt', responseData.accessToken, { path: '/' }); //definately not jwt token
		}
	};

	const logout = () => {
		setUser(defaultUserState);
		setAuthed(false);
		cookies.remove('dnjt');
	};

	return { authed, user, login, logout };
}

const AuthenticationProvider: React.FC = ({ children }) => {
	const auth: UseAuth = useAuth();

	return (
		<AuthenticationContext.Provider value={auth}>
			{children}
		</AuthenticationContext.Provider>
	);
};

export default function AuthConsumer() {
	return React.useContext(AuthenticationContext);
}

export { AuthenticationProvider };
