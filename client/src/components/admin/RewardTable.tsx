import React from 'react';
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Input,
	Table,
} from 'reactstrap';
import { RewardData } from '../../types/admin';
import { CardRarity } from '../../types/types';
import { enumToArray, enumToDropdownSelection } from '../../utils/Misc';
import { DropdownSelection } from '../DropdownSelection';

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

interface RewardTableEditableProps extends RewardTableProps {
	setData: (data: RewardData[]) => void;
}

export function RewardTableEditable(props: RewardTableEditableProps) {
	return (
		<Table>
			<thead>
				<tr>
					<th>Rarity</th>
					<th>Amount</th>
				</tr>
			</thead>
			<tbody>
				{console.log(props.rewardData)}
				{props.rewardData.map((reward, i) => (
					<tr key={i}>
						<td>
							<DropdownSelection
								items={enumToDropdownSelection(CardRarity)}
								default={CardRarity[reward.rarity]}
								setSelected={(data) => {
									const newData = [...props.rewardData];
									newData[i].rarity = data;
									props.setData(newData);
								}}
							/>
						</td>
						<td>
							<Input
								type='number'
								value={reward.amount}
								onChange={(x) => {
									const newData = [...props.rewardData];
									newData[i].amount = parseInt(
										x.target.value
									);
									props.setData(newData);
								}}
							/>
						</td>
						<td>
							<Button
								color='danger'
								size='sm'
								onClick={() => {
									const newData = [...props.rewardData];
									newData.splice(i, 1);
									props.setData(newData);
								}}>
								-
							</Button>
						</td>
					</tr>
				))}
				<tr>
					<td>
						<Button
							color='success'
							size='sm'
							onClick={() => {
								const newData = [...props.rewardData];
								newData.push({
									rarity: CardRarity.COMMON,
									amount: 1,
								});
								props.setData(newData);
							}}>
							+
						</Button>
					</td>
				</tr>
			</tbody>
		</Table>
	);
}
