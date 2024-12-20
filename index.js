import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import App from './App';
import store from './src/redux/store';

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

registerRootComponent(Root);