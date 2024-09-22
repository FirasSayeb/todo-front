
'use client';

import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createContext, useState } from "react";
import Cookies from 'js-cookie';
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";


const schema = object({
    email: string().email().required(),
    password: string().required(),
}).required();



export default function Login() {

    const theme=localStorage.getItem('theme');

    const [show,setShow]=useState(false)
    
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result?.role);  
            console.log(result?.email)
           
            Cookies.set("email", result?.email);
            if (result?.role === "user") {
                router.push('/user/dashboard');
            } else if (result?.role === "admin") {
                router.push('/admin/dashboard');
            } else {
                console.error(result.message);
                setShow(true)
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setShow(true)
        }
    };

    return (
        <>
        <Modal show={show}>
           <ModalHeader>
            <ModalTitle>Failed To Login</ModalTitle>
           </ModalHeader>
           <ModalBody><p>Verify your Cordinantes </p><br/>
            <Button variant="secondary" onClick={()=>setShow(false)}>Cancel</Button>
           </ModalBody>
        </Modal>
        <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-7 col-xs-5">
                <label className="form-label required">Email:</label>
                <input {...register("email")} type="email" className={`form-control ${errors.email ? 'is-invalid' :""} `} />
                <p className="invalid-feedback">{errors.email?.message}</p>
                </div>
                <div className="col-md-7 col-xs-5">
                <label className="form-label required">Password:</label>
                <input {...register("password")} type="password"  className={`form-control ${errors.password ? 'is-invalid' :""}`} />
                <p  className="invalid-feedback">{errors.password?.message}</p>
                </div>
                <div className="col-md-7 col-xs-5">
                <input type="submit" className="btn btn-primary" />
                </div>
                </div>
            </form>
            <div className="col-md-7 col-xs-5">
            <a href="/auth/reset-password">Forget Password?</a>
            </div>
        </div>
        </>
    );
}
