import React from 'react';

import './FileIcon.scss';

const FileIcon = () => {
    return (
        <svg version="1.1" className="file-icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 512 512" xmlSpace="preserve">
            <path d="M441.6,171.2L340.8,70.4C336,65.6,329.6,63.2,323.2,63.2H96c-17.6,0-32,14.4-32,32v321.6c0,17.6,14.4,32,32,32h320
                c17.6,0,32-14.4,32-32V188.8C448,182.4,445.6,176,441.6,171.2z M384,416.8H128V95.2h170.4l85.6,85.6V416.8z"/>
            <rect x="160" y="192" width="192" height="16"/>
            <rect x="160" y="256" width="192" height="16"/>
            <rect x="160" y="320" width="128" height="16"/>
        </svg>
    );
}

export default FileIcon;
