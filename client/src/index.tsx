import './index.css';
import Home from './components/Home';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/shadow.css';
import './styles/master.css';
import MyCards from './components/MyCards';
import Trade from './components/Trade';
import Leaderboard from './components/Leaderboard';
import Profile, { ProfileProps } from './components/Profile';
import Login from './components/Login';
import { AuthenticationProvider } from './contexts/AuthenticationContext';
import useAuth from './contexts/AuthenticationContext';
import React from 'react';
import NewTrade from './components/trading/NewTrade';
import TradeInbox from './components/trading/TradeInbox';

const rootElement = document.getElementById('root');

const RequireAuth: React.FC = ({ children }: any) => {
	const { authed } = useAuth();

	return authed == true ? children : <Login />;
};

render(
	<AuthenticationProvider>
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={
						<RequireAuth>
							<Home />
						</RequireAuth>
					}
				/>
				<Route
					path='my-cards'
					element={
						<RequireAuth>
							<MyCards />
						</RequireAuth>
					}
				/>
				<Route
					path='trade'
					element={
						<RequireAuth>
							<Trade />
						</RequireAuth>
					}>
					<Route path='inbox' element={<TradeInbox />} />
					<Route path='history' element={<TradeInbox />} />
					<Route path='new' element={<NewTrade />} />
				</Route>
				<Route
					path='leaderboard'
					element={
						<RequireAuth>
							<Leaderboard />
						</RequireAuth>
					}
				/>
				<Route
					path='profile'
					element={
						<RequireAuth>
							<Profile />
						</RequireAuth>
					}
				/>
				<Route path='login' element={<Login />} />
			</Routes>
		</BrowserRouter>
	</AuthenticationProvider>,
	rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
