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
import Profile from './components/Profile';
import Login from './components/Login';
import { AuthenticationProvider } from './contexts/AuthenticationContext';
import useAuth from './contexts/AuthenticationContext';
import React from 'react';
import NewTrade from './components/trading/NewTrade';
import TradeInbox from './components/trading/TradeInbox';
import ModalContainer from 'react-modal-promise';
import { CardProvider } from './contexts/CardsContext';
import { History } from './components/History';
import EditProfile from './components/EditProfile';
import NotFound from './components/NotFound';
import AdminHome from './components/admin/AdminHome';
import MetricEditor from './components/admin/MetricEditor';
import TestResult from './components/admin/TestResult';

const rootElement = document.getElementById('root');

const RequireAuth: React.FC = ({ children }: any) => {
	const { authed } = useAuth();

	return authed == true ? children : <Login />;
};

render(
	<AuthenticationProvider>
		<CardProvider>
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
					<Route
						path='edit-profile'
						element={
							<RequireAuth>
								<EditProfile />
							</RequireAuth>
						}
					/>
					<Route
						path='profile/:userId'
						element={
							<RequireAuth>
								<Profile />
							</RequireAuth>
						}
					/>
					<Route
						path='history'
						element={
							<RequireAuth>
								<History />
							</RequireAuth>
						}
					/>
					<Route
						path='admin'
						element={
							<RequireAuth>
								<AdminHome />
							</RequireAuth>
						}
					/>
					<Route
						path='admin/metrics'
						element={
							<RequireAuth>
								<MetricEditor />
							</RequireAuth>
						}
					/>
					<Route
						path='admin/test-results'
						element={
							<RequireAuth>
								<TestResult />
							</RequireAuth>
						}
					/>
					<Route path='login' element={<Login />} />
					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
			<ModalContainer />
		</CardProvider>
	</AuthenticationProvider>,
	rootElement
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
