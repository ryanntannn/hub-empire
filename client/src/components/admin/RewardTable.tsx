import React from 'react';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Table,
} from 'reactstrap';
import { RewardData } from '../../types/admin';
import { CardRarity } from '../../types/types';

interface RewardTableProps {
	rewardData: RewardData[];
}

export function RewardTable(props: RewardTableProps) {
	return (
		<Table>
			<thead>
				<tr>
					<th>Rarity</th>
					<th>Amount</th>
				</tr>
			</thead>
			<tbody>
				{props.rewardData.map((reward, i) => (
					<tr key={i}>
						<td>{CardRarity[reward.rarity as CardRarity]}</td>
						<td>{reward.amount}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
