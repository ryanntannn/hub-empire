import React from 'react';
import { Button, Container } from 'reactstrap';
import BackButton from './BackButton';
import Loading from './Loading';
import useAuth from '../contexts/AuthenticationContext';
import useCards from '../contexts/CardsContext';
import { ActionLog, DrawLog, IncomeLog, Log, LogType } from '../types/types';
import { CardMini } from './trading/TradeInbox';
import { Link } from 'react-router-dom';

export function History() {
	const [logs, setLogs] = React.useState<ActionLog[] | null>(null);
	const [page, setPage] = React.useState<number>(1);
	const [playerList, setPlayerList] = React.useState<{
		[id: string]: string;
	} | null>(null);
	const auth = useAuth();
	const cardsData = useCards();

	function getActionLog() {}

	React.useEffect(() => {
		if (logs != null) return;
		auth.authenticatedGet('/action-log', {
			gameId: auth.user.userData.game!.id!,
			showAmount: 5,
			page: page,
		})
			.then((res: any) => {
				setLogs(res.data);
				console.log(res.data);
				return auth.authenticatedGet('/users-min');
			})
			.then((res: any) => {
				console.log(res);
				const list: {
					[id: string]: string;
				} = {};
				res.data.user.forEach(
					(x: { _id: string; profile: { displayName: string } }) =>
						(list[x._id] = x.profile.displayName)
				);
				setPlayerList(list);
				console.log(list);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [page]);

	function timeConverter(UNIX_timestamp: number) {
		var a = new Date(UNIX_timestamp);
		var months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var time =
			date +
			' ' +
			month +
			' ' +
			year +
			' ' +
			hour +
			':' +
			min +
			':' +
			sec;
		return time;
	}

	function logToString(log: Log) {
		console.log(log);
		switch (log.logType) {
			case LogType.ACTION_LOG:
				return actionLogToString(log as ActionLog);
			case LogType.DRAW_LOG:
				return drawLogToString(log as DrawLog);
			case LogType.INCOME_LOG:
				return incomeLogToString(log as IncomeLog);
		}
	}

	function actionLogToString(log: ActionLog) {
		const thisCard = cardsData.getCard(log.cardId);
		return (
			<p>
				[{timeConverter(log.time)}]{' '}
				<Link to={`../profile/${log.userId}`}>
					{playerList![log.userId]}
				</Link>{' '}
				used {thisCard.displayName} {thisCard.emoji}
				{log.targetId ? ` on ${playerList![log.targetId]}` : null}
			</p>
		);
	}

	function drawLogToString(log: DrawLog) {
		const thisCard = cardsData.getCard(log.cardId);
		return (
			<p>
				[{timeConverter(log.time)}]{' '}
				<Link to={`../profile/${log.userId}`}>
					{playerList![log.userId]}
				</Link>{' '}
				drew {thisCard.displayName} {thisCard.emoji}
			</p>
		);
	}

	function incomeLogToString(log: IncomeLog) {
		return (
			<p>
				[{timeConverter(log.time)}]{' '}
				<Link to={`../profile/${log.userId}`}>
					{playerList![log.userId]}
				</Link>{' '}
				earned ${log.turnIncome}
			</p>
		);
	}

	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>📓 History</h1>
				<p className='normal-and-bold'>Page: {page} (5 per page)</p>
				<Button
					disabled={page <= 1}
					onClick={() => {
						setPage((prev) => --prev);
						setLogs(null);
					}}
					className='me-2'>
					Previous
				</Button>
				<Button
					onClick={() => {
						setPage((prev) => ++prev);
						setLogs(null);
					}}>
					Next
				</Button>
				<br /> <br />
				{(logs != null && playerList != null) || false ? (
					<>
						{logs.length == 0 ? (
							<p className='big-and-bold'>No items to show</p>
						) : null}
						{logs.map((log, i) => {
							return (
								<div
									className='rounded-box shadow pt-3 pb-1 mb-3'
									key={i}>
									{logToString(log)}
								</div>
							);
						})}
					</>
				) : (
					<Loading />
				)}
			</Container>
		</div>
	);
}
