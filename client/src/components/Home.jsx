import React, { useState, useRef } from "react";
import Lottie from 'lottie-react';
import loading from './json-files/Animation - 1705949484409.json';
import HomeMid from "./home-mid";
import Homeheader from "./home-header";
import { Context } from "./utils/Context";
import {motion} from "framer-motion"
export default function Home() {
    const loadingref = useRef(null);
    const [show, setShow] = useState(false);

    const handleAnimationComplete = () => {
        setShow(true);
    };

    return (
        <motion.div className="w-screen h-screen flex overflow-hidden bg-[#e0e0e0] dark:bg-[#1b1b1b]">
            <div className="w-screen h-screen bg-opacity-40 flex justify-center items-center absolute">
                {show ? (
                    <div className="flex w-full h-full flex-col">
                        <Homeheader />
                        <div className="flex w-full h-full justify-center items-center">
                            <HomeMid />
                        </div>
                    </div>
                ) : (
                    <Lottie
                        lottieRef={loadingref}
                        onComplete={handleAnimationComplete}
                        loop={false}
                        animationData={loading}
                        className="size-40"
                    />
                )}
            </div>
        </motion.div>
    );
}
