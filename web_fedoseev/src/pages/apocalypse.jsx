// web_fedoseev/src/pages/apocalypse.jsx

import React from 'react';
import './Apocalypse.css'; // стили

const Apocalypse = () => {
    return (
        <div className="apocalypse-container">
            <video autoPlay loop muted className="apocalypse-video">
                <source src={require('../images/apocalypse.mp4')} type="video/mp4" />
                Ваш браузер не поддерживает воспроизведение видео.
            </video>
            <div className="apocalypse-text">
                <h1>Это был осознанный выбор</h1>
            </div>
        </div>
    );
};

export default Apocalypse;