import { InstanceProps } from 'react-modal-promise';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface ConfirmModalProps extends InstanceProps<null, null> {
	header?: any;
	body: any;
}

export function ConfirmModal(props: ConfirmModalProps) {
	return (
		<Modal isOpen={props.isOpen}>
			<ModalHeader toggle={() => props.onReject()}>
				{props.header == undefined ? 'Confirm Action' : props.header}
			</ModalHeader>
			<ModalBody>{props.body}</ModalBody>
			<ModalFooter>
				<Button color='success' onClick={() => props.onResolve()}>
					Confirm
				</Button>
				<Button color='danger' onClick={() => props.onReject()}>
					Cancel
				</Button>
			</ModalFooter>
		</Modal>
	);
}
