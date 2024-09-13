import React from 'react';
import './Apocalypse.css'; // Подключаем CSS файл для стилей

const Apocalypse = () => {
    return (
        <div className="apocalypse-container">
            <video className="apocalypse-video" autoPlay loop muted>
                <source src="../images/apocalypse.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео.
            </video>
        </div>
    );
};

export default Apocalypse;