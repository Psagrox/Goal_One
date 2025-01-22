import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Agregar otras rutas */}
      </Routes>
    </Router>
  );
}

export default App;
