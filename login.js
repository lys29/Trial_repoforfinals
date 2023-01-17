/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./Login.module.css";
import Link from "next/link";
import {useState} from 'react';
import {getSession, useSession, signIn, signOut } from 'next-auth/react';
import {useFormik} from 'formik';
import login_validate from '../lib/validate';
import { useRouter } from 'next/router';
import toast from "../components/Toast";
import * as React from "react";
import Button from './Home/Button';

export default function Login(){

    const notify = React.useCallback((type, message) => {
        toast({ type, message });
      }, []);

    const dismiss = React.useCallback(() => {
    toast.dismiss();
    }, []);

    const[show, setShow] = useState(false)
    const router = useRouter()

    // Login Formik
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate: login_validate,
        onSubmit,
    });

    async function onSubmit(values) {
        const status = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl: "http://localhost:3000/Dashboard"
        })
        if (status.ok) {
            router.push(status.url)
            notify("success", "Successfully Logged In.")
        } else {
            notify("error", "Invalid Credentials.")
        }        
    }

    return(
    <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.left1}>
                    <h1> Login </h1>
                    <h5>Please sign in to continue.</h5>
                    <section className={`${styles.formContainer}`}>
                    <form className="d-flex flex-column" onSubmit={formik.handleSubmit}>
                        <div>
                            <div>
                                <div>
                                    <div className={styles.spread}>
                                        Email
                                    </div>
                                    {formik.errors.email && formik.touched.email ? <div className={styles.guide}>{formik.errors.email}</div> : <></>}
                                </div>
                                <input className={styles.formControl}
                                type="email" 
                                name="email"
                                placeholder="Email"
                                {...formik.getFieldProps('email')}
                                />
                                
                            </div>
                            <div className="input-group d-flex flex-column justify-content-center">
                                <div className='gap-2 d-flex flex-row justify-content-between'>
                                <span className={styles.p}>
                                    Password
                                </span>
                                {formik.errors.password && formik.touched.password ? 
                                <span  className={styles.guide1}>{formik.errors.password}</span> : <></>}
                                </div>
                               
                                <input className={styles.formControl}
                                type={`${show ?"text":"password"}`}
                                name="password"
                                placeholder="Password"
                                {...formik.getFieldProps('password')}
                                />
                            </div>
                            <div className={styles.but}>
                                <span>
                                    <Link href='/forgotPassword'>
                                        <Button>Forgot Password?</Button>
                                    </Link>
                                </span>
                            </div>
                            <div className={styles.next}>
                                <button type="submit">
                                    <h2>Login</h2><img src='./images/Vector 23.png'/>
                                </button>
                            </div>
                        </div>
                    </form>
                        <div className={styles.last}>
                        <p>Dont have an account yet?</p>
                            <Link href={'/register'}><Button>Sign Up</Button></Link>
                        </div>
                    </section>
                </div>
        </div>
    </div>

    )
      
}

// Redirect to Dashboard page when you are already authenticated
export async function getServerSideProps({req}) {
    const session = await getSession({req})
  
    if (!session) {
      return {
        props: { session }
      }
    }
  
    return {
      redirect: {
        destination: '/Dashboard',
        permanent: false
      }
    }
  }