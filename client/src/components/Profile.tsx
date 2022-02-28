import { Button, Container } from 'reactstrap';
import BackButton from './BackButton';
import useAuth from '../contexts/AuthenticationContext';
import { useParams } from 'react-router-dom';
import React from 'react';
import { UserData } from '../types/types';
import Loading from './Loading';
import { GetUserDataRes } from '../types/api';
import { numberWithCommas } from '../utils/Misc';

export interface ProfileProps {
	name: string;
	netWorth: number;
	earnings: number;
	cash: number;
	assetValue: number;
	revenue: number;
	losses: number;
}

const testProfile: ProfileProps = {
	name: 'test',
	netWorth: 10900,
	earnings: 900,
	cash: 900,
	assetValue: 10000,
	revenue: 1000,
	losses: -100,
};

export default function Profile() {
	const data = testProfile;
	const auth = useAuth();
	const params = useParams();
	const [userData, setUserData] = React.useState<UserData | null>(null);

	const userId = () =>
		params.userId != undefined ? params.userId : auth.user.userData.id;

	const ownProfile = userId() == auth.user.userData.id;

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
		if (userData != null || auth.user.userData.id == -1) return;
		getUserData();
	}, [userData, auth]);

	return (
		<div className='page'>
			{userData != null ? (
				<Container className='mt-5'>
					<BackButton />
					<h1 className='title'>
						👤 {userData.displayName}'s Profile
					</h1>
					<div className='rounded-box shadow mt-3'>
						<h1 className='no-padding huge-and-bold'>
							{userData.displayName}
						</h1>
						<p className='no-padding'>net-worth:</p>
						<h2 className='no-padding huge-and-bold'>
							${userData.cash + userData.assetValue}M
						</h2>
						<p className='no-padding'>earnings this turn:</p>
						<h2
							style={{
								color:
									userData.netEarnings >= 0 ? 'green' : 'red',
							}}
							className='no-padding big-and-bold'>
							{userData.turnIncome >= 0 ? '+' : '-'}$
							{numberWithCommas(userData.turnIncome)}M
						</h2>
					</div>
					<br />
					<p className='no-padding'>cards owned:</p>
					<h2 className='no-padding huge-and-bold'>
						{userData.cardIds.length}
					</h2>
					<p className='no-padding'>total cash value:</p>
					<h2 className='no-padding huge-and-bold'>
						${userData.cash}M
					</h2>
					<p className='no-padding'>total asset value:</p>
					<h2 className='no-padding huge-and-bold'>
						${userData.assetValue}M
					</h2>
					{ownProfile ? (
						<>
							<Button
								className='mt-3'
								color='danger'
								outline
								onClick={auth.logout}>
								Logout
							</Button>
						</>
					) : null}
				</Container>
			) : (
				<Loading />
			)}
		</div>
	);
}
