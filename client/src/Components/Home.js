import React from 'react';
import {
	Menu,
	Container,
	Image,
	Header,
	Segment,
	Grid,
	Button,
} from 'semantic-ui-react';

export default function Home(props) {
	const tempProps = {};

	const {} = props;
	return (
		<div>
			<Container text style={{ marginTop: '2em' }}>
				<Header as='h1' size='medium'>
					Dashboard
				</Header>
				<Segment>
					Net-worth:
					<Header size='huge'>$10,000</Header>
				</Segment>
				<Grid columns='equal'>
					<Grid.Column stretched>
						<Segment>
							Income ($/h):
							<Header size=''>$1,000</Header>
						</Segment>
					</Grid.Column>
					<Grid.Column stretched>
						<Segment>
							Active-Hubs:
							<Header size=''>10</Header>
						</Segment>
					</Grid.Column>
				</Grid>
				<Header as='h1' size='medium'>
					Functions
				</Header>
				<Grid columns='equal'>
					<Grid.Row>
						<Grid.Column stretched>
							<Button size='big' color='blue'>
								Cards
							</Button>
						</Grid.Column>
						<Grid.Column stretched>
							<Button size='big' color='purple'>
								Trade
							</Button>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column stretched>
							<Button size='big' color='orange'>
								Leaderboard
							</Button>
						</Grid.Column>
						<Grid.Column stretched>
							<Button size='big' color='teal'>
								Account
							</Button>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		</div>
	);
}
