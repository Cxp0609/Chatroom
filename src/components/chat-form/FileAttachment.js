import React from 'react';

import FileIcon from '../controls/icons/file-icon/FileIcon';

import './FileAttachment.scss';

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const FileAttachment = ({ file, onRemove }) => {
    return (
        <div className="file-attachment">
            <div className="file-icon-wrapper">
                <FileIcon />
            </div>
            <div className="file-info">
                <div className="file-name" title={file.name}>{file.name}</div>
                <div className="file-size">{formatFileSize(file.size)}</div>
            </div>
            <button 
                type="button" 
                className="remove-file-btn" 
                onClick={onRemove}
                aria-label="Remove file"
            >
                ×
            </button>
        </div>
    );
};

export default FileAttachment;
