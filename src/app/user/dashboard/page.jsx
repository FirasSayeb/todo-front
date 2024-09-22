"use client";

import { Button, Modal, ModalBody } from "react-bootstrap";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import React from 'react';

export default function User() {
    const [message, setMessage] = useState(""); 
    const [show, setShow] = useState(false);    
    const [showModal, setShowModal] = useState(false); 
    const [shareWithEmail, setShareWithEmail] = useState('');
    const [shareMode, setShareMode] = useState('view');
    const [todo, setTodo] = useState(null);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskName, setEditTaskName] = useState("");
    const [finished, setFinished] = useState(false); 
    const [sharedUsers, setSharedUsers] = useState([]); 
    const email = Cookies.get("email");

    const theme = localStorage.getItem('theme');

    useEffect(() => {
        if (email) {
            fetch(`http://localhost:4000/api/todos?email=${email}`)
                .then(res => res.json())
                .then(data => {
                    setTodo(data);
                    setSharedUsers(data.sharedWith || []); 
                })
                .catch(err => {
                    console.error(err);
                    setTodo(null);
                });
        }
    }, [todo]);

    const calculateCompletion = (tasks) => {
        const completed = tasks?.filter(task => task.finished).length;
        return tasks?.length > 0 ? (completed / tasks?.length) * 100 : 0;
    };

    const deleteTask = async (taskId) => {
        try {
            await fetch(`http://localhost:4000/api/todos/tasks/${taskId}?email=${email}`, { method: 'DELETE' });
            setTodo(prev => ({
                ...prev,
                tasks: prev.tasks.filter(task => task.id !== taskId)
            }));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editTask = (task) => {
        setEditTaskId(task.id);
        setEditTaskName(task.task);
        setFinished(task.finished); 
    };

    const saveEditedTask = async () => {
        if (editTaskName.trim()) {
            try {
                await fetch(`http://localhost:4000/api/todos/tasks/${editTaskId}?email=${email}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ finished, task: editTaskName }) 
                });

                setTodo(prev => ({
                    ...prev,
                    tasks: prev.tasks.map(task =>
                        task.id === editTaskId ? { ...task, task: editTaskName, finished } : task
                    )
                }));
                setEditTaskId(null);
                setEditTaskName("");
                setFinished(false); 
            } catch (error) {
                console.error('Error saving edited task:', error);
            }
        }
    };

    const handleShareTodo = async () => {
        if (!shareWithEmail) {
            alert('Please enter a valid email.');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/todos/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, shareWith: shareWithEmail, mode: shareMode }),
            });
            setShowModal(false); 
            if (response.ok) {
                setMessage("Todo list shared successfully!");
                setShow(true);  
                
                setSharedUsers(prev => [...prev, { userEmail: shareWithEmail, mode: shareMode }]);
            } else {
                const errorData = await response.json();
                setMessage('Error sharing todo list: ' + errorData.message);
                setShow(true);  
            }
        } catch (error) {
            console.error('Error sharing todo list:', error);
        }
    };

    const deleteSharedUser = async (userEmail) => {
        try {
            const response = await fetch(`http://localhost:4000/api/todos/share/${userEmail}?email=${email}`, {
                method: 'DELETE',
               
            });
            
           

            if (response.ok) {
                setSharedUsers(prev => prev.filter(user => user.userEmail !== userEmail));
                setMessage("User unshared successfully!");
                setShow(true);
            } else {
                const errorData = await response.json();
                setMessage('Error unsharing todo: ' + errorData.message);
                setShow(true);
            }
        } catch (error) {
            console.error('Error unsharing todo:', error);
        }
    };

    return (
        <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
            <Modal show={show} onHide={() => setShow(false)}>
                <ModalBody>
                    {message}
                    <Button onClick={() => setShow(false)}>Close</Button>
                </ModalBody>
            </Modal>

            <a href="/user/dashboard/ajouter" className="btn btn-primary">Ajouter Task</a><br/>

            <button className="btn btn-outline-info" onClick={() => setShowModal(true)}>
                Share Todo
            </button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <ModalBody>
                    <div className="modal-content">
                        <h4>Share Todo List</h4>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email to share with"
                            value={shareWithEmail}
                            onChange={(e) => setShareWithEmail(e.target.value)}
                        />
                        <div>
                            <label>
                                <input
                                className="form-check-input"
                                    type="radio"
                                    name="mode"
                                    value="view"
                                    checked={shareMode === 'view'}
                                    onChange={(e) => setShareMode(e.target.value)}
                                />
                                Read-Only
                            </label>
                            <label>
                                <input
                                className="form-check-input"
                                    type="radio"
                                    name="mode"
                                    value="edit"
                                    checked={shareMode === 'edit'}
                                    onChange={(e) => setShareMode(e.target.value)}
                                />
                                Editable
                            </label>
                        </div>
                        <button className="btn btn-success" onClick={handleShareTodo}>Share</button>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>

                        <h5>Shared With:</h5>
                        <ul>
                            {sharedUsers.map(user => (
                                <li key={user.userEmail}>
                                    {user.userEmail}
                                    <button className="btn btn-secondary" onClick={() => deleteSharedUser(user.userEmail)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ModalBody>
            </Modal>

            {todo ? (
    <div className="table-responsive">
        <h3>Your Todo List</h3>
        <p>Completion: {calculateCompletion(todo.tasks).toFixed(2)}%</p>
        <table className="table table-vcenter card-table">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Completion</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {todo.tasks?.sort((a, b) => a.finished - b.finished).map((task) => (
                    <tr key={task.id}>
                        <td className="text-secondary">
                            {editTaskId === task.id ? (
                                <>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={finished}
                                        onChange={(e) => setFinished(e.target.checked)}
                                    />
                                    <input
                                        className="form-control"
                                        value={editTaskName}
                                        onChange={(e) => setEditTaskName(e.target.value)}
                                    />
                                </>
                            ) : (
                                task.task
                            )}
                        </td>
                        <td className="text-secondary">{task.finished ? "✔️" : "❌"}</td>
                        <td className="text-secondary">
                            {editTaskId === task.id ? (
                                <button className="btn btn-success" onClick={saveEditedTask}>Save</button>
                            ) : (
                                <button className="btn btn-warning" onClick={() => editTask(task)}>Edit</button>
                            )}
                            <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                {todo.sharedWith?.map(shared => (
                    <React.Fragment key={shared.userEmail}>
                        <h4>Shared with {shared.userEmail} ({shared.mode} mode):</h4>
                        {shared.tasks.map(task => (
                            <tr key={task.id}>
                                <td className="text-secondary">{task.task}</td>
                                <td className="text-secondary">{task.finished ? "✔️" : "❌"}</td>
                                <td className="text-secondary">
                                    {shared.mode === 'edit' && (
                                        <>
                                            <button className="btn btn-warning" onClick={() => editTask(task)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    </div>
) : (
    <p>No todo list available</p>
)}

        </div>
    );
}
