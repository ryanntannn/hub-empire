import { Link } from 'react-router-dom';
import { Button, Col, Container, Row, Spinner } from 'reactstrap';
import NavButton from './NavButton';
import AuthenticationContext from '../contexts/AuthenticationContext';
import React, { useEffect } from 'react';
import useAuth from '../contexts/AuthenticationContext';
import { useNavigate } from 'react-router-dom';
import { GetHomeDataRes } from '../types/api';
import Loading from './Loading';
import { numberWithCommas } from '../utils/Misc';
import ProfileBox from './ProfileBox';

function Home() {
	let navigate = useNavigate();
	const auth = useAuth();

	const [homeData, setHomeData] = React.useState<GetHomeDataRes | null>(null);

	const getHomeData = () => {
		auth.authenticatedGet('/home')
			.then((res: any) => {
				console.log(res.data);
				setHomeData(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	React.useEffect(() => {
		if (homeData != null) return;
		getHomeData();
	});

	// React.useEffect(() => {
	// 	if (auth?.user.accessToken == '') {
	// 		navigate('/login');
	// 	}
	// });

	return (
		<div className='home page'>
			<Container className='mt-5'>
				<h1 className='title'>🏠 Hub Empire</h1>
				<Row className='mb-3'>
					<Col>
						{homeData != null ? (
							<ProfileBox
								avatar={homeData.myData.profile?.avatar!}
								displayName={
									homeData.myData.profile?.displayName!
								}
								netWorth={
									homeData.myData.game?.stats?.netWorth!
								}
								turnIncome={
									homeData.myData.game?.stats?.turnIncome!
								}
							/>
						) : (
							<div className='rounded-box shadow'>
								<Loading />
							</div>
						)}
					</Col>
				</Row>

				<Row className='mb-3 gx-3'>
					<Col>
						<NavButton
							title='My Cards'
							emoji='🏢'
							linkTo='/my-cards'
							color='#6F42C1'
						/>
					</Col>

					<Col>
						<NavButton
							title='My Profile'
							emoji='👤'
							linkTo='/profile'
							color='#007BFF'
						/>
					</Col>
				</Row>
				<Row className='mb-3 gx-3'>
					<Col>
						<NavButton
							title='Leaderboard'
							emoji='🏆'
							linkTo='/leaderboard'
							color='#28A745'
						/>
					</Col>

					<Col>
						<NavButton
							title='History'
							emoji='📓'
							linkTo='/history'
							color='#dd5050'
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default Home;
