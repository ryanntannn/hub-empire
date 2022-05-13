import React from 'react';
import { BiLogOut } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Container, Row } from 'reactstrap';
import useAuth from '../../contexts/AuthenticationContext';
import Loading from '../Loading';
import NavButton from '../NavButton';

export default function AdminHome() {
	const auth = useAuth();
	const navigate = useNavigate();
	const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
	const [isAdvancedUser, setIsAdvancedUser] = React.useState<boolean>(false);

	const getAdminHomeData = () => {
		auth.authenticatedGet(`/admin`)
			.then((res: any) => {
				setIsAdmin(true);
			})
			.catch((err) => {
				setIsAdmin(false);
			});
	};

	React.useEffect(() => {
		if (isAdmin != null) return;
		getAdminHomeData();
	});

	return (
		<div className='page'>
			<Button
				className='back-button'
				outline
				onClick={() => auth.logout()}>
				<BiLogOut /> Logout
			</Button>
			<Container className='mt-5'>
				<h1 className='title'>📔 Admin Page</h1>
				{isAdmin ? (
					<div>
						<Row className='mb-3 gx-3'>
							<Col>
								<NavButton
									title='Enter Test Results'
									emoji='🖊️'
									linkTo='/admin/test-results'
									color='#6BCB77'
								/>
							</Col>
							<Col>
								<NavButton
									title='Admin Leaderboard'
									emoji='🎮'
									linkTo='/admin/leaderboard'
									color='#a070a0'
								/>
							</Col>
						</Row>
						<Row className='mb-3 gx-3'>
							<Col>
								<NavButton
									title='Account Editor'
									emoji='🧑‍🤝‍🧑'
									linkTo='/admin/account-editor'
									color='#FFD93D'
								/>
							</Col>
							<Col>
								<NavButton
									title='Register User'
									emoji='👨‍🎓'
									linkTo='/admin/register-user'
									color='#4D96FF'
								/>
							</Col>
						</Row>
						{isAdvancedUser ? (
							<Row className='mb-3 gx-3'>
								<Col>
									<NavButton
										title='Edit Cards'
										emoji='⚙️'
										linkTo='/admin/edit-cards'
										color='#6BCB77'
									/>
								</Col>

								<Col>
									<NavButton
										title='Edit Scoring Metrics'
										emoji='⚙️'
										linkTo='/admin/metrics'
										color='#4D96FF'
									/>
								</Col>

								<Col>
									<NavButton
										title='New Game'
										emoji='🎮'
										linkTo='/admin/new-game'
										color='#a070a0'
									/>
								</Col>
							</Row>
						) : null}
						<Row>
							<Col>
								<Button
									outline
									size='sm'
									color='danger'
									onClick={() =>
										setIsAdvancedUser(
											(prevState) => !prevState
										)
									}>
									{isAdvancedUser ? 'Hide' : 'Show'} Advanced
									Settings
								</Button>
							</Col>
						</Row>
					</div>
				) : isAdmin == null ? (
					<Loading />
				) : (
					<Alert className='mt-3' color='danger' dismissible>
						Not Admin User{' '}
						<Button color='danger' onClick={auth.logout}>
							Logout
						</Button>{' '}
						<Button color='primary' onClick={() => navigate('/')}>
							Home
						</Button>
					</Alert>
				)}
			</Container>
		</div>
	);
}
