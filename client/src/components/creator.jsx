import React, { useContext, useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { Context } from "./utils/Context";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import Barchart from "./bargraph";

export default function Creator() {
    const navigate = useNavigate()
    const { setTheme, theme, room, question, setQuestion } = useContext(Context)
    const [time, setTime] = useState(null)
    const [res, setRes] = useState(false)
    const [correctIndex, setCorrectIndex] = useState(null);

    socket.on("ended",(data)=>{
        // alert(data);
        navigate('/dash')
    })

    socket.on("time", (data) => {
        setTime(data);
    })
    socket.on("question", (data) => {
        console.log(data)
        const opt = data.options
        opt.forEach((d, index) => {
            if (d.option === data.correct) {
                setCorrectIndex(index);
            }
        });
        setQuestion(data.questions)
    })

    function endquiz(){
        socket.emit("endquiz", room)
    }

    function handleclick(){
        socket.emit("nextquestion",room);
        setRes(false)
    }
    useEffect(() => {
        const handleRes = (data) => {
            console.log(data);
            setRes(data)
        };
        socket.on("res", handleRes);
        return () => {
            socket.off("res", handleRes);
        };
    }, []);
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark")
        }
        else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme])


    return (
        <div className="h-[100vh] w-full bg-[#e0e0e0] flex flex-col dark:bg-[#1b1b1b]">
            <div className="w-full h-16 p-4 flex">
                <p className="w-full capitalize h-12 dark:text-whitetext font-bold text-2xl">{room}</p>
                <button className="p-4 rounded-full w-12 h-12 overflow-hidden flex justify-center items-center dark:shadow-sm dark:shadow-white" onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); }}>
                    <Lightbulb className=" w-40 h-40 dark:text-yellow-600" />
                </button>
            </div>
            <div className="h-full w-full flex items-center flex-col ">
                {time ? (
                    <>
                        <div className="w-full p-4 h-[50%] dark:text-whitetext text-xl flex justify-center items-center">{question && question}</div>
                        <div className="w-[10%] h-[20%] text-7xl dark:text-whitetext text-black font-bold p-4 text-center">{time}</div>
                    </>
                ) : (
                    res ? (
                        <div className="w-full h-full flex justify-center items-center">
                            <Barchart data={res} correct={correctIndex} />

                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-5xl dark:text-whitetext">Loading</div>
                            <motion.p className="text-primary bg-clip-text animate-dotss text-lg bg-gradient-to-r dark:from-whitetext dark:to-whitetext from-black to-black bg-no-repeat"
                                style={{ backgroundSize: '0% 100%', display: "inline" }}
                            >
                                <span className="text-5xl">.....</span>
                            </motion.p>
                        </div>
                    )
                )}
            </div>

            <div className="w-full p-8 flex  ">
                <button className="dark:text-white mr-auto font-semibold" onClick={endquiz}>END QUIZ</button>
                {res && <button className="dark:text-white ml-auto font-semibold" onClick={handleclick}>NEXT</button>}
            </div>
        </div>
    )
}