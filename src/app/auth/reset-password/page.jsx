'use client'

import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState } from "react";
const schema = yup
  .object({
    email: yup.string().email().required(),
   
  })
  .required()

export default function Reset(){

    const [show,setShow]=useState(false)
    const [message,setMessage]=useState('')
    const theme=localStorage.getItem('theme');
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      })
      const onSubmit = async (data) => {console.log(data)

        try {
            await fetch('http://localhost:4000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            setMessage('email send  successfully!')
            setShow(true)
            //alert('email send  successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            setMessage('Error sending email:'+error)
            setShow(true)
        }

      }

 
 
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
        
        <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>

        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
        <div className="col-md-7 col-xs-5">
            <label className="form-label required">Email:</label>
            <input type="email" {...register("email")}  className={`form-control ${errors.email ? 'is-invalid' :""} `} />
            
            <p className="invalid-feedback">{errors.email?.message}</p>
            </div>
            <div className="col-md-7 col-xs-5">
           <input type="submit" className="btn btn-primary"/>
           </div>
           </div>
        </form>
        </div>
        </>
    );
}