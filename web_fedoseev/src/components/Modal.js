import React from "react";
import './Modal.css';
const Modal = ({ children, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-order-list">
                    {children}
                </div>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default Modal;