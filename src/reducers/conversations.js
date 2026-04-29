const initialState = {
    conversations: [],
    selectedConversation: {}
};
const formatDate = (daysAgo = 0, hoursAgo = 0, minutesAgo = 0, secondsAgo = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);
    date.setMinutes(date.getMinutes() - minutesAgo);
    date.setSeconds(date.getSeconds() - secondsAgo);
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // For very recent messages (less than 1 minute), show seconds
   
    // For messages within the last hour, show minutes
    
    // For messages today, show the actual time
     if (diffHours < 24 && date.getDate() === now.getDate()) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    // For messages within the last week, show day and time
    else if (diffDays < 7) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    // For older messages, show full date
    else {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
};

initialState.selectedConversation = initialState.conversations[1];

const conversationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONVERSATIONS_LOADED':{
            const newState = {...state};
            
            // First try to load saved conversations from localStorage
            const savedConversations = localStorage.getItem('conversations');
            if (savedConversations) {
                try {
                    newState.conversations = JSON.parse(savedConversations);
                } catch(e) {
                    newState.conversations = action.payload.conversations ? action.payload.conversations : [];
                }
            } else {
                newState.conversations = action.payload.conversations ? action.payload.conversations : [];
            }
            
            // Try to restore previously selected conversation from localStorage
            const savedConversationId = localStorage.getItem('selectedConversationId');
            if (savedConversationId) {
                const foundConversation = newState.conversations.find(c => c.id === savedConversationId);
                if (foundConversation) {
                    newState.selectedConversation = foundConversation;
                } else {
                    newState.selectedConversation = action.payload.selectedConversation;
                }
            } else {
                newState.selectedConversation = action.payload.selectedConversation;
                console.log(action);
            }
            
            return newState;
        }
      case 'SELECTED_CONVERSATION_CHANGED': {
        const newState = { ...state };
        newState.selectedConversation = 
            newState.conversations.find(
                conversation => conversation.id === action.conversationId
            );
        
        // Save selected conversation id to localStorage when user switches conversations
        if (newState.selectedConversation) {
            localStorage.setItem('selectedConversationId', newState.selectedConversation.id);
        }

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
                createdAt: formatDate(0, 0, 0, 0),
                isMyMessage: true
            }
        )

        // Update latest message preview text
        newState.selectedConversation.latestMessageText = action.textMessage;
        
        // Update the conversation in the conversations array
        const conversationIndex = newState.conversations.findIndex(c => c.id === newState.selectedConversation.id);
        newState.conversations[conversationIndex] = newState.selectedConversation;

        // Save full conversation history to localStorage
        localStorage.setItem('conversations', JSON.stringify(newState.conversations));

         return newState
       }
       case 'API_RESPONSE_RECEIVED':{
         const newState = { ...state };
         newState.selectedConversation = { ...newState.selectedConversation };

         newState.selectedConversation.messages.unshift(
             {
                 imageUrl: null,
                 imageAlt: null,
                 messageText: action.messageText,
                 createdAt: formatDate(0, 0, 0, 0),
                 isMyMessage: false
             }
         )

         // Update latest message preview text
         newState.selectedConversation.latestMessageText = action.messageText;
         
         // Update the conversation in the conversations array
         const conversationIndex = newState.conversations.findIndex(c => c.id === newState.selectedConversation.id);
         newState.conversations[conversationIndex] = newState.selectedConversation;

         // Save full conversation history to localStorage
         localStorage.setItem('conversations', JSON.stringify(newState.conversations));

         return newState
       }
       default:
         return state;
    }
  }
  
export default conversationsReducer;