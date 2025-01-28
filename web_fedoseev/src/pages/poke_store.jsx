import React, { useEffect, useState } from "react";
import axios from "axios";
import "./poke_store.css";
import PokemonCard from "../components/PokemonCard";
import Cart from "../components/Cart";
import { Header } from "../header/Header";
import Loading from "../loading/Loading";
import Modal from "../components/Modal";

const Pokemons = () => {
    const [pokemons, setPokemons] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderedItems, setOrderedItems] = useState([]);

    // Загрузка данных о сессии (username)
    useEffect(() => {
        const fetchSessionData = () => {
            fetch("/session-data")
                .then((response) => response.json())
                .then((sessionData) => {
                    setUsername(sessionData.username);
                })
                .catch((error) => console.error("Ошибка получения данных о сессии:", error));
        };
        fetchSessionData();
    }, []);

    // Загрузка списка покемонов
    useEffect(() => {
        const fetchPokemons = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
                setPokemons(response.data.results);
            } catch (error) {
                console.error("Ошибка при загрузке покемонов:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPokemons();
    }, []);

    // Функция для добавления покемона в корзину
    const addToCart = (pokemon) => {
        const existingItem = cartItems.find((item) => item.name === pokemon.name);
        if (existingItem) {
            // Если покемон уже в корзине, увеличиваем количество
            setCartItems(
                cartItems.map((item) =>
                    item.name === pokemon.name ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            // Если покемона нет в корзине, добавляем его с количеством 1
            setCartItems([...cartItems, { ...pokemon, quantity: 1 }]);
        }
    };

    // Функция для увеличения количества покемона
    const handleIncrease = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity += 1;
        setCartItems(updatedCartItems);
    };

    // Функция для уменьшения количества покемона
    const handleDecrease = (index) => {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[index].quantity > 1) {
            updatedCartItems[index].quantity -= 1;
            setCartItems(updatedCartItems);
        }
    };

    // Функция для удаления покемона из корзины
    const handleRemove = (index) => {
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
    };

    // Функция для очистки корзины
    const handleClear = () => {
        setCartItems([]);
    };

    // Функция для оформления заказа
    const handleOrder = () => {
        setOrderedItems(cartItems);
        setCartItems([]);
        setIsModalOpen(true);
    };

    return (
        <div className="pokemon-store">
            {/* Header */}
            <Header username={username} />
            {/* Контейнер для витрины и корзины */}
            <div className="store-container">
                <h1>Магазин покемонов</h1>
                <div className="pokemon-list-container">
                    {/* Витрина покемонов */}
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
                    {/* Корзина */}
                    <div className="cart-container">
                        <Cart
                            cartItems={cartItems}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            onRemove={handleRemove}
                            onClear={handleClear}
                            onOrder={handleOrder}
                        />
                    </div>
                </div>
            </div>
            {/* Индикатор загрузки */}
            {loading && <Loading />}
            {/* Модальное окно */}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h2>Ваш заказ оформлен</h2>
                    <div className="modal-order-list">
                        <ul>
                            {orderedItems.map((item, index) => (
                                <li key={index}>
                                    {item.name} (x{item.quantity})
                                </li>
                            ))}
                        </ul>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Pokemons;