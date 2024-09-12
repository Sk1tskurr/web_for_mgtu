
import React, { useState, useEffect } from 'react';
import './MainPage.css';
import ConfirmationModal from './ConfirmationModal';
import { Header } from '../header/Header';

const MainPage = () => {
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({
        id: '',
        login: '',
        password: '',
        description: '',
        date: ''
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [confirmationAction, setConfirmationAction] = useState(null);

    useEffect(() => {
        fetchSessionData();
        fetchTableContent();
    }, []);

    const fetchSessionData = () => {
        fetch('/session-data')
            .then(response => response.json())
            .then(sessionData => {
                // Добавьте логику для обработки данных сессии
            })
            .catch(error => console.error('Ошибка получения данных о сессии:', error));
    };

    const fetchTableContent = () => {
        fetch('/get_table_content')
            .then(response => response.json())
            .then(data => setTableData(data))
            .catch(error => console.error('Ошибка:', error));
    };

    const handleRowClick = (row) => {
        setSelectedRowId(row.id);
        setSelectedRowData(row);
    };

    const handleAddString = () => {
        setFormData({
            id: '',
            login: '',
            password: '',
            description: '',
            date: ''
        });
        setModalMode('add');
        setShowModal(true);
    };

    const handleEditString = () => {
        if (selectedRowData) {
            setFormData({
                id: selectedRowData.id,
                login: selectedRowData.login,
                password: selectedRowData.password,
                description: selectedRowData.description,
                date: selectedRowData.date
            });
            setModalMode('edit');
            setShowModal(true);
        } else {
            alert("Пожалуйста, выберите строку для изменения.");
        }
    };

    const handleDeleteString = () => {
        if (selectedRowId) {
            setConfirmationMessage(`Вы уверены, что хотите удалить строку с ID: ${selectedRowId}?`);
            setConfirmationAction(() => () => {
                fetch('/delete-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: selectedRowId })
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            alert('Строка успешно удалена');
                            fetchTableContent();
                        } else {
                            alert('Ошибка при удалении строки');
                        }
                    })
                    .catch(error => console.error('Ошибка:', error));
            });
            setShowConfirmation(true);
        } else {
            alert("Пожалуйста, выберите строку для удаления.");
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const data = {
            id: formData.id,
            login: formData.login,
            password: formData.password,
            description: formData.description,
            date: formData.date
        };

        fetch('/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Данные успешно сохранены');
                    setShowModal(false);
                    fetchTableContent();
                } else {
                    alert('Ошибка при сохранении данных: ' + result.message);
                }
            })
            .catch(error => console.error('Ошибка:', error));
    };


    const handleLogout = () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/login';
                } else {
                    alert('Ошибка при выходе из системы');
                }
            })
            .catch(error => console.error('Ошибка:', error));
    };

    return (
        <div className="main-page-container">

            {loading && (
                <div id="loading">
                    <img src="../images/loading.gif" alt="Loading..."/>
                </div>
            )}

            <Header/>
            <div className="maine_page-container">
                <div className="table-wrapper">
                    <table id="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Пароль</th>
                            <th>Какой то текст</th>
                            <th>Дата</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.map(row => (
                            <tr
                                key={row.id}
                                onClick={() => handleRowClick(row)}
                                className={selectedRowId === row.id ? 'selected' : ''}
                            >
                                <td>{row.id}</td>
                                <td>{row.login}</td>
                                <td>{row.password}</td>
                                <td>{row.description}</td>
                                <td>{row.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="button-container">
                    <button onClick={handleAddString}>Добавить</button>
                    <button onClick={handleEditString}>Изменить</button>
                    <button onClick={handleDeleteString}>Удалить</button>
                </div>

                {showModal && (
                    <div id="mainPageModal" className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                            <form id="modalForm" onSubmit={handleFormSubmit}>
                                <div>
                                    <label htmlFor="modalId" id="labelId"
                                           style={{display: modalMode === 'edit' ? 'block' : 'none'}}>Id:</label>
                                    <input type="text" id="modalId" value={formData.id} readOnly
                                           style={{display: modalMode === 'edit' ? 'block' : 'none'}}/>
                                </div>
                                <div>
                                    <label htmlFor="modalLogin">Логин:</label>
                                    <input type="text" id="modalLogin" value={formData.login}
                                           onChange={(e) => setFormData({...formData, login: e.target.value})}/>
                                </div>
                                <div>
                                    <label htmlFor="modalPassword">Пароль:</label>
                                    <input type="text" id="modalPassword" value={formData.password}
                                           onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                                </div>
                                <div>
                                    <label htmlFor="modalDescription">Описание:</label>
                                    <input type="text" id="modalDescription" value={formData.description}
                                           onChange={(e) => setFormData({...formData, description: e.target.value})}/>
                                </div>
                                <div>
                                    <label htmlFor="modalDate" id="labelDate"
                                           style={{display: modalMode === 'edit' ? 'block' : 'none'}}>Дата
                                        регистрации:</label>
                                    <input type="text" id="modalDate" value={formData.date} readOnly
                                           style={{display: modalMode === 'edit' ? 'block' : 'none'}}/>
                                </div>
                                <button type="submit">Сохранить</button>
                            </form>
                        </div>
                    </div>
                )}

                {showConfirmation && (
                    <ConfirmationModal
                        message={confirmationMessage}
                        onConfirm={confirmationAction}
                        onCancel={() => setShowConfirmation(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default MainPage;
