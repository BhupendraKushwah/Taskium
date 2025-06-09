import React from 'react';
import CustomMediaPreview from './CustomMediaPreview';

const PreviewModal = ({ mimetype, src, title, text, isOpen, onClose }) => {
    const handleOnClose = () => {
        if (onClose instanceof Function) onClose()
    }
    const handleDownload = async () => {
        try {
            const response = await fetch(src, {
                mode: 'cors',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }

            // Convert to blob
            const blob = await response.blob();

            // Create temporary URL
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.target = '_blank';
            link.href = url;
            link.download = title || 'file';
            link.click();
        } catch (error) {
            console.log(error);
        }
    }
    return (
        isOpen
            ?
            <div className="preview-modal-overlay">
                <div className="preview-modal-content">
                    <div className="preview-modal-header flex items-center justify-between">
                        <h3 className="file-name ">{title || "File Name"}</h3>
                        <div className='flex items-center gap-16'>
                            <i className="ph-fill ph-download-simple  preview-modal-download" onClick={handleDownload}></i>
                            {onClose && <span className="preview-modal-close">
                                <button type='button' onClick={handleOnClose} className="ph font-size-24 ph-x font-size-20 cursor-pointer" />
                            </span>}

                        </div>
                    </div>

                    <div className="preview-modal-body">
                        <CustomMediaPreview mimetype={mimetype} src={src} title={title} text={text} />
                    </div>
                </div>
            </div>
            : <></>
    )
}

export default PreviewModal;