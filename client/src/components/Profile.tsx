import { Button, Container } from 'reactstrap';
import BackButton from './BackButton';
import useAuth from '../contexts/AuthenticationContext';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import { UserData } from '../types/types';
import Loading from './Loading';
import { GetUserDataRes } from '../types/api';
import { numberWithCommas } from '../utils/Misc';
import ProfileBox from './ProfileBox';

export default function Profile() {
	const auth = useAuth();
	const params = useParams();
	const navigate = useNavigate();
	const [userData, setUserData] = React.useState<UserData | null>(null);

	const userId = () =>
		params.userId != undefined ? params.userId : auth.user.userData._id;

	const ownProfile = userId() == auth.user.userData._id;

	const getUserData = () => {
		console.log(userId());
		auth.authenticatedGet(`/user?id=${userId()}`)
			.then((res: any) => {
				setUserData(res.data.user);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	React.useEffect(() => {
		if (userData != null || auth.user.userData._id == -1) return;
		getUserData();
	}, [userData, auth]);

	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>
					👤{' '}
					{userData != null ? userData.profile!.displayName : '...'}'s
					Profile
				</h1>

				{userData != null ? (
					<>
						<ProfileBox
							avatar={userData.profile?.avatar!}
							displayName={userData.profile?.displayName!}
							netWorth={userData.game?.stats?.netWorth!}
							turnIncome={userData.game?.stats?.turnIncome!}
						/>
						<br />
						<p className='no-padding'>cards owned:</p>
						<h2 className='no-padding huge-and-bold'>
							{userData.game!.inventory!.cardInstances.length}
						</h2>
						<p className='no-padding'>total cash value:</p>
						<h2 className='no-padding huge-and-bold'>
							${numberWithCommas(userData.game!.stats!.cash)}M
						</h2>
						{ownProfile ? (
							<>
								<Button
									className='mt-3 mx-3'
									outline
									onClick={() =>
										navigate('/edit-profile', {
											replace: true,
										})
									}>
									Edit Profile
								</Button>
								<Button
									className='mt-3'
									color='danger'
									outline
									onClick={auth.logout}>
									Logout
								</Button>
							</>
						) : null}
					</>
				) : (
					<Loading />
				)}
			</Container>
		</div>
	);
}
