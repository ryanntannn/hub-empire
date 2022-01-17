import './index.css';
import Home from './components/Home';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/shadow.css';
import './styles/master.css';
import MyCards from './components/MyCards';

const rootElement = document.getElementById('root');
render(
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/my-cards' element={<MyCards />} />
		</Routes>
	</BrowserRouter>,
	rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
