import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import App from './App';
import store from './src/redux/store';
import { name as appName } from './app.json';

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

registerRootComponent(Root);
AppRegistry.registerComponent(appName, () => Root);