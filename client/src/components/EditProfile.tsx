import useAuth from '../contexts/AuthenticationContext';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import { UserData } from '../types/types';
import Loading from './Loading';
import { Alert, Button, Container, Form, Input, Label } from 'reactstrap';
import BackButton from './BackButton';
import { Avatar } from './ProfileBox';

export default function EditProfile() {
	const AVATAR_COUNT = 15;
	const auth = useAuth();
	const params = useParams();
	const navigate = useNavigate();
	const [userData, setUserData] = React.useState<UserData | null>(null);
	const [displayName, setDisplayName] = React.useState<string>();
	const [avatar, setAvatar] = React.useState<number>();
	const [errorMessage, setErrorMessage] = React.useState<string>('');

	const userId = auth.user.userData._id;

	const getUserData = () => {
		auth.authenticatedGet(`/user?id=${userId}`)
			.then((res: any) => {
				setUserData(res.data.user);
				setDisplayName(
					(res.data.user as UserData).profile?.displayName
				);
				setAvatar((res.data.user as UserData).profile?.avatar);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	React.useEffect(() => {
		if (userData != null || auth.user.userData._id == -1) return;
		getUserData();
	}, [userData, auth]);

	function onSubmit() {
		auth.authenticatedPost('/edit-profile', {
			displayName,
			avatar,
		})
			.then(() => {
				navigate('/profile', { replace: true });
			})
			.catch((err) => {
				setErrorMessage(err.response.data);
			});
	}

	function previousAvatar() {
		setAvatar((x) => {
			if (x! <= 0) return AVATAR_COUNT - 1;
			return --x!;
		});
	}

	function nextAvatar() {
		setAvatar((x) => {
			if (x! >= AVATAR_COUNT - 1) return 0;
			return ++x!;
		});
	}

	return (
		<div className='page'>
			{userData != null ? (
				<Container className='mt-5'>
					<BackButton />
					<h1 className='title'>🖊️ Editing Profile</h1>
					<b>Display name</b>
					<Input
						value={displayName}
						onChange={(x) => setDisplayName(x.target.value)}
					/>
					<b> Avatar </b>
					<div
						className='rounded-box shadow mb-3'
						style={{ textAlign: 'center', width: 'min-content' }}>
						<Avatar avatar={avatar!} />
					</div>
					<Button onClick={previousAvatar}>Previous</Button>
					<Button className='mx-1' onClick={nextAvatar}>
						Next
					</Button>
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
			) : (
				<Loading />
			)}
		</div>
	);
}
