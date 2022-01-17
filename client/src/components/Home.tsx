import { Link } from 'react-router-dom';
import { Button, Col, Container, Row } from 'reactstrap';
import NavButton from './NavButton';

function Home() {
	return (
		<div className='home page'>
			<h1 className='title'>XYZ Inc</h1>
			<Container className='mt-3'>
				<Row className='mb-3'>
					<Col>
						<div className='rounded-box shadow'>
							<p className='no-padding'>net-worth:</p>
							<h2 className='no-padding huge-and-bold'>
								$900,000
							</h2>
							<p className='no-padding'>earnings per day:</p>
							<h2
								className='no-padding big-and-bold'
								style={{ color: 'green' }}>
								$900,000
							</h2>
						</div>
					</Col>
				</Row>
				<Row className='mb-3'>
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
				<Row className='mb-3'>
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
		</div>
	);
}

export default Home;
