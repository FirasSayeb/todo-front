'use client'

import { Button, Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react"
import { ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";

export default function Admin(){
    const theme=localStorage.getItem('theme');
    const [users,setUsers]=useState([]);
    const [show,setShow]=useState(false)
    const ref=useRef()
    useEffect(
        ()=>{
         fetch('http://localhost:4000/api/admin/users').then(res=>res.json()).then(data=>{
            console.log(data)
            setUsers(data)}).catch(err=>console.error(err));
        },[users]
    )

    async function handleClick(id){
        try {
            const response = await fetch('http://localhost:4000/api/admin/users/'+id, {
                method: 'DELETE',
               
               
            });

setShow(false)
            
        } catch (error) {
            console.error(error);
            alert(error.message); 
        }
    }
    return (
        <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
        <Modal show={show}>
            <ModalHeader>
                <ModalTitle>Are you sure you want to delete this user ?</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div className="row justify-align-center">
                <Button className="col-4" variant="secondary" onClick={()=>setShow(false)}>No</Button>
                <Button className="col-4" variant="danger" onClick={
                    ()=>{
                        setShow(false)
                        handleClick(ref.current)
                    }}>yes</Button>
                    </div>
            </ModalBody>

        </Modal>
        <div className="table-responsive"><table className="table table-vcenter card-table">
            <thead><tr>
                <th>User Email</th>
                <th>Actions</th>
                </tr></thead>
                <tbody>
                   {users && users.map(user=> <tr><td className="text-secondary">{user.email}</td> <td><button className="btn btn-danger"  onClick={()=>{
                    setShow(true)
                    ref.current=user._id
                    }}>Delete</button></td></tr>  )}
                    
                    </tbody>
            </table></div></div>
    ) 
}
