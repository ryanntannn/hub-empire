import { Link } from 'react-router-dom';
import { Button, Col, Container, Row, Spinner } from 'reactstrap';
import NavButton from './NavButton';
import AuthenticationContext from '../contexts/AuthenticationContext';
import React, { useEffect } from 'react';
import useAuth from '../contexts/AuthenticationContext';
import { useNavigate } from 'react-router-dom';
import { GetHomeDataRes } from '../types/api';
import { autheticatedGet } from '../utils/AxiosBase';
import Loading from './Loading';

function Home() {
	let navigate = useNavigate();
	const auth = useAuth();

	const [homeData, setHomeData] = React.useState<GetHomeDataRes | null>(null);

	React.useState(() => {
		if (homeData != null) return;
		autheticatedGet('/home')
			.then((res: any) => {
				setHomeData(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	// React.useEffect(() => {
	// 	if (auth?.user.accessToken == '') {
	// 		navigate('/login');
	// 	}
	// });

	return (
		<div className='home page'>
			{homeData != null || false ? (
				<Container className='mt-5'>
					<h1 className='title'>🏠 Hub Empire</h1>
					<Row className='mb-3'>
						<Col>
							<div className='rounded-box shadow'>
								<h2 className='no-padding huge-and-bold'>
									{homeData.myData.displayName}
								</h2>
								<p className='no-padding'>net-worth:</p>
								<h2 className='no-padding huge-and-bold'>
									${homeData.myData.netWorth}
								</h2>
								<p className='no-padding'>earnings per day:</p>
								<h2
									className='no-padding big-and-bold'
									style={{ color: 'green' }}>
									${homeData.myData.netEarnings}
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
