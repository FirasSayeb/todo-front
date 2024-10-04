'use client';
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useState } from "react";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from 'uuid'; 

export default function Ajouter() {
    const [show,setShow]=useState(false)
    const [message,setMessage]=useState('')
    const theme=localStorage.getItem('theme');
    const [newTask, setNewTask] = useState("");
    const email = Cookies.get("email");

    const handleAddTask = async () => {
        if (newTask.trim()) {
            try {
                console.log(email + newTask)
                const response = await fetch('http://localhost:4000/api/todos/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        email, 
                        task: { id: uuidv4(), task: newTask, finished: false } 
                    })
                });

                if (response.ok) {
                    setNewTask(""); 
                   
                   setMessage('Task added successfully!')
                   setShow(true)
                } else {
                    setMessage('Failed to add task')
                   setShow(true)
                    console.error('Failed to add task');
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    return (
        <>
        <Modal show={show}>
           <ModalHeader>
            <ModalTitle>{message}</ModalTitle>
           </ModalHeader>
           <ModalBody><p>{message} </p><br/>
            <Button variant="secondary" onClick={()=>setShow(false)}>Cancel</Button>
           </ModalBody>
        </Modal>
        <div  className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
            <h2>Add Task</h2>
            <div className="row">
            <div className="col-md-7 col-xs-5">
            <input
            className="form-control"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task name"
            />
            </div>
            </div>
            <button className="btn btn-primary" onClick={handleAddTask}>Add Task</button>
        </div>
        </>
    );
}
