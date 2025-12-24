import { Provider } from 'react-redux';
import './App.css';
import { store } from './app/store';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
