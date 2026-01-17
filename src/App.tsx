import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Router } from "./routes/router";
import { Toaster } from 'sonner';
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <Toaster theme='light' position='top-right'/>
        <Router />
      </BrowserRouter>
    </Provider>
  )
}

export default App
