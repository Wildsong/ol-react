import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import configureStore from './configure-store'

const { store } = configureStore();

render(
    <Provider store={store}>
        <App title="ol-react test"/>
    </Provider>,
    document.getElementById("app")
);
