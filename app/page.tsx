"use client"

import { useEffect, useState } from "react";

const Slider = () => {


  return (
    <>
      <div className="w-full h-full relative">
        <video src="/VideoBalPr.mov" loop muted autoPlay={true} playsInline className="w-full h-full object-cover" />

        <div className="w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.8)] z-[2]" />

        <div className="w-full h-full absolute top-0 left-0 z-[3] flex items-center justify-center flex-col gap-10">
          <div className="text-white text-center p-5">
            <h1 className="text-4xl font-bold">Balul Bobocilor 2024</h1>
            <h1 className="text-7xl font-bold text-cyan-400">Around The World</h1>
            <p className="text-2xl">Liceul "Regina Maria" Dorohoi</p>
          </div>
          <a className="bg-cyan-400 text-black font-bold text-[18px] h-[45px] flex items-center justify-center px-6 py-2 rounded-lg mt-4 hover:scale-110 transition-all duration-150" href="/cod">
              Votează Acum
            </a>
        </div>
      </div>
    </>
  );
};

export default Slider;
