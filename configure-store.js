import logger from 'redux-logger'
import { createStore, applyMiddleware, combineReducers, compose  } from 'redux'
import { page } from './page'
import routesMap from './routes-map'

export default function configureStore(preloadedState) {
    const { reducer, middleware, enhancer } = routesMap;
    const rootReducer = combineReducers({
        page,
        location: reducer
    })
    const middlewares = applyMiddleware(middleware, logger)
    const composeEnhancers =
        typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
    const enhancers = composeEnhancers(enhancer, middlewares)
    const store     = createStore(rootReducer, preloadedState, enhancers);
    return { store }
}
