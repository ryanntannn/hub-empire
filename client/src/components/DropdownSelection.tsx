import React from 'react';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from 'reactstrap';

interface DropdownSelectionProps {
	items: { id: string; data: any }[];
	setSelected: (data: any) => void;
	setIndex?: (index: number) => void;
	default?: string;
}

export function DropdownSelection(props: DropdownSelectionProps) {
	const [activeKey, setActiveKey] = React.useState<string | null>(
		props.default != undefined ? props.default : props.items[0].id
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
								props.setSelected(item.data);
								props.setIndex?.call(null, i);
							}}>
							{item.id}
						</DropdownItem>
					);
				})}
			</DropdownMenu>
		</Dropdown>
	);
}
