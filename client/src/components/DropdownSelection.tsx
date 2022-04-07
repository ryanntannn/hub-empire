import React from 'react';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from 'reactstrap';

interface DropdownSelectionProps {
	items: { id: string; data: any }[];
	setActive: React.Dispatch<React.SetStateAction<any>>;
}

export function DropdownSelection(props: DropdownSelectionProps) {
	const [activeKey, setActiveKey] = React.useState<string | null>(
		props.items[0].id
	);
	const [isOpen, setIsOpen] = React.useState<boolean>(false);

	return (
		<Dropdown
			color='primary'
			isOpen={isOpen}
			toggle={() => setIsOpen((prev) => !prev)}>
			<DropdownToggle caret>{activeKey}</DropdownToggle>
			<DropdownMenu>
				{props.items.map((item, i) => {
					return (
						<DropdownItem
							key={i}
							onClick={() => {
								setActiveKey(item.id);
								props.setActive(item.data);
							}}>
							{item.id}
						</DropdownItem>
					);
				})}
			</DropdownMenu>
		</Dropdown>
	);
}
