import React from 'react';
import { Alert, Container, Input } from 'reactstrap';
import useAuth from '../../contexts/AuthenticationContext';
import BackButton from '../BackButton';

export default function NewGame() {
	const auth = useAuth();
	const [username, setUsername] = React.useState<string>('');
	const [gameId, setGameId] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const [errorMessage, setErrorMessage] = React.useState<string>('');
	const [successMessage, setSuccessMessage] = React.useState<string>('');

	function onSubmit() {
		auth.authenticatedPost(`admin/new-game`, {
			username,
			gameId,
			password,
		})
			.then((res: any) => {
				console.log('Account Added');
				console.log(res.data);
				if (res.data.accessToken == undefined)
					setErrorMessage('An error has occured');
				else setSuccessMessage('Game has been created');
			})
			.catch((err) => setErrorMessage(err.toString()));
	}

	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>New Game</h1>
				<b>Game Id</b>
				<Input
					type='number'
					value={gameId}
					onChange={(x) => setGameId(x.target.value)}
				/>
				<br />
				<b>Username</b>
				<Input
					value={username}
					onChange={(x) => setUsername(x.target.value)}
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
				{successMessage != '' ? (
					<Alert className='mt-3' color='success' dismissible>
						{successMessage}
					</Alert>
				) : null}
			</Container>
		</div>
	);
}
