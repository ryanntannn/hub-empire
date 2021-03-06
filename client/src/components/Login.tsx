import { config } from 'process';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	Alert,
	Button,
	Container,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap';
import useAuth from '../contexts/AuthenticationContext';
import AxiosBase from '../utils/AxiosBase';
import cookies from '../utils/Cookies';
import Loading from './Loading';

export default function Login() {
	const navigate = useNavigate();
	const auth = useAuth();
	const location = useLocation();

	const [hasTriedAutoLogin, setTryAutoLogin] = React.useState<boolean>(false);
	const [usernameInput, setUsernameInput] = React.useState<string>();
	const [passwordInput, setPasswordInput] = React.useState<string>();
	const [errorMessage, setErrorMessage] = React.useState<string>('');

	React.useState(() => {
		if (hasTriedAutoLogin) return;
		const token = cookies.get('dnjt');
		console.log(token);
		if (token == undefined) {
			setTryAutoLogin(true);
			return;
		}
		const config = {
			headers: { Authorization: `Bearer ${token}` },
		};
		AxiosBase.get('/auth', config)
			.then((res) => {
				if (res.data.userData.isAdmin) navigate('/admin');
				setTryAutoLogin(true);
				auth.login(res.data, true);
			})
			.catch((error) => {
				setTryAutoLogin(true);
				console.log(error);
				if (error.response) setErrorMessage(error.response.data);
			});
	});

	async function submitLogin(event: any) {
		event.preventDefault();
		try {
			AxiosBase.post('/login', {
				username: usernameInput,
				password: passwordInput,
			})
				.then(async (res) => {
					if (res.data.userData.isAdmin) navigate('/admin');
					await auth.login(res.data, true);
					setErrorMessage('');
					console.log(res);
				})
				.catch((error) => {
					if (error.response) setErrorMessage(error.response.data);
				});
		} catch {}
	}

	React.useEffect(() => {
		if (auth.user.userData._id != -1)
			navigate(location.pathname != '/login' ? location.pathname : '/', {
				replace: true,
			});
	}, [auth]);

	return (
		<div className='page'>
			<Container className='mt-5'>
				<h1 className='title'>Login</h1>
				{hasTriedAutoLogin ? (
					<Form onSubmit={submitLogin}>
						<FormGroup className='mb-2 me-sm-2 mb-sm-0'>
							<Label className='me-sm-2' for='username'>
								Username
							</Label>
							<Input
								id='username'
								name='username'
								placeholder='username'
								type='text'
								onChange={(e) =>
									setUsernameInput(e.target.value)
								}
							/>
						</FormGroup>
						<FormGroup className='mb-2 me-sm-2 mb-sm-0 mt-2'>
							<Label className='me-sm-2' for='password'>
								Password
							</Label>
							<Input
								id='password'
								name='password'
								placeholder='password'
								type='password'
								onChange={(e) =>
									setPasswordInput(e.target.value)
								}
							/>
						</FormGroup>
						<Button className='mt-3'>Submit</Button>
					</Form>
				) : (
					<Loading flavour='Loggin in...' />
				)}
				{errorMessage != '' ? (
					<Alert className='mt-3' color='danger' dismissible>
						{errorMessage}
					</Alert>
				) : null}
			</Container>
		</div>
	);
}
