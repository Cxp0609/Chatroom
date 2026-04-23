import React from 'react';
import { createRoot } from 'react-dom/client'; // Changed import
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import './index.scss';
import rootSaga from './store/sagas'
import rootReducer from './reducers';
import App from './App';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer, 
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
// New way to render in React 18+
const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);