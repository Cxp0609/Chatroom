const initialState = {
    conversations: [],
    selectedConversation: {}
};

initialState.selectedConversation = initialState.conversations[1];

const conversationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONVERSATIONS_LOADED':{
            const newState = {...state};
            newState.conversations = action.payload.conversations ? action.payload.conversations : [];
            newState.selectedConversation = action.payload.selectedConversation;
            console.log(action);
            
            return newState;
        }
      case 'SELECTED_CONVERSATION_CHANGED': {
        const newState = { ...state };
        newState.selectedConversation = 
            newState.conversations.find(
                conversation => conversation.id === action.conversationId
            );

        return newState;
      }
       case 'DELETE_CONVERSATION': {
        const newState = { ...state };
        let selectedConversationIndex = 
            newState.conversations.findIndex(c => c.id === newState.selectedConversation.id);
        newState.conversations.splice(selectedConversationIndex, 1);

        if (newState.conversations.length > 0) {
            if (selectedConversationIndex > 0) {
                --selectedConversationIndex;
            }
    
            newState.selectedConversation = newState.conversations[selectedConversationIndex];
        } else {
            newState.selectedConversation = null;
        }

        return newState;
      }
      case 'NEW_MESSAGE_ADDED':{
        const newState = { ...state };
        newState.selectedConversation = { ...newState.selectedConversation };
        console.log(newState.selectedConversation);

        newState.selectedConversation.messages.unshift(
            {
                imageUrl: null,
                imageAlt: null,
                messageText: action.textMessage,
                createdAt: '3 secs ago',
                isMyMessage: true
            }
        )
        return newState
      }
      default:
        return state;
    }
  }
  
export default conversationsReducer;