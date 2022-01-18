import React from 'react';
import cookies from '../utils/Cookies';

const defaultUserState = {
	userData: {},
	accessToken: '',
};

interface LocalUserData {
	userData: any;
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
