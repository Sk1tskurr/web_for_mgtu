import React from "react";
import { Link } from "react-router-dom";
import './Header.css'; // Подключаем стили

export const Header = () => {
    return (
        <header>
            <div className="nav-container">
                <div className="logo">
                    <img src="../images/logo.png" alt="Logo"/>
                </div>
                <nav>
                    <ul>
                        <li><Link to="/main">Главная</Link></li>
                        <li><div id="apocalypse-container"></div></li>
                    </ul>
                </nav>
                <div className="profile">
                    <Link to="/logout">Выход</Link>
                </div>
            </div>
        </header>
    );
}

