import React from "react";
import './Cart.css';

const Cart = ({ cartItems, onIncrease, onDecrease, onRemove, onClear, onOrder }) => {
    return (
        <div className="cart">
            <h2>Корзина</h2>
            {cartItems.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <div>
                    <button className="clear-button" onClick={onClear}>Очистить</button>
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index} className="cart-item">
                                <div className="cart-item-preview">
                                    <img src={item.sprites.front_default} alt={item.name} width="50" height="50" />
                                    <span>{item.name} (x{item.quantity})</span>
                                </div>
                                <div className="cart-item-controls">
                                    <button onClick={() => onIncrease(index)}>+</button>
                                    <button onClick={() => onDecrease(index)} disabled={item.quantity === 1}>
                                        -
                                    </button>
                                    <button onClick={() => onRemove(index)}>Удалить</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="order-button-container">
                        <button className="order-button" onClick={onOrder}>Заказать</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;