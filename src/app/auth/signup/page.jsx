'use client';
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = object({
    email: string().email().required(),
    password: string().required(),
}).required();

export default function SignUp() {
    const [show,setShow]=useState(false)
    const theme=localStorage.getItem('theme');
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        data.role = "user"; 

        try {
            const response = await fetch('http://localhost:4000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            router.push('/auth/login');
        } catch (error) {
            console.error(error);
            alert(error.message); 
        }
    };

    return (
        <>
         <Modal show={show}>
           <ModalHeader>
            <ModalTitle>Failed To Signup</ModalTitle>
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
            <input {...register("password")} type="password" className={`form-control ${errors.password ? 'is-invalid' :""} `} />
            <p className="invalid-feedback">{errors.password?.message}</p>
            </div>
            <div className="col-md-7 col-xs-5">
            <input type="submit" className="btn btn-primary" />
            </div>
            </div>
        </form>
        </div>
        </>
    );
}
