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
			{homeData != null ? (
				<Container className='mt-5'>
					<h1 className='title'>🏠 Hub Empire</h1>
					<Row className='mb-3'>
						<Col>
							<div className='rounded-box shadow'>
								<h2 className='no-padding huge-and-bold'>
									{homeData.myData.profile?.displayName}
								</h2>
								<p className='no-padding'>net-worth:</p>
								<h2 className='no-padding huge-and-bold'>
									$
									{numberWithCommas(
										homeData.myData.game!.stats!.netWorth
									)}
									M
								</h2>
								<p className='no-padding'>
									earnings this turn:
								</p>
								<h2
									className='no-padding big-and-bold'
									style={{
										color:
											homeData.myData.game!.stats!
												.turnIncome >= 0
												? 'green'
												: 'red',
									}}>
									{homeData.myData.game!.stats!.turnIncome >=
									0
										? '+'
										: '-'}
									$
									{numberWithCommas(
										Math.abs(
											homeData.myData.game!.stats!
												.turnIncome
										)
									)}
									M
								</h2>
							</div>
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
								title='Trade'
								emoji='🤝‍'
								linkTo='/trade'
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
					<Row className='mb-3 gx-3'>
						<Col>
							<NavButton
								title='My Profile'
								emoji='👤'
								linkTo='/profile'
								color='#EBB30B'
							/>
						</Col>
					</Row>
				</Container>
			) : (
				<Loading />
			)}
		</div>
	);
}

export default Home;
