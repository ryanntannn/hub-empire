import React, { MutableRefObject, useRef } from 'react';
import { Button, Container } from 'reactstrap';
import BackButton from '../BackButton';
import useAuth from '../../contexts/AuthenticationContext';
import { Card } from '../../types/types';
import Loading from '../Loading';
import { DropdownSelection } from '../DropdownSelection';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';

export default function AccountEditor() {
	const auth = useAuth();
	const [accounts, setAccounts] = React.useState<any[] | null>(null);
	const [activeAccount, setActiveAccount] = React.useState<any | null>(null);
	let [editor, setEditor] = React.useState<JSONEditor | null>(null);

	const getAccountData = () => {
		auth.authenticatedGet(`/admin/accountdata`)
			.then((res: any) => {
				const accountData = res.data;
				setAccounts(accountData);
				setActiveAccount(accountData[0]);
				console.log(accountData);
			})
			.catch((err) => {});
	};

	const initJsonEditor = () => {
		setEditor(new JSONEditor(document.getElementById('jsoneditor')!, {}));
	};

	function setJson(newJson: any) {
		editor!.set(newJson);
	}

	function setAccount(accountData: any) {
		console.log(accountData);
		setActiveAccount(accountData);
		setJson(accountData);
	}

	function submitAccount(accountData: any) {
		console.log(accountData);
		auth.authenticatedPost(`/admin/updateaccount`, {
			data: { ...accountData },
		})
			.then((res) => {
				console.log('Account Updated!');
				getAccountData();
			})
			.catch((err) => console.error(err));
	}

	React.useEffect(() => {
		if (accounts != null) return;
		getAccountData();
		initJsonEditor();
	}, [accounts]);

	return (
		<div className='page'>
			<Container className='mt-5'>
				<h1 className='title'>Card Editor</h1>
				<BackButton />
				{accounts != undefined ? (
					<>
						<DropdownSelection
							items={accounts.map((account) => ({
								id: account.profile.displayName,
								data: account,
							}))}
							setSelected={setAccount}
						/>
					</>
				) : (
					<Loading />
				)}
				<div
					className='my-2'
					id='jsoneditor'
					style={{ width: '100%', height: 700 }}></div>

				<Button
					color='success'
					onClick={() => submitAccount(editor!.get())}>
					Submit
				</Button>
			</Container>
		</div>
	);
}
