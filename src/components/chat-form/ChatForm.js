import React, { useState, useEffect } from 'react';

import FormButton from '../controls/buttons/FormButton';
import AttachmentIcon from '../controls/icons/attachment-icon/AttachmentIcon';
import FileAttachment from './FileAttachment';
import FileAttachment from './FileAttachment';

import './ChatForm.scss';

const isMessageEmpty = (textMessage) => {
    return adjustTextMessage(textMessage).length === 0;
}

const adjustTextMessage = (textMessage) => {
    return textMessage.trim();
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

const ChatForm = ({ selectedConversation, onMessageSubmitted }) => {
    const [textMessage, setTextMessage] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Load saved draft from localStorage when component mounts
    useEffect(() => {
        const savedDraft = localStorage.getItem('chatFormDraft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                setTextMessage(draft.textMessage || '');
            } catch(e) {
                console.log('Could not restore draft message');
            }
        }
    }, []);

    // Auto-save draft to localStorage whenever message changes
    useEffect(() => {
        localStorage.setItem('chatFormDraft', JSON.stringify({
            textMessage,
            savedAt: Date.now()
        }));
    }, [textMessage]);

    // Save final state before page unloads/refreshes
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem('chatFormDraft', JSON.stringify({
                textMessage,
                savedAt: Date.now()
            }));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [textMessage]);
    const disableButton = isMessageEmpty(textMessage) && attachedFiles.length === 0;
    let formContents = null;
    let handleFormSubmit = null;

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const validateAndAddFiles = (files) => {
        const fileArray = Array.from(files);
        const validFiles = [];
        
        for (const file of fileArray) {
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                alert(`File "${file.name}" exceeds the 10 MB size limit and will not be added.`);
                continue;
            }
            
            // Check if we've reached max files
            if (attachedFiles.length + validFiles.length >= MAX_FILES) {
                alert(`You can only attach up to ${MAX_FILES} files per message.`);
                break;
            }
            
            // Check for duplicates
            const isDuplicate = attachedFiles.some(
                existingFile => existingFile.name === file.name && existingFile.size === file.size
            );
            
            if (!isDuplicate) {
                validFiles.push(file);
            }
        }
        
        if (validFiles.length > 0) {
            setAttachedFiles(prev => [...prev, ...validFiles]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndAddFiles(files);
        }
    };

    const handleRemoveFile = (index) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const validateAndAddFiles = (files) => {
        const fileArray = Array.from(files);
        const validFiles = [];
        
        for (const file of fileArray) {
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                alert(`File "${file.name}" exceeds the 10 MB size limit and will not be added.`);
                continue;
            }
            
            // Check if we've reached max files
            if (attachedFiles.length + validFiles.length >= MAX_FILES) {
                alert(`You can only attach up to ${MAX_FILES} files per message.`);
                break;
            }
            
            // Check for duplicates
            const isDuplicate = attachedFiles.some(
                existingFile => existingFile.name === file.name && existingFile.size === file.size
            );
            
            if (!isDuplicate) {
                validFiles.push(file);
            }
        }
        
        if (validFiles.length > 0) {
            setAttachedFiles(prev => [...prev, ...validFiles]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndAddFiles(files);
        }
    };

    const handleRemoveFile = (index) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    if (selectedConversation) {
        formContents = (
            <>
                {attachedFiles.length > 0 && (
                    <div className="file-attachments-container">
                        {attachedFiles.map((file, index) => (
                            <FileAttachment
                                key={`${file.name}-${index}`}
                                file={file}
                                onRemove={() => handleRemoveFile(index)}
                            />
                        ))}
                    </div>
                )}
                <div className="chat-form-input-row">
                    <div title="Add Attachment">
                        <AttachmentIcon />
                    </div>
                    <input 
                        type="text" 
                        placeholder="type a message" 
                        value={textMessage}
                        onChange={ (e) => { setTextMessage(e.target.value); } } />
                    <FormButton disabled={ disableButton }>Send</FormButton>
                </div>
                {attachedFiles.length > 0 && (
                    <div className="file-attachments-container">
                        {attachedFiles.map((file, index) => (
                            <FileAttachment
                                key={`${file.name}-${index}`}
                                file={file}
                                onRemove={() => handleRemoveFile(index)}
                            />
                        ))}
                    </div>
                )}
                <div className="chat-form-input-row">
                    <div title="Add Attachment">
                        <AttachmentIcon />
                    </div>
                    <input 
                        type="text" 
                        placeholder="type a message" 
                        value={textMessage}
                        onChange={ (e) => { setTextMessage(e.target.value); } } />
                    <FormButton disabled={ disableButton }>Send</FormButton>
                </div>
            </>
        );
    
        handleFormSubmit = (e) => {
            e.preventDefault();
            
            if (!isMessageEmpty(textMessage) || attachedFiles.length > 0) {
                onMessageSubmitted(textMessage, attachedFiles);
            if (!isMessageEmpty(textMessage) || attachedFiles.length > 0) {
                onMessageSubmitted(textMessage, attachedFiles);
                setTextMessage('');
                setAttachedFiles([]);
                localStorage.removeItem('chatFormDraft');
            }
        };
    }

    return (
        <form 
            id="chat-form" 
            className={isDragging ? 'drag-active' : ''}
            onSubmit={handleFormSubmit}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
        <form 
            id="chat-form" 
            className={isDragging ? 'drag-active' : ''}
            onSubmit={handleFormSubmit}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {formContents}
        </form> 
    );
}

export default ChatForm;