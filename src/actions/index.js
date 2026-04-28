export const conversationChanged = conversationId => ({
    type: 'SELECTED_CONVERSATION_CHANGED',
    conversationId
});

export const conversationsRequested = () => ({
    type: 'CONVERSATIONS_REQUESTED'
});

export const conversationDeleted = () => ({
    type: 'DELETE_CONVERSATION'
});

export const newMessageAdded = (textMessage, attachedFiles = []) =>({
    type: 'NEW_MESSAGE_ADDED',
    textMessage,
    attachedFiles
});

export const apiResponseRequested = () => ({
    type: 'API_RESPONSE_REQUESTED'
});

export const apiResponseReceived = (messageText) => ({
    type: 'API_RESPONSE_RECEIVED',
    messageText
});

export const apiResponseFailed = (error) => ({
    type: 'API_RESPONSE_FAILED',
    error
});
