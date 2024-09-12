
import React from 'react';
import './Apocalypse.css';
import apocalypseVideo from '../images/apocalypse.mp4'; // Подключаем видео

const Apocalypse = () => {
    return (
        <div className="apocalypse">
            <video autoPlay loop muted>
                <source src={apocalypseVideo} type="video/mp4" />
                Ваш браузер не поддерживает видео.
            </video>
            <div className="overlay">
                <h1>Это был осознанный выбор</h1>
            </div>
        </div>
    );
};

export default Apocalypse;
