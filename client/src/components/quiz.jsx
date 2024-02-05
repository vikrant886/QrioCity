import React, { useContext, useEffect, useState } from "react";
import { socket } from "./socket";
import { Context } from "./utils/Context";
import { motion } from "framer-motion"
import { Lightbulb } from "lucide-react";

export default function Quiz() {
    const [time, setTime] = useState(30)
    const { room, theme, setTheme, question, setQuestion } = useContext(Context)
    const [options, setOptions] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null);
    const [trig, setTrig] = useState(true)
    const [correct,setCorrect] = useState(null)
    useEffect(() => {
        const handleTimeUpdate = (data) => {
            setTime(data);
            if (data === 1 && trig) {
                socket.emit("answers", selectedOption);
                setTrig(false);
            }
        };

        socket.on("time", handleTimeUpdate);
        return () => {
            socket.off("time", handleTimeUpdate);
        };
    }, [trig, selectedOption]);



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


    socket.on("question", (data) => {
        console.log(data)
        setTrig(true)
        setQuestion(data.questions)
        setOptions(data.options)
        const opt = data.options
        opt.forEach((d, index) => {
            if (d.option === data.correct) {
                setCorrect(index);
            }
        });
    })

    return (
        <div className="w-full h-[100vh] flex bg-[#e0e0e0] dark:bg-[#1b1b1b] flex-col">
            <div className="w-full p-4 flex">
                <p className="w-full capitalize h-12 dark:text-whitetext font-bold text-2xl">{room}</p>
                <button className="p-4 rounded-full w-12 h-12 overflow-hidden flex justify-center items-center dark:shadow-sm dark:shadow-white" onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); }}>
                    <Lightbulb className=" w-40 h-40 dark:text-yellow-600" />
                </button></div>
            <div className="h-full w-full flex justify-center gap-20 items-center">
                <div className="w-[35%] h-[75%] shadow-cards rounded-[50px]  dark:shadow-darkcards p-8 flex flex-col gap-4">
                    <p className="text- p-4 dark:text-white font-semibold text-2xl">{question && question}</p>
                    <div className="w-full h-full">
                        {options && options.map((data, index) => (
                            <motion.div
                                key={index}
                                className={`flex p-4 mb-2 font-semibold text-black  rounded-lg justify-start pl-12 text-lg items-center w-full hover:bg-opacity-90 dark:hover:text-white dark:hover:bg-opacity-35 ${time <= 0 && index === correct ? "dark:text-black bg-green-500" : (index===selectedOption && time<=0 ? "dark:text-black bg-red-500" : "dark:text-whitetext hover:bg-gray-300 dark:hover:bg-white")} `}
                                style={{ backgroundSize: '0% 100%' }}
                                onClick={() => { setSelectedOption(index) }}
                            >
                                {data.option}
                                <div className="w-4 h-4 border border-black dark:border-white rounded-full flex justify-center items-center  ml-auto">
                                    <div key={index} className={`w-2 h-2 rounded-full ${selectedOption === index ? "dark:bg-white bg-blue-700" : "bg-transparent"}`}></div>
                                </div>

                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="w-[10%] h-[20%] text-7xl dark:text-whitetext text-black font-bold  p-4 text-center">{time}</div>
            </div>
        </div>
    )
}