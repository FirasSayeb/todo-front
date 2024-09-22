'use client'

import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState } from "react";
import { useRouter } from "next/navigation";
const schema = yup
  .object({
    email: yup.string().email().required(),
   password:yup.string().required()
  })
  .required()


export default function Update(){
    const [show,setShow]=useState(false)
    const router=useRouter()
    const theme=localStorage.getItem('theme');
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      })
     
    const onSubmit = async (data) => {
        try {
            await fetch('http://localhost:4000/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            router.push('/auth/login')
           
        } catch (error) {
            console.error('Error changing  password:', error);
        }
    }

  

   

      return (

        <>
         <Modal show={show}>
           <ModalHeader>
            <ModalTitle>Failed To update password</ModalTitle>
           </ModalHeader>
           <ModalBody><p>Verify your Cordinantes </p><br/>
            <Button variant="secondary" onClick={()=>setShow(false)}>Cancel</Button>
           </ModalBody>
        </Modal>

        <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
        <form onSubmit={handleSubmit(onSubmit)}>.
        <div className="row">
        <div className="col-md-7 col-xs-5">
            <label className="form-label required">Email:</label>
            <input type="email"  {...register("email")}  className={`form-control ${errors.email ? 'is-invalid' :""} `}  />
            <p className="invalid-feedback"> {errors.email?.message}</p>
            </div>
            <div className="col-md-7 col-xs-5">
            <label className="form-label required">Password:</label>
            <input type="password" {...register("password")} className={`form-control ${errors.password ? 'is-invalid' :""} `} />
            <p className="invalid-feedback">{errors.password?.message}</p>
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