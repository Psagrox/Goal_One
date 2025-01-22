import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
       <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
