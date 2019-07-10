import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import configStore from './configstore'

const { store } = configStore();

render(
    <Provider store={store}>
        <App title="ol-react test"/>
    </Provider>,
    document.getElementById("app")
);
