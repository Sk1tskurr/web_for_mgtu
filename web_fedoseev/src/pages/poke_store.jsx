import React, { useEffect, useState } from "react";
import axios from "axios";
import './poke_store.css';
import PokemonCard from "../components/PokemonCard"; // Убедитесь, что путь правильный
import Cart from "../components/Cart"; // Убедитесь, что путь правильный
import { Header } from '../header/Header'; // Импортируем Header
import Loading from '../loading/Loading'; // Импортируем Loading, если используется

const Pokemons = () => {
    const [pokemons, setPokemons] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [username, setUsername] = useState(""); // Состояние для username
    const [loading, setLoading] = useState(false); // Состояние для загрузки

    // Загрузка данных о сессии (username)
    useEffect(() => {
        const fetchSessionData = () => {
            fetch("/session-data")
                .then((response) => response.json())
                .then((sessionData) => {
                    setUsername(sessionData.username); // Устанавливаем username
                })
                .catch((error) => console.error("Ошибка получения данных о сессии:", error));
        };
        fetchSessionData();
    }, []);

    // Загрузка списка покемонов
    useEffect(() => {
        const fetchPokemons = async () => {
            setLoading(true); // Включаем загрузку
            try {
                const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
                setPokemons(response.data.results);
            } catch (error) {
                console.error("Ошибка при загрузке покемонов:", error);
            } finally {
                setLoading(false); // Выключаем загрузку
            }
        };
        fetchPokemons();
    }, []);

    // Функция для добавления покемона в корзину
    const addToCart = (pokemon) => {
        setCartItems([...cartItems, pokemon]);
    };

    return (
        <div className="pokemon-store">
            {/* Добавляем Header и передаем username */}
            <Header username={username} />
            {/* Отображаем загрузку, если loading === true */}
            {loading && <Loading />}
            <div className="store-container">
                <h1>Магазин покемонов</h1>
                <div className="pokemon-list-container">
                    <div className="pokemon-list">
                        {pokemons.map((pokemon, index) => (
                            <PokemonCard
                                key={index}
                                name={pokemon.name}
                                url={pokemon.url}
                                addToCart={addToCart}
                            />
                        ))}
                    </div>
                    <div className="cart-container">
                        <Cart cartItems={cartItems} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pokemons;