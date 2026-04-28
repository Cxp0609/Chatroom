import { put, takeEvery, select } from 'redux-saga/effects';
import Anthropic from '@anthropic-ai/sdk';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

//  API Configuration
const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY || '';
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  dangerouslyAllowBrowser: true
});
// Helper function to format dates to show actual system time
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

const conversations = [
    { 
        id: '1',
        imageUrl: require('../../images/profiles/daryl.png'),
        imageAlt: 'Daryl Duckmanton',
        title: 'ChatRoom 1',
        createdAt: formatDate(0, 0, 0, 0), // 2 hours ago
        latestMessageText: 'This is a message',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Ok then',
                createdAt: formatDate(0, 0, 0, 0), // 2 hours ago
                isMyMessage: true
            },
            {
                imageUrl: require('../../images/profiles/daryl.png'),
                imageAlt: 'Daryl Duckmanton',
                messageText: `
                    Yeah I think it's best we do that. Otherwise things won't work well at all. 
                    I'm adding more text here to test the sizing this material as well.
                `,
                createdAt: formatDate(0, 0, 0, 0), // 2 hours 5 mins ago
                isMyMessage: false
            },
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Thank I appreciate that.',
                createdAt: formatDate(0, 0, 0, 0), // 1 day ago
                isMyMessage: true
            },
            {
                imageUrl: require('../../images/profiles/daryl.png'),
                imageAlt: 'Daryl Duckmanton',
                messageText: `
                    I can archive this for you if you like?
                `,
                createdAt: formatDate(0, 0, 0, 0), // 1 day 15 mins ago
                isMyMessage: false
            },
            {
                imageUrl: null,
                imageAlt: null,
                messageText: `
                    Can this be recorded?
                `,
                createdAt: formatDate(0, 0, 0, 0), // 1 day 1 hour ago
                isMyMessage: true
            },
            {
                imageUrl: require('../../images/profiles/daryl.png'),
                imageAlt: 'Daryl Duckmanton',
                messageText: `
                    I'm just in the process of finishing off the
                    last pieces of material for the course.
                `,
                createdAt: formatDate(0, 0, 0, 0), // 1 day 2 hours ago
                isMyMessage: false
            },
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'How do I finish this work??',
                createdAt: formatDate(0, 0, 0, 0), // 3 days ago
                isMyMessage: true
            },
            {
                imageUrl: require('../../images/profiles/daryl.png'),
                imageAlt: 'Daryl Duckmanton',
                messageText: ' Hey mate what\'s up?',
                createdAt: formatDate(0, 0, 0, 0), // 3 days 30 mins ago
                isMyMessage: false
            },
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hello',
                createdAt: formatDate(0, 0, 0, 0), // 3 days 1 hour ago
                isMyMessage: true
            }
        ]
    },
    {
        id: '2', 
        imageUrl: require('../../images/profiles/kim.jpeg'),
        imageAlt: 'Kim O\'Neil',
        title: 'ChatRoom 2',
        createdAt: formatDate(0, 0, 0, 0), // 8 days ago
        latestMessageText: 'Ok fair enough. Well good talking to you.',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Ok fair enough. Well good talking to you.',
                createdAt: formatDate(0, 0, 0, 0), // 8 days ago
                isMyMessage: true
            },
            {
                imageUrl: require('../../images/profiles/kim.jpeg'),
                imageAlt: 'Kim O\'Neil',
                messageText: `
                    Not sure exactly yet. It will be next year sometime. Probably late.
                `,
                createdAt: formatDate(0, 0, 0, 0), // 8 days 10 mins ago
                isMyMessage: false
            },
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Yeah I know. But oh well. So when is the big date?',
                createdAt: formatDate(0, 0, 0, 0), // 9 days ago
                isMyMessage: true
            },
            {
                imageUrl: require('../../images/profiles/kim.jpeg'),
                imageAlt: 'Kim O\'Neil',
                messageText: `
                    Well I know you like doing that stuff. But honestly I think
                    you are already really talented. It's a shame you haven't found
                    what you are looking for yet.
                `,
                createdAt: formatDate(0, 0, 0, 0), // 9 days 15 mins ago
                isMyMessage: false
            },
            {
                imageUrl: null,
                imageAlt: null,
                messageText: `
                    I'm doing ok. Just working on building some applications to
                    bulk up my resume, so I can get a better job.
                `,
                createdAt: formatDate(0, 0, 0, 0), // 9 days 1 hour ago
                isMyMessage: true
            },
            {
                imageUrl: require('../../images/profiles/kim.jpeg'),
                imageAlt: 'Kim O\'Neil',
                messageText: `
                    I've just been really busy at work myself, looking to get
                    married sometime next year too. How are you going?
                `,
                createdAt: formatDate(0, 0, 0, 0), // 9 days 1 hour 20 mins ago
                isMyMessage: false
            },
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Yes it has been a little while',
                createdAt: formatDate(0, 0, 0, 0), // 9 days 2 hours ago
                isMyMessage: true
            },
            {
                imageUrl: require('../../images/profiles/kim.jpeg'),
                imageAlt: 'Kim O\'Neil',
                messageText: 'Hey!!!! Have not spoken to you for a while',
                createdAt: formatDate(0, 0, 0, 0), // 9 days 2 hours 10 mins ago
                isMyMessage: false
            },
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hi Kim?',
                createdAt: formatDate(0, 0, 0, 0), // 9 days 2 hours 15 mins ago
                isMyMessage: true
            }
        ]
    },
    {
        id: '3', 
        imageUrl: require('../../images/profiles/john.jpeg'),
        imageAlt: 'John Anderson',
        title: 'ChatRoom 3',
        createdAt: formatDate(0, 0, 0, 0), // 1 week ago
        latestMessageText: 'Yes I love how Python does that',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hi',
                createdAt: formatDate(0, 0, 0, 0), // 1 week ago
                isMyMessage: true
            }
        ]
    },
    { 
        id: '4',
        imageUrl: require('../../images/profiles/ben.png'),
        imageAlt: 'Ben Smith',
        title: 'ChatRoom 4',
        createdAt: formatDate(0, 0, 0, 0), // ~3 hours ago
        latestMessageText: 'Thanks for cathching that.',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hi',
                createdAt: formatDate(0, 0, 0, 0), // ~3 hours ago
                isMyMessage: true
            }
        ]
    },
    { 
        id: '5',
        imageUrl: require('../../images/profiles/douglas.png'),
        imageAlt: 'Douglas Johannasen',
        title: 'ChatRoom 5',
        createdAt: formatDate(0, 0, 0, 0), // 30 mins ago
        latestMessageText: 'No it does not',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hi',
                createdAt: formatDate(0, 0, 0, 0), // 30 mins ago
                isMyMessage: true
            }
        ]
    },
    { 
        id: '6',
        imageUrl: require('../../images/profiles/jacob.png'),
        imageAlt: 'Jacob Manly',
        title: 'ChatRoom 6',
        createdAt: formatDate(0, 0, 0, 0), // 3 secs ago
        latestMessageText: 'Just be very careful doing that',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hi',
                createdAt: formatDate(0, 0, 0, 0), // 3 secs ago
                isMyMessage: true
            }
        ]
    },
    { 
        id: '7',
        imageUrl: require('../../images/profiles/stacey.jpeg'),
        imageAlt: 'Stacey Wilson',
        title: 'ChatRoom 7',
        createdAt: formatDate(0, 0, 0, 0), // 30 mins ago
        latestMessageText: 'Awesome!!! Congratulations!!!!',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hi',
                createdAt: formatDate(0, 0, 0, 0), // 30 mins ago
                isMyMessage: true
            }
        ]
    },
    { 
        id: '8',
        imageUrl: require('../../images/profiles/stan.jpeg'),
        imageAlt: 'Stan George',
        title: 'ChatRoom 8',
        createdAt: formatDate(0, 0, 0, 0), // 1 week ago
        latestMessageText: 'Good job',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hi',
                createdAt: formatDate(0, 0, 0, 0), // 1 week ago
                isMyMessage: true
            }
        ]
    },
    { 
        id: '9',
        imageUrl: require('../../images/profiles/sarah.jpeg'),
        imageAlt: 'Sarah Momes',
        title: 'ChatRoom 9',
        createdAt: formatDate(0, 0, 0, 0), // 1 year ago
        latestMessageText: 'Thank you. I appreciate that.',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hi',
                createdAt: formatDate(0, 0, 0, 0), // 1 year ago
                isMyMessage: true
            }
        ]
    }
];

export const conversationsSaga = function*() {
    yield delay(1000);
    yield put({
        type: 'CONVERSATIONS_LOADED',
        payload: {
            conversations,
            selectedConversation: conversations[0]
        }
    });
}

// Claude API Saga Handler
export function* handleUserMessage() {
  yield takeEvery('NEW_MESSAGE_ADDED', function* (action) {
    try {
      yield put({ type: 'API_RESPONSE_REQUESTED' });

      // Allow reducers to update state before reading it (fixes race condition)
      yield delay(2);

      // Get full conversation history
      const state = yield select();
      
      // Correct state path - conversations reducer is mounted
      const conversationState = state.conversationState || state;
      
      // Add null safety checks
      if (!conversationState.selectedConversation || !conversationState.selectedConversation.messages) {
        console.warn('No active conversation or messages found');
        return;
      }
      
      const messages = conversationState.selectedConversation.messages;
      
      // Format message history for Claude API
      const formattedMessages = messages
        .slice()
        .reverse()
        .filter(msg => msg && msg.messageText)
        .map(msg => ({
          role: msg.isMyMessage ? 'user' : 'assistant',
          content: msg.messageText.trim()
        }));

      // Call Claude Sonnet 4.6 API
      const response = yield anthropic.messages.create({
        model: 'anthropic-claude-sonnet-4.6',
        max_tokens: 4096,
        system: 'You are a helpful assistant. Respond clearly and concisely.',
        messages: formattedMessages
      });
      console.log(messages.content);

      // Extract response text
      const aiResponse = response.content[0].text;

      // Dispatch success action
      yield put({
        type: 'API_RESPONSE_RECEIVED',
        messageText: aiResponse
      });

    } catch (error) {
      console.error('Claude API Error:', error);
      yield put({
        type: 'API_RESPONSE_FAILED',
        error: error.message
      });
    }
  });
}

export function* watchGetConversationsAsync() {
    console.log('Conversations Requested');
    yield takeEvery('CONVERSATIONS_REQUESTED', conversationsSaga);
}
