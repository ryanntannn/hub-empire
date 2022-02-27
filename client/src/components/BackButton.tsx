import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

export default function BackButton() {
	const navigate = useNavigate();

	return (
		<Button className='back-button' outline onClick={() => navigate('/')}>
			<BiArrowBack /> Back
		</Button>
	);
}
