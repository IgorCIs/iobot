import './style/main.sass'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import store from './store/configureStore';
import AppContainer from './containers/AppContainer';

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('root')
)