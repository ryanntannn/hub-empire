import { Alert, Col, Container, Row } from 'reactstrap';
import Loading from '../Loading';
import useAuth from '../../contexts/AuthenticationContext';
import React from 'react';
import NavButton from '../NavButton';

export default function AdminHome() {
	const auth = useAuth();
	const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

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
			<Container className='mt-5'>
				<h1 className='title'>📔 Admin Page</h1>
				{isAdmin ? (
					<div>
						<Row className='mb-3 gx-3'>
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
									title='Enter Test Results'
									emoji='🖊️'
									linkTo='/admin/test-results'
									color='#FFD93D'
								/>
							</Col>
						</Row>
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
									title='Log Out'
									emoji='🚪'
									linkTo='/login'
									color='#FF6B6B'
									onClick={auth.logout}
								/>
							</Col>
						</Row>
					</div>
				) : isAdmin == null ? (
					<Loading />
				) : (
					<Alert className='mt-3' color='danger' dismissible>
						Not Admin User
					</Alert>
				)}
			</Container>
		</div>
	);
}
