import axios, { AxiosInstance } from 'axios';
import cookies from './Cookies';

//const Endpoint = 'http://localhost:42069';
//const Endpoint = 'https://tonvo.net/';
const Endpoint: string =
	process.env.REACT_APP_ENDPOINT || 'http://localhost:42069';
const AxiosBase: AxiosInstance = axios.create({
	baseURL: Endpoint,
});
const token = cookies.get('dnjt');

const configHeader = {
	headers: { Authorization: `Bearer ${token}` },
};

export default AxiosBase;

export function autheticatedGet<T>(url: string): Promise<T> {
	return AxiosBase.get(url, configHeader);
}

export { AxiosBase, Endpoint };
