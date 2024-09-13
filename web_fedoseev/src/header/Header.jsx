import React from "react";
import { Link } from "react-router-dom";
import logo from '../images/logo.png'; // Импортируем изображение
import './Header.css'; // Подключаем стили


export const Header = ({ username }) => { // Получаем username через пропс
    return (
        <header>
            <div className="nav-container">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <nav>
                    <ul>
                        <li><Link to="/main">Главная</Link></li>
                        <li id="apocalypse-container">
                            {username === 'admin' ? ( // Проверяем значение username
                                <Link to="/apocalypse">ЖМИ, ОНИ ЭТО ЗАСЛУЖИЛИ</Link>
                            ) : (
                                <Link to="/apocalypse">НЕ НАЖИМАТЬ</Link>
                            )}
                        </li>
                    </ul>
                </nav>
                <div className="profile">
                    {/*<span>В{username}</span>*/}
                    <Link to="/logout">Выход</Link>
                </div>
            </div>
        </header>
    );
}