import { Col, Container, Row } from 'reactstrap';
import BackButton from './BackButton';
import NavButton from './NavButton';

export default function Trade() {
	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>🤝‍ Trade</h1>
				<Row className='mb-3 gx-3'>
					<Col>
						<NavButton
							title='Trade Inbox'
							emoji='‍🤝‍'
							linkTo='/trade/inbox'
							color='#28A745'
						/>
					</Col>

					<Col>
						<NavButton
							title='History'
							emoji='🤝‍'
							linkTo='/trade/history'
							color='#cc3e25'
						/>
					</Col>
				</Row>
				<Row className='mb-3 gx-3'>
					<Col>
						<NavButton
							title='New Trade Offer'
							emoji='‍+'
							linkTo='/trade/new'
							color='#007BFF'
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
