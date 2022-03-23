import { Alert, Container } from 'reactstrap';
import Loading from '../Loading';
import useAuth from '../../contexts/AuthenticationContext';
import React from 'react';

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
					<div></div>
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
