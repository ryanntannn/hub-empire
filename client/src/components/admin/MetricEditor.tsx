import React from 'react';
import {
	Button,
	Card,
	Container,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Input,
	Table,
} from 'reactstrap';
import BackButton from '../BackButton';
import useAuth from '../../contexts/AuthenticationContext';
import { Metric, RewardTemplate } from '../../types/admin';
import Loading from '../Loading';
import { CardRarity } from '../../types/types';

export default function MetricEditor() {
	const auth = useAuth();
	const [metrics, setMetrics] = React.useState<Metric[] | null>(null);
	const [activeMetric, setActiveMetric] = React.useState<Metric | null>(null);
	const [scoreKeyInput, setScoreKeyInput] = React.useState<number>(0);
	const [scoreRewardsInput, setScoreRewardsInput] = React.useState<{
		rarity: CardRarity;
		amount: number;
	}>({ rarity: CardRarity.COMMON, amount: 1 });
	const [dropDownToggle, setDropDownToggle] = React.useState<boolean>(false);

	const getMetricData = () => {
		auth.authenticatedGet(`/admin/metrics`)
			.then((res: any) => {
				const metrics = res.data;
				const copy = [...res.data] as any;
				// metric.scoreBasedRewards = new Map(
				// 	Object.entries(res.data.positionBasedRewards)
				// );
				copy.map((metric: any) => {
					metric.positionBasedRewards = new Map(
						Object.entries(metric.positionBasedRewards)
					);
				});
				copy.map((metric: any) => {
					metric.scoreBasedRewards = new Map(
						Object.entries(metric.scoreBasedRewards)
					);

					console.log(metric.scoreBasedRewards);
					metric.scoreBasedRewards.forEach((value: any, key: any) => {
						console.log(value);
						metric.scoreBasedRewards.set(
							key,
							new Map(Object.entries(value))
						);
					});
				});
				console.log(copy);
				console.log('test');
				setMetrics(copy);
			})
			.catch((err) => {});
	};

	React.useEffect(() => {
		if (metrics != null) return;
		getMetricData();
	});

	return (
		<div className='page'>
			<Container className='mt-5'>
				<h1 className='title'>Metrics</h1>
				<BackButton />
				<Table>
					<thead>
						<tr>
							<th>#</th>
							<th>Id</th>
							<th>Name</th>
							<th>Actions</th>
						</tr>
					</thead>
					{metrics != null ? (
						<tbody>
							{metrics.map((metric, i) => {
								return (
									<tr key={i}>
										<th scope='row'>{i}</th>
										<td>{metric.id}</td>
										<td>{metric.displayName}</td>
										<td>
											<Button
												size='sm'
												color='primary'
												className='me-1'
												onClick={() =>
													setActiveMetric({
														...metric,
													})
												}>
												Edit
											</Button>
											<Button size='sm' color='danger'>
												Delete
											</Button>
										</td>
									</tr>
								);
							})}
							<tr key={-1}>
								<th>
									<Button size='sm' color='success'>
										+ Add New Metric
									</Button>
								</th>
							</tr>
						</tbody>
					) : null}
				</Table>
				{/* {activeMetric != null ? (
					<>
						<b>Editing "{activeMetric.displayName}" Metric : </b>
						<br />
						<b>id</b>
						<Input
							value={activeMetric.id}
							onChange={(x) =>
								setActiveMetric(({ ...prevState }) => {
									prevState!.id = x.target.value;
									return prevState;
								})
							}
						/>
						<b>Display name</b>
						<Input
							value={activeMetric.displayName}
							onChange={(x) =>
								setActiveMetric(({ ...prevState }) => {
									prevState!.displayName = x.target.value;
									return prevState;
								})
							}
						/>
						<b>Max score</b>
						<Input
							value={activeMetric.maxScore}
							onChange={(x) =>
								setActiveMetric(({ ...prevState }) => {
									const intvalue = parseInt(x.target.value);
									prevState!.maxScore = isNaN(intvalue)
										? 0
										: intvalue;
									return prevState;
								})
							}
						/>
						<b>Positon Based Rewards</b>
						<Table>
							<thead>
								<tr>
									<th>position</th>
									<th>rewards</th>
								</tr>
							</thead>
							{Array.from(
								activeMetric.positionBasedRewards as Map<
									any,
									any
								>
							).map(([key, value], i) => {
								return (
									<tr key={i}>
										<td>{key}</td>
									</tr>
								);
								// Array.from(rtemplate!.keys()).map((rarity, j) => {}
							})}
						</Table>

						<b>Score Based Rewards</b>
						<Table>
							<thead>
								<tr>
									<th>score</th>
									<th>rewards</th>
								</tr>
							</thead>
							<tbody>
								{Array.from(
									activeMetric.scoreBasedRewards as Map<
										any,
										any
									>
								).map(([key, value], i) => {
									return (
										<tr key={i}>
											<td>{key}</td>
											<td>
												<Table>
													<thead>
														<tr>
															<th>rarity</th>
															<th>amount</th>
														</tr>
													</thead>
													<tbody>
														{Array.from(
															value as Map<
																any,
																any
															>
														).map(
															(
																[key2, value2],
																i
															) => {
																return (
																	<tr key={i}>
																		<td>
																			{
																				CardRarity[
																					key2 as CardRarity
																				]
																			}
																		</td>
																		<td>
																			{
																				value2
																			}
																		</td>
																		<td>
																			<Button
																				color='danger'
																				onClick={() => {
																					setActiveMetric(
																						({
																							...prevState
																						}) => {
																							prevState.scoreBasedRewards
																								.get(
																									key
																								)
																								?.delete(
																									key2
																								);
																							return prevState;
																						}
																					);
																				}}>
																				-
																			</Button>
																		</td>
																	</tr>
																);
																// Array.from(rtemplate!.keys()).map((rarity, j) => {}
															}
														)}
														<tr>
															<td>
																<Dropdown
																	isOpen={
																		dropDownToggle
																	}
																	toggle={() =>
																		setDropDownToggle(
																			(
																				prev
																			) =>
																				!prev
																		)
																	}>
																	<DropdownToggle
																		caret>
																		Dropdown
																	</DropdownToggle>
																	<DropdownMenu>
																		<DropdownItem>
																			Another
																			COMMON
																		</DropdownItem>
																	</DropdownMenu>
																</Dropdown>
															</td>
															<td>
																<Input
																	value={
																		scoreRewardsInput.amount
																	}
																	onChange={(
																		x
																	) =>
																		setScoreRewardsInput(
																			({
																				...prev
																			}) => {
																				const intvalue =
																					parseInt(
																						x
																							.target
																							.value
																					);
																				prev.amount =
																					isNaN(
																						intvalue
																					)
																						? 0
																						: intvalue;
																				return prev;
																			}
																		)
																	}
																/>
															</td>
															<td>
																<Button
																	color='success'
																	onClick={() => {
																		setActiveMetric(
																			({
																				...prevState
																			}) => {
																				prevState.scoreBasedRewards
																					.get(
																						key
																					)!
																					.set(
																						scoreRewardsInput.rarity,
																						scoreRewardsInput.amount
																					);
																				return prevState;
																			}
																		);
																	}}>
																	+
																</Button>
															</td>
														</tr>
													</tbody>
												</Table>
											</td>
											<td>
												<Button
													color='danger'
													onClick={() => {
														setActiveMetric(
															({
																...prevState
															}) => {
																prevState.scoreBasedRewards.delete(
																	key
																);
																return prevState;
															}
														);
													}}>
													-
												</Button>
											</td>
										</tr>
									);
									// Array.from(rtemplate!.keys()).map((rarity, j) => {}
								})}
								<tr>
									<Input
										value={scoreKeyInput}
										onChange={(x) =>
											setScoreKeyInput((prev) => {
												const intvalue = parseInt(
													x.target.value
												);
												return isNaN(intvalue)
													? 0
													: intvalue;
											})
										}
									/>
									<td>
										<Button
											color='success'
											onClick={() => {
												setActiveMetric(
													({ ...prevState }) => {
														prevState.scoreBasedRewards.set(
															scoreKeyInput,
															new Map<
																CardRarity,
																number
															>()
														);
														return prevState;
													}
												);
											}}>
											+
										</Button>
									</td>
								</tr>
							</tbody>
						</Table>
						<Button color='success'>Submit</Button>
					</>
				) : null} */}
				{metrics != null ? null : <Loading />}
			</Container>
		</div>
	);
}
