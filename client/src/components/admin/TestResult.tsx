import React from 'react';
import { Button, Container, Input, Table } from 'reactstrap';
import useAuth from '../../contexts/AuthenticationContext';
import { Metric, ScoreData } from '../../types/admin';
import { UserData } from '../../types/types';
import BackButton from '../BackButton';
import { DropdownSelection } from '../DropdownSelection';
import Loading from '../Loading';
import { RewardTable } from './RewardTable';

export default function TestResult() {
	const auth = useAuth();
	const [activeMetric, setActiveMetric] = React.useState<Metric>();
	const [metrics, setMetrics] = React.useState<Metric[] | null>(null);
	const [users, setUsers] = React.useState<UserData[] | null>(null);
	const [scoreData, setScoreData] = React.useState<ScoreData[]>([]);

	const getTestResultData = () => {
		auth.authenticatedGet(`/admin/testresultsdata`)
			.then((res: any) => {
				console.log(res);
				setUsers(res.data.users);
				setMetrics(res.data.metrics);
				setActiveMetric(res.data.metrics[0]);
				setScoreData(
					res.data.users.map((user: UserData) => ({
						_id: user._id,
						displayName: user.profile!.displayName,
						score: 0,
					}))
				);
			})
			.catch();
	};

	const checkRewards = () => {
		auth.authenticatedGet(`/admin/checkrewarddata`, {
			data: { scoreData, metricId: activeMetric?.id },
		})
			.then((res: any) => {
				console.log(res.data);
				setScoreData(res.data);
			})
			.catch();
	};

	const sendRewards = () => {
		auth.authenticatedPost(`/admin/giverewards`, {
			data: { scoreData, metricId: activeMetric?.id },
		})
			.then((res: any) => {
				console.log(res.data);
				alert('rewards added');
				getTestResultData();
			})
			.catch((err: any) => {
				alert('there was an error');
			});
	};

	React.useEffect(() => {
		if (users != null || metrics != null) return;
		getTestResultData();
	});

	const metricDropdown = () => (
		<DropdownSelection
			items={metrics!.map((metric) => ({
				id: metric.displayName,
				data: metric,
			}))}
			setSelected={setActiveMetric}
		/>
	);

	function getRewards(metric: Metric, rewardData: ScoreData[]) {
		rewardData.sort((a, b) => b.score - a.score);
		rewardData.forEach((x) => (x.rewards = undefined));
		let playerIndex = 0;
		let rewardIndex = 0;
		while (rewardIndex < metric!.positionBasedRewards.length) {
			const thisScore = rewardData[playerIndex].score;
			const thisRewardIndex = rewardIndex;
			while (
				playerIndex < rewardData.length &&
				rewardData[playerIndex].score == thisScore
			) {
				console.log(
					playerIndex,
					rewardData[playerIndex].score,
					thisScore,
					rewardIndex,
					thisRewardIndex
				);
				rewardData[playerIndex].rewards =
					metric?.positionBasedRewards[thisRewardIndex].rewards;
				playerIndex++;
				rewardIndex++;
			}
		}
		metric.scoreBasedRewards.sort((a, b) => b.score - a.score);
		for (let i = playerIndex; i < rewardData.length; i++) {
			const thisPlayer = rewardData[i];
			for (let j = 0; j < metric.scoreBasedRewards.length; j++) {
				const thisReward = metric.scoreBasedRewards[j];
				if (thisPlayer.score < thisReward.score) continue;
				thisPlayer.rewards = thisReward.rewards;
				break;
			}
		}
		console.log(rewardData);
		return rewardData;
	}

	return (
		<div className='page'>
			<Container className='mt-5'>
				<h1 className='title'>Enter Test Results</h1>
				<BackButton />
				<b>Active Metric: </b>
				{activeMetric != null ? activeMetric.displayName : null}
				{metrics != null && users != null && scoreData.length > 0 ? (
					<>
						{metricDropdown()}
						<Table>
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Score</th>
									<th>Rewards</th>
								</tr>
							</thead>
							<tbody>
								{scoreData.map((user, i) => (
									<tr key={i}>
										<td>{i + 1}</td>
										<td>{user.displayName}</td>
										<td>
											<Input
												type='number'
												value={user.score}
												onChange={(x) => {
													setScoreData(
														(prev: ScoreData[]) => {
															const copied = [
																...prev,
															];
															copied[i].score =
																parseInt(
																	x.target
																		.value
																);
															return copied;
														}
													);
												}}
											/>
										</td>
										<td>
											{user.rewards != undefined ? (
												<RewardTable
													rewardData={user.rewards}
												/>
											) : null}
										</td>
									</tr>
								))}
							</tbody>
						</Table>
						<Button
							className='me-2'
							onClick={() => {
								checkRewards();
							}}>
							Check Rewards
						</Button>
						<Button color='success' onClick={sendRewards}>
							Submit
						</Button>
					</>
				) : (
					<Loading />
				)}
			</Container>
		</div>
	);
}
