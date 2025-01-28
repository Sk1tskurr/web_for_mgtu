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
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderedItems, setOrderedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [weightFilter, setWeightFilter] = useState([0, 1000]);
    const [heightFilter, setHeightFilter] = useState([0, 100]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [maxWeight, setMaxWeight] = useState(1000);
    const [maxHeight, setMaxHeight] = useState(100);

    // Загрузка данных о сессии (username)
    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await fetch("/session-data");
                const sessionData = await response.json();
                setUsername(sessionData.username);
            } catch (error) {
                console.error("Ошибка получения данных о сессии:", error);
            }
        };
        fetchSessionData();
    }, []);

    // Загрузка списка покемонов
    useEffect(() => {
        const fetchPokemons = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=200");
                setPokemons(response.data.results);

                // Загрузка деталей всех покемонов
                const detailsPromises = response.data.results.map(async pokemon => {
                    const detailResponse = await axios.get(pokemon.url);
                    return detailResponse.data;
                });
                const details = await Promise.all(detailsPromises);
                setPokemonDetails(details);

                // Находим максимальные значения для веса и роста
                const maxWeightValue = Math.max(...details.map(detail => detail.weight));
                const maxHeightValue = Math.max(...details.map(detail => detail.height));
                setMaxWeight(maxWeightValue);
                setMaxHeight(maxHeightValue);

                // Устанавливаем начальные значения для фильтров
                setWeightFilter([0, maxWeightValue]);
                setHeightFilter([0, maxHeightValue]);

                // Инициализируем filteredPokemons
                setFilteredPokemons(response.data.results);

                // Применяем фильтры и сортировку после загрузки данных
                applyFiltersAndSorting(response.data.results, details);
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
            setCartItems(
                cartItems.map((item) =>
                    item.name === pokemon.name ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCartItems([...cartItems, { ...pokemon, quantity: 1 }]);
        }
    };

    // Обработка изменения поискового запроса
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
        applyFiltersAndSorting();
    };

    // Обработка изменения фильтра по весу
    const handleWeightChange = (values) => {
        setWeightFilter(values);
        applyFiltersAndSorting();
    };

    // Обработка изменения фильтра по росту
    const handleHeightChange = (values) => {
        setHeightFilter(values);
        applyFiltersAndSorting();
    };

    // Обработка изменения порядка сортировки
    const handleSortChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        applyFiltersAndSorting();
    };

    // Применение фильтров и сортировки
    const applyFiltersAndSorting = (pokemonsList = pokemons, detailsList = pokemonDetails) => {
        let filtered = pokemonsList.filter(pokemon => {
            const details = detailsList.find(detail => detail.name === pokemon.name);
            return (
                pokemon.name.includes(searchQuery) &&
                (details ? details.weight >= weightFilter[0] && details.weight <= weightFilter[1] : true) &&
                (details ? details.height >= heightFilter[0] && details.height <= heightFilter[1] : true)
            );
        });

        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredPokemons(filtered);
    };

    // Сброс всех фильтров и сортировок
    const handleReset = () => {
        setSearchQuery('');
        setWeightFilter([0, maxWeight]);
        setHeightFilter([0, maxHeight]);
        setSortOrder('asc');
        applyFiltersAndSorting();
    };

    // Функции для управления корзиной
    const handleIncrease = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity += 1;
        setCartItems(updatedCartItems);
    };

    const handleDecrease = (index) => {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[index].quantity > 1) {
            updatedCartItems[index].quantity -= 1;
        } else {
            updatedCartItems.splice(index, 1);
        }
        setCartItems(updatedCartItems);
    };

    const handleRemove = (index) => {
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
    };

    const handleClear = () => {
        setCartItems([]);
    };

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
                {/* Блок фильтров, сортировки и поиска */}
                <div className="filter-sort-search">
                    <input type="text" placeholder="Поиск по имени" value={searchQuery} onChange={handleSearchChange} />
                    <div>
                        <label>Фильтр по весу</label>
                        <input type="range" min="0" max={maxWeight} value={weightFilter[0]} onChange={(e) => handleWeightChange([parseInt(e.target.value), weightFilter[1]])} />
                        <input type="range" min="0" max={maxWeight} value={weightFilter[1]} onChange={(e) => handleWeightChange([weightFilter[0], parseInt(e.target.value)])} />
                    </div>
                    <div>
                        <label>Фильтр по росту</label>
                        <input type="range" min="0" max={maxHeight} value={heightFilter[0]} onChange={(e) => handleHeightChange([parseInt(e.target.value), heightFilter[1]])} />
                        <input type="range" min="0" max={maxHeight} value={heightFilter[1]} onChange={(e) => handleHeightChange([heightFilter[0], parseInt(e.target.value)])} />
                    </div>
                    <button onClick={handleSortChange}>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</button>
                    <button onClick={handleReset}>Сброс</button>
                </div>
                <div className="pokemon-list-container">
                    {/* Витрина покемонов */}
                    <div className="pokemon-list">
                        {filteredPokemons.map((pokemon, index) => (
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