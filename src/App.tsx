import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { store } from './app/store';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Provider>
  );
}

export default App;
