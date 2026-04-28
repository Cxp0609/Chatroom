import { all } from 'redux-saga/effects';

import { watchGetConversationsAsync, handleUserMessage } from './conversations';

export default function* rootSaga() {
    yield all([
        watchGetConversationsAsync(),
        handleUserMessage()
    ]);
}
