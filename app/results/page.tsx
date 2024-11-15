"use client"

import React, { useRef, useEffect } from 'react';
import { FaAnglesRight } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Results = () => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [dataAdmin, setDataAdmin] = React.useState<any>([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pass = urlParams.get('pass');

        const fetchData = () => {
            fetch(`/api/show-results?pass=${pass}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "failed") {
                        setIsAuthenticated(false);
                        toast.error(data.message);
                    } else {
                        setIsAuthenticated(true);
                        setDataAdmin(data?.data);
                        toast.success(data.message);
                    }
                })
                .catch(error => {
                    console.error("Error fetching results:", error);
                    toast.error('Failed to load results.');
                });
        };

        fetchData();
        
    }, []);


    return (
        <div className="w-full bg-[#282a37] flex items-center justify-center flex-col flex-wrap font-sans text-slate-100 relative p-10 max-sm: p-2">
            <div className='w-full min-h-full h-full fixed z-[1] top-0 left-0'>
                <img src='all.jpg' alt='all' className='w-full h-full object-cover' />
                <div className='w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.8)]' />
            </div>
            <div className='w-full h-full relative z-[2] pt-20 top-0 left-0 flex items-center justify-center flex-col'>
                <p className="text-[60px] font-bold tracking-tight text-cyan-400 max-sm:text-[30px] text-center">
                    Around The World
                </p>
                <p className="text-[30px] font-bold text-center">Balul Bobocilor 2024</p>
                <br /><br /><br /><br />
                {
                    isAuthenticated == true ? (
                        <div className="my-8 text-center w-full">
                            <div className='showvote w-full'>
                                <h1 className='text-[30px] text-left font-bold'>Rezultate</h1>
                                <div className='content'>
                                    <div className='bar'>
                                        <h3>Echipa 1</h3>
                                        <p>{dataAdmin[0]?.votes || 0} voturi</p>
                                        <div className='fill' style={{ width: `${(dataAdmin[0]?.votes / 300) * 100}%` }}></div>
                                    </div>
                                    <div className='bar'>
                                        <h3>Echipa 2</h3>
                                        <p>{dataAdmin[1]?.votes || 0} voturi</p>
                                        <div className='fill' style={{ width: `${(dataAdmin[1]?.votes / 300) * 100}%` }}></div>
                                    </div>
                                    <div className='bar'>
                                        <h3>Echipa 3</h3>
                                        <p>{dataAdmin[2]?.votes || 0} voturi</p>
                                        <div className='fill' style={{ width: `${(dataAdmin[2]?.votes / 300) * 100}%` }}></div>
                                    </div>
                                    <div className='bar'>
                                        <h3>Echipa 4</h3>
                                        <p>{dataAdmin[3]?.votes || 0} voturi</p>
                                        <div className='fill' style={{ width: `${(dataAdmin[3]?.votes / 300) * 100}%` }}></div>
                                    </div>
                                    <div className='bar'>
                                        <h3>Echipa 5</h3>
                                        <p>{dataAdmin[4]?.votes || 0} voturi</p>
                                        <div className='fill' style={{ width: `${(dataAdmin[4]?.votes / 300) * 100}%` }}></div>
                                    </div>
                                    <div className='bar'>
                                        <h3>Echipa 6</h3>
                                        <p>{dataAdmin[5]?.votes || 0} voturi</p>
                                        <div className='fill' style={{ width: `${(dataAdmin[5]?.votes / 300) * 100}%` }}></div>
                                    </div>
                                    <div className='bar'>
                                        <h3>Echipa 7</h3>
                                        <p>{dataAdmin[6]?.votes || 0} voturi</p>
                                        <div className='fill' style={{ width: `${(dataAdmin[6]?.votes / 300) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) :
                        (
                            <>
                                <br /> <br /> <br />
                                <h1 className="text-[25px] font-bold">NU ESTI AUTENTIFICAT!</h1>

                            </>
                        )
                }
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div >
    );
};

export default Results;
