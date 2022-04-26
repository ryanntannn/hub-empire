import React from 'react';
import { Alert, Container, Input } from 'reactstrap';
import useAuth from '../../contexts/AuthenticationContext';
import BackButton from '../BackButton';

export default function RegisterUser() {
	const auth = useAuth();
	const [username, setUsername] = React.useState<string>('');
	const [displayName, setDisplayName] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const [errorMessage, setErrorMessage] = React.useState<string>('');

	function onSubmit() {
		auth.authenticatedPost(`/register`, {
			data: { username, displayName, password },
		})
			.then((res: any) => {
				console.log('Account Added');
				setErrorMessage(res.data);
			})
			.catch((err) => setErrorMessage(err));
	}

	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>New User</h1>
				<b>Username</b>
				<Input
					value={username}
					onChange={(x) => setUsername(x.target.value)}
				/>
				<br />
				<b>Display name</b>
				<Input
					value={displayName}
					onChange={(x) => setDisplayName(x.target.value)}
				/>
				<br />
				<b>Password</b>
				<Input
					type='password'
					value={password}
					onChange={(x) => setPassword(x.target.value)}
				/>
				<Input
					className='mt-3'
					type='submit'
					onClick={onSubmit}></Input>

				{errorMessage != '' ? (
					<Alert className='mt-3' color='danger' dismissible>
						{errorMessage}
					</Alert>
				) : null}
			</Container>
		</div>
	);
}
