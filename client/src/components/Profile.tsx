import { Button, Container } from 'reactstrap';
import BackButton from './BackButton';
import useAuth from '../contexts/AuthenticationContext';

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
	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>
					👤 {auth.user.userData.name}'s Profile
				</h1>
				<div className='rounded-box shadow mt-3'>
					<h1 className='no-padding huge-and-bold'>
						{auth.user.userData.name}
					</h1>
					<p className='no-padding'>net-worth:</p>
					<h2 className='no-padding huge-and-bold'>
						${data.netWorth}
					</h2>
					<p className='no-padding'>earnings per day:</p>
					<h2
						style={{ color: data.earnings >= 0 ? 'green' : 'red' }}
						className='huge-and-bold no-padding'>
						{data.earnings >= 0 ? '+' : '-'}${data.earnings}
					</h2>
				</div>
				<br />
				<p className='no-padding'>total cash value:</p>
				<h2 className='no-padding huge-and-bold'>${data.cash}</h2>
				<p className='no-padding'>total asset value:</p>
				<h2 className='no-padding huge-and-bold'>${data.assetValue}</h2>
				<p className='no-padding'>revenue:</p>
				<h2
					style={{ color: data.revenue >= 0 ? 'green' : 'red' }}
					className='huge-and-bold no-padding'>
					{data.revenue >= 0 ? '+' : '-'}${data.revenue}
				</h2>
				<p className='no-padding'>expenses:</p>
				<h2
					style={{ color: data.losses >= 0 ? 'green' : 'red' }}
					className='huge-and-bold no-padding'>
					{data.losses >= 0 ? '+' : '-'}${Math.abs(data.losses)}
				</h2>
				<Button
					className='mt-3'
					color='danger'
					outline
					onClick={auth.logout}>
					Logout
				</Button>
			</Container>
		</div>
	);
}
