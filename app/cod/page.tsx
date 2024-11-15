"use client"

import React, { useRef, useEffect } from 'react';
import { FaAnglesRight } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Cod = () => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isAllowToVote, setIsAllowToVote] = React.useState(false);
    const [otpVal, setOtpVal] = React.useState<any>(0);

    const handleOtp = (e: any) => {
        const input = e.target;
        const value = input.value;
        const isValidInput = value.match(/[0-9a-z]/gi);
        input.value = isValidInput ? value[0] : "";

        const fieldIndex = Number(input.dataset.index);

        if (isValidInput) {
            input.select();
        }

        if (fieldIndex < inputsRef.current.length - 1 && isValidInput) {
            inputsRef.current[fieldIndex + 1]?.focus();
        }
        if (e.key === "Backspace" && fieldIndex > 0) {
            inputsRef.current[fieldIndex - 1]?.focus();
        }
    };

    const handleOnPasteOtp = (e: any) => {
        const data = e.clipboardData.getData("text");
        const value = data.split("");

        if (value.length === inputsRef.current.length) {
            inputsRef.current.forEach((input, index) => {
                if (input) {
                    input.value = value[index];
                }
            });
            submit();
        }
    };

    const disableInputs = () => {
        inputsRef.current.forEach((input) => {
            if (input) {
                input.disabled = true;
                input.classList.add("disabled");
            }
        });
    }

    const enableInputs = () => {
        inputsRef.current.forEach((input) => {
            if (input) {
                input.disabled = false;
                input.value = "";
                input.classList.remove("disabled");
            }
        });
    }

    const submit = () => {
        console.log("Submitting...");
        let otp = "";

        disableInputs();
        otp = inputsRef.current.map(input => input?.value).join("");

        setOtpVal(otp);

        fetch(`/api/check-code?code=${otp}`)
            .then(response => response.json())
            .then(data => {
                if (data?.status == "failed") {
                    toast.error(data?.message);
                } else {
                    toast.success(data?.message);
                    enableInputs();
                    setIsAuthenticated(true);
                }

                enableInputs();
            })
            .catch(error => {
                console.error("Error:", error);
                toast.error(error);
                enableInputs();
            });

        console.log(otp);
    };

    const submitVote = (team: string) => {
        if (confirm(`Ești sigur că vrei să votezi pentru ${team}?`) == true) {

            console.log("Submitting vote...");
            const votePromise = fetch(`/api/add-vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: otpVal,
                    teamSelect: team
                })
            })
                .then(response => response.json());

            toast.promise(
                votePromise,
                {
                    pending: 'Am trimis votul tău, asteaptă sa se proceseze...',

                }
            );
            votePromise.then(data => {
                if (data?.status == "failed") {
                    toast.error(data?.message);
                } else {
                    toast.success(data?.message);
                }

                enableInputs();
                setIsAuthenticated(false);
            })
                .catch(error => {
                    console.error("Error:", error);
                    toast.error(error);
                });
        }
    }

    useEffect(() => {
        const fetchData = () => {
            fetch(`/api/check-allow-vote`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "failed") {
                        setIsAllowToVote(false);
                    } else {
                        setIsAllowToVote(true);
                    }
                })
                .catch(error => {
                    console.error("Error fetching check allow vote:", error);
                    toast.error('Failed to load check allow vote.');
                });
        };
        fetchData();
    })

    useEffect(() => {

        inputsRef.current.forEach((input, index) => {
            if (input) {
                input.dataset.index = index.toString();
                input.addEventListener("keyup", handleOtp);
                input.addEventListener("paste", handleOnPasteOtp);
            }
        });

        return () => {
            inputsRef.current.forEach((input) => {
                if (input) {
                    input.removeEventListener("keyup", handleOtp);
                    input.removeEventListener("paste", handleOnPasteOtp);
                }
            });
        };
    }, [isAllowToVote]);

    return (
        <div className="w-full bg-[#282a37] flex items-center justify-center flex-col flex-wrap font-sans text-slate-100 relative p-10 max-sm:p-2">
            <div className='w-full min-h-full h-full fixed z-[1] top-0 left-0'>
                <img src='all.jpg' alt='all' className='w-full h-full object-cover' />
                <div className='w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.8)]' />
            </div>
            <div className='w-full h-full relative z-[2] pt-20 top-0 left-0 flex items-center justify-center flex-col'>
                <p className="text-[60px] font-bold tracking-tight text-cyan-400 max-sm:text-[30px] text-center">
                    Around The World
                </p>
                <p className="text-[30px] font-bold text-center">Balul Bobocilor 2024</p>
                <br /><br />

                <a className='text-cyan-400 text-bold text-[18px]' href='/'> {"<- " }Home</a>


                <br /><br /><br /><br />
                {
                    isAllowToVote == false ? (
                        <div className="my-8 text-center">
                            <h1 className="text-[20px] font-bold text-center">Nu poți vota încă!</h1>
                            <br />
                        </div>
                    ) :
                    isAuthenticated == false ? (
                        <div className="my-8 text-center">
                            <h1 className="text-[20px] font-bold text-center">Enter code</h1>
                            <br />
                            <div className="otp-field">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        type="number"
                                        maxLength={1}
                                        ref={(el) => { inputsRef.current[index] = el; }}
                                        pattern="\d*"
                                        className={` text-center ${index === 2 ? 'space' : ''}`}
                                    />
                                ))}
                            </div>
                            <br /><br />
                            <div className='flex items-center justify-center'>
                                <button className='w-[150px] h-[45px] bg-cyan-700 flex items-center justify-center gap-3 rounded-lg font-bold text-[17px]' onClick={() => submit()}>Send <FaAnglesRight /></button>
                            </div>
                        </div>
                    ) :
                        (
                            <>
                                <br /> 
                                <h1 className="text-[25px] font-bold text-center">Alegeți echipa favorită!</h1>
                                <br /> <br />

                                <div className='w-full max-w-[1200px] h-full flex items-center justify-center gap-24 flex-wrap'>
                                    <div className='flex items-center justify-between flex-col gap-10 border-cyan-700 border-solid border-[2px] p-3 rounded-lg'>
                                        <div className='flex items-center gap-3 flex-col'>
                                            <img src='Echipa 01-1.jpeg' alt='all' className='max-w-[300px] w-[300px] max-h-[400px] aspect-[9/16] h-full object-left-top object-cover rounded-lg' />
                                            <p className='text-[18px] text-center'>Plugariu Anamaria <br /> Ștefan Nikolas</p>

                                        </div>
                                        <button className='w-[180px] h-[45px] bg-cyan-700 flex items-center justify-center gap-3 rounded-lg font-bold text-[17px] hover:scale-110 duration-150 transition-all' onClick={() => submitVote("Echipa 1")}>Votează Echipa 1</button>
                                    </div>

                                    <div className='flex items-center justify-between flex-col gap-10 border-cyan-700 border-solid border-[2px] p-3 rounded-lg'>
                                        <div className='flex items-center gap-3 flex-col'>
                                            <img src='Echipa 02-1.jpeg' alt='all' className='max-w-[300px] w-[300px] max-h-[400px] aspect-[9/16] h-full object-left-top object-cover rounded-lg' />
                                            <p className='text-[18px] text-center'>Porof Ștefania <br /> Bobu Andrei</p>

                                        </div>
                                        <button className='w-[180px] h-[45px] bg-cyan-700 flex items-center justify-center gap-3 rounded-lg font-bold text-[17px] hover:scale-110 duration-150 transition-all' onClick={() => submitVote("Echipa 2")}>Votează Echipa 2</button>
                                    </div>

                                    <div className='flex items-center justify-between flex-col gap-10 border-cyan-700 border-solid border-[2px] p-3 rounded-lg'>
                                        <div className='flex items-center gap-3 flex-col'>
                                            <img src='Echipa 03-1.jpeg' alt='all' className='max-w-[300px] w-[300px] max-h-[400px] aspect-[9/16] h-full object-left-top object-cover rounded-lg' />
                                            <p className='text-[18px] text-center'>Tarânt Maria <br /> Condruc Mihai</p>

                                        </div>
                                        <button className='w-[180px] h-[45px] bg-cyan-700 flex items-center justify-center gap-3 rounded-lg font-bold text-[17px] hover:scale-110 duration-150 transition-all' onClick={() => submitVote("Echipa 3")}>Votează Echipa 3</button>
                                    </div>

                                    <div className='flex items-center justify-between flex-col gap-10 border-cyan-700 border-solid border-[2px] p-3 rounded-lg'>
                                        <div className='flex items-center gap-3 flex-col'>
                                            <img src='Echipa 04-1.jpeg' alt='all' className='max-w-[300px] w-[300px] max-h-[400px] aspect-[9/16] h-full object-left-top object-cover rounded-lg' />
                                            <p className='text-[16px]'>Asoltanei Georgiana <br /> Nechifor Vlăduț</p>

                                        </div>
                                        <button className='w-[180px] h-[45px] bg-cyan-700 flex items-center justify-center gap-3 rounded-lg font-bold text-[17px] hover:scale-110 duration-150 transition-all' onClick={() => submitVote("Echipa 4")}>Votează Echipa 4</button>
                                    </div>

                                    <div className='flex items-center justify-between flex-col gap-10 border-cyan-700 border-solid border-[2px] p-3 rounded-lg'>
                                        <div className='flex items-center gap-3 flex-col'>
                                            <img src='Echipa 05-1.jpeg' alt='all' className='max-w-[300px] w-[300px] max-h-[400px] aspect-[9/16] h-full object-left-top object-cover rounded-lg' />
                                            <p className='text-[18px] '>Negru Prințesa <br /> Lulciuc Marian</p>

                                        </div>
                                        <button className='w-[180px] h-[45px] bg-cyan-700 flex items-center justify-center gap-3 rounded-lg font-bold text-[17px] hover:scale-110 duration-150 transition-all' onClick={() => submitVote("Echipa 5")}>Votează Echipa 5</button>
                                    </div>

                                    <div className='flex items-center justify-between flex-col gap-10 border-cyan-700 border-solid border-[2px] p-3 rounded-lg'>
                                        <div className='flex items-center gap-3 flex-col'>
                                            <img src='Echipa 06-1.jpeg' alt='all' className='max-w-[300px] w-[300px] max-h-[400px] aspect-[9/16] h-full object-left-top object-cover rounded-lg' />
                                            <p className='text-[18px] '>Nicorici Andreea <br /> Lionte Andrei</p>

                                        </div>
                                        <button className='w-[180px] h-[45px] bg-cyan-700 flex items-center justify-center gap-3 rounded-lg font-bold text-[17px] hover:scale-110 duration-150 transition-all' onClick={() => submitVote("Echipa 6")}>Votează Echipa 6</button>
                                    </div>

                                    <div className='flex items-center justify-between flex-col gap-10 border-cyan-700 border-solid border-[2px] p-3 rounded-lg'>
                                        <div className='flex items-center gap-3 flex-col'>
                                            <img src='Echipa 07-1.jpeg' alt='all' className='max-w-[300px] w-[300px] max-h-[400px] aspect-[9/16] h-full object-left-top object-cover rounded-lg' />
                                            <p className='text-[18px] '>Rotaru Dumitrița <br /> Andrieș Dragos</p>

                                        </div>
                                        <button className='w-[180px] h-[45px] bg-cyan-700 flex items-center justify-center gap-3 rounded-lg font-bold text-[17px] hover:scale-110 duration-150 transition-all' onClick={() => submitVote("Echipa 7")}>Votează Echipa 7</button>
                                    </div>
                                </div>
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

export default Cod;
