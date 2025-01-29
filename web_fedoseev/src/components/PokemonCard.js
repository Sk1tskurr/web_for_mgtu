import React, { useEffect, useState } from "react";
import axios from "axios";
import './PokemonCard.css';
const PokemonCard = ({ name, url, addToCart }) => {
    const [pokemonDetails, setPokemonDetails] = useState(null);

    // Загрузка деталей покемона
    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await axios.get(url);
                setPokemonDetails(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке деталей покемона:", error);
            }
        };

        fetchPokemonDetails();
    }, [url]);

    if (!pokemonDetails) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="pokemon-card">
            <img src={pokemonDetails.sprites.front_default} alt={name} />
            <h2>{name}</h2>
            <p>Вес: {pokemonDetails.weight}</p>
            <p>Рост: {pokemonDetails.height}</p>
            <button onClick={() => addToCart(pokemonDetails)}>Добавить в корзину</button>
        </div>
    );
};

export default PokemonCard;