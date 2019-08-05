import React from 'react'
import {render} from 'react-dom'
import App from './App'

// We need redux here because of redux-first-router
import {Provider} from 'react-redux'
import configureStore from './configure-store'
const { store } = configureStore();

render(
    <Provider store={store}>
        <App title="ol-react test"/>
    </Provider>,
    document.getElementById("app")
);
