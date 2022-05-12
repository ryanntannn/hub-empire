import React, { MutableRefObject, useRef } from 'react';
import {
	Button,
	Container,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from 'reactstrap';
import BackButton from '../BackButton';
import useAuth from '../../contexts/AuthenticationContext';
import { Card } from '../../types/types';
import Loading from '../Loading';
import { DropdownSelection } from '../DropdownSelection';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import { create, InstanceProps } from 'react-modal-promise';
import { ConfirmModal } from '../ConfirmModal';

interface ChangePasswordProps extends InstanceProps<null, null> {
	activeAccount: any;
}

function ChangePasswordModal(props: ChangePasswordProps) {
	const auth = useAuth();
	const [password, setPassword] = React.useState<string>();

	async function changePassword() {
		try {
			auth.authenticatedPost(`/admin/changepassword`, {
				data: { id: props.activeAccount._id, password },
			})
				.then((res: any) => {
					if (res.status == 200) props.onResolve();
				})
				.catch((err) => console.error(err));
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<Modal isOpen={props.isOpen}>
			<ModalHeader toggle={() => props.onReject()}>
				Change Password for {props.activeAccount.profile.displayName}
			</ModalHeader>
			<ModalBody>
				New Password:
				<Input
					type='password'
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}></Input>
			</ModalBody>
			<ModalFooter>
				<Button onClick={changePassword}>Submit</Button>
			</ModalFooter>
		</Modal>
	);
}

export default function AccountEditor() {
	const auth = useAuth();
	const [accounts, setAccounts] = React.useState<any[] | null>(null);
	const [activeAccount, setActiveAccount] = React.useState<any | null>(null);
	const changePasswordModal = create(ChangePasswordModal);
	const confirmActionModal = create(ConfirmModal);
	const getAccountData = () => {
		auth.authenticatedGet(`/admin/accountdata`)
			.then((res: any) => {
				const accountData = res.data;
				if (accountData.length <= 0)
					confirmActionModal({
						body: <div>No accounts in game!</div>,
					});
				setAccounts(accountData);
				setActiveAccount(accountData[0]);
				console.log(accountData);
			})
			.catch((err) => {});
	};

	function setAccount(accountData: any) {
		console.log(accountData);
		setActiveAccount(JSON.parse(JSON.stringify(accountData)));
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

	function removeAccount(accountData: any) {
		confirmActionModal({
			body: <div>Confirm delete {accountData.profile.displayName}?</div>,
		})
			.then(() => {
				return auth.authenticatedPost(`/admin/deleteaccount`, {
					data: { ...accountData },
				});
			})
			.then((res) => {
				console.log('Account Removed!');
				getAccountData();
			})
			.catch((err) => {});
	}

	async function changePassword(accountData: any) {
		try {
			changePasswordModal({ activeAccount: accountData });
		} catch (err) {}
	}

	React.useEffect(() => {
		if (accounts != null) return;
		getAccountData();
	}, [accounts]);

	return (
		<div className='page'>
			<Container className='mt-5'>
				<h1 className='title'>Account Editor</h1>
				<BackButton />
				{accounts != undefined && accounts.length > 0 ? (
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
				{activeAccount ? (
					<>
						Display Name:
						<Input
							value={activeAccount.profile.displayName}
							onChange={(e) => {
								setActiveAccount(({ ...prevState }) => {
									prevState.profile.displayName =
										e.target.value;
									return prevState;
								});
							}}
						/>
						User Name:
						<Input
							value={activeAccount.profile.username}
							onChange={(e) => {
								setActiveAccount(({ ...prevState }) => {
									prevState.profile.username = e.target.value;
									return prevState;
								});
							}}
						/>
						<br />
						<Button
							className='me-2'
							color='primary'
							onClick={() => changePassword(activeAccount)}>
							Change Password
						</Button>
						<Button
							className='me-2'
							color='danger'
							onClick={() => removeAccount(activeAccount)}>
							Remove Account
						</Button>
					</>
				) : null}
				<Button
					color='success'
					onClick={() => submitAccount(activeAccount)}>
					Submit
				</Button>
			</Container>
		</div>
	);
}
