import { createStore, applyMiddleware, Store } from 'redux';
import rootReducer from '../reducers';
import reduxImmutableStateInvarient from 'redux-immutable-state-invariant';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

export default function createReduxStore(initialState: any = undefined): Store {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, reduxImmutableStateInvarient(), createLogger())
    );
};