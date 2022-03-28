import React from 'react';
import { UserData } from '../types/types';
import { AxiosBase } from '../utils/AxiosBase';
import cookies from '../utils/Cookies';

const defaultUserState: LocalUserData = {
	userData: {
		_id: -1,
	},
	accessToken: '',
};

interface LocalUserData {
	userData: UserData;
	accessToken: string;
}

interface UseAuth {
	authed: boolean;
	user: LocalUserData;
	login: (responseData: LocalUserData, saveCookie: boolean) => void;
	logout: () => void;
	authenticatedGet: <T>(url: string, params?: any) => Promise<T>;
	authenticatedPost: <T>(url: string, params?: any) => Promise<T>;
}

const AuthenticationContext = React.createContext<UseAuth>(null!);

const MAX_RETRIES = 5;

let token = '';

function useAuth() {
	const [authed, setAuthed] = React.useState(false);
	const [user, setUser] = React.useState(defaultUserState);
	const getTokenFromCookie = () => {
		const thisToken = cookies.get('dnjt');
		token = thisToken;
		return cookies.get('dnjt');
	};
	const getToken = () => (token != '' ? token : getTokenFromCookie());

	const login = async (responseData: LocalUserData, saveCookie: boolean) => {
		console.log(responseData);
		token = responseData.accessToken;
		setUser(responseData);
		setAuthed(true);
		if (saveCookie) {
			//TODO: SET HTTP ONLY(NEEDS HTTPS)
			await cookies.set('dnjt', responseData.accessToken, { path: '/' }); //definately not jwt token
		}
	};

	const configHeader = () => ({
		headers: { Authorization: `Bearer ${getToken()}` },
	});

	async function timeoutAsync(ms: number) {
		return new Promise((resolve) => setTimeout(() => resolve(''), ms));
	}

	const authenticatedGet: <T>(url: string, params?: any) => Promise<T> = (
		url: string,
		params?: any
	) => {
		const req: any = configHeader();
		if (params != null) req.params = params;
		return AxiosBase.get(url, req);
	};

	const authenticatedPost: <T>(url: string, params?: any) => Promise<T> = (
		url: string,
		params?: any
	) => {
		const req: any = configHeader();
		if (params != null) req.params = params;
		return AxiosBase.post(url, {}, req);
	};

	const logout = () => {
		setUser(defaultUserState);
		token = '';
		setAuthed(false);
		cookies.remove('dnjt');
	};

	return { authed, user, login, logout, authenticatedGet, authenticatedPost };
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
