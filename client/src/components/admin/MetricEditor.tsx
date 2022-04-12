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
import { Metric } from '../../types/admin';
import Loading from '../Loading';
import { RewardTableEditable } from './RewardTable';

export default function MetricEditor() {
	const auth = useAuth();
	const [metrics, setMetrics] = React.useState<Metric[] | null>(null);
	const [activeMetric, setActiveMetric] = React.useState<Metric | null>(null);

	const getMetricData = () => {
		auth.authenticatedGet(`/admin/metrics`)
			.then((res: any) => {
				const metrics = res.data;
				setMetrics(metrics);
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
				{activeMetric != null ? (
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
							<tbody>
								{console.log(activeMetric)}
								{activeMetric.positionBasedRewards.map(
									(metric, i) => {
										return (
											<tr key={i}>
												<td>{metric.position}</td>
												<td>
													<Table>
														<RewardTableEditable
															rewardData={
																metric.rewards
															}
															setData={(data) =>
																setActiveMetric(
																	({
																		...prevState
																	}) => {
																		prevState.positionBasedRewards[
																			i
																		].rewards =
																			data;
																		return prevState;
																	}
																)
															}
														/>
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
																	prevState.positionBasedRewards.splice(
																		i,
																		1
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
										<Button
											color='success'
											onClick={() => {
												setActiveMetric(
													({ ...prevState }) => {
														prevState.positionBasedRewards.push(
															{
																position:
																	prevState
																		.positionBasedRewards
																		.length +
																	1,
																rewards: [],
															}
														);
														return prevState;
													}
												);
											}}>
											+ Add row
										</Button>
									</td>
								</tr>
							</tbody>
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
								{console.log(activeMetric)}
								{activeMetric.scoreBasedRewards.map(
									(metric, i) => {
										return (
											<tr key={i}>
												<td>
													<Input
														type='number'
														value={metric.score}
														onChange={(x) => {
															setActiveMetric(
																({
																	...prevState
																}) => {
																	prevState.scoreBasedRewards[
																		i
																	].score = parseInt(
																		x.target
																			.value
																	);
																	return prevState;
																}
															);
														}}
													/>
												</td>
												<td>
													<Table>
														<RewardTableEditable
															rewardData={
																metric.rewards
															}
															setData={(data) =>
																setActiveMetric(
																	({
																		...prevState
																	}) => {
																		prevState.scoreBasedRewards[
																			i
																		].rewards =
																			data;
																		return prevState;
																	}
																)
															}
														/>
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
																	prevState.scoreBasedRewards.splice(
																		i,
																		1
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
										<Button
											color='success'
											onClick={() => {
												setActiveMetric(
													({ ...prevState }) => {
														prevState.scoreBasedRewards.push(
															{
																score: 0,
																rewards: [],
															}
														);
														return prevState;
													}
												);
											}}>
											+ Add row
										</Button>
									</td>
								</tr>
							</tbody>
						</Table>
						<Button
							color='success'
							onClick={() => console.log(activeMetric)}>
							Submit
						</Button>
					</>
				) : null}
				{metrics != null ? null : <Loading />}
			</Container>
		</div>
	);
}
