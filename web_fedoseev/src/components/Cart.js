import React from "react";

const Cart = ({ cartItems }) => {
    return (
        <div className="cart">
            <h2>Корзина</h2>
            {cartItems.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>{item.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;