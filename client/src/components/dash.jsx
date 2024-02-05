import React, { useEffect, useRef, useState, useContext } from "react";
import Homeheader from "./home-header";
import { UserButton } from "@clerk/clerk-react";
import { motion, useInView } from "framer-motion";
import { fetchuserdata } from "./utils/fetchuserdata";
import { Context } from "./utils/Context";
import { Lightbulb ,X } from "lucide-react"
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'


export default function Dash() {
    
    const rref = useRef(null);
    const isinview = useInView(rref);
    const [userdata,setUserdata]=useState(null)
    const { theme, setTheme ,setRoom ,setCount, setType } = useContext(Context)
    const [modal, setModal] = useState(false);
    const [quizname , setQuizname] = useState("")
    const navigate = useNavigate()
    const options = [
        { value: 9, label: 'GK' },
        { value: 10, label: 'BOOKS' },
        { value: 11, label: 'Film' },
        { value: 12, label: 'Music' },
        { value: 13, label: 'Threaters' },
        { value: 14, label: 'TV' },
        { value: 18, label: 'computers' },
      ]

    const createclicked = () => {
        console.log(userdata.username)
        socket.connect()
        console.log(quizname)
        socket.emit("create", { username: userdata.username, quizname: quizname });
        setRoom(quizname)
        navigate('/create')

    }
    const joinclicked = () => {

    }

    useEffect(()=>{
        setUserdata(JSON.parse(sessionStorage.getItem("userdata")))
    },[])

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
    const togglemode = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }
    return (
        <>
            {
                modal && (
                    <motion.div 
                    className="absolute inset-0 w-full h-full bg-opacity-10 flex justify-center backdrop-blur-sm items-center bg-white dark:bg-[#1b1b1b] dark:bg-opacity-10"
                    variants={{
                        hidden:{opacity:0 , },
                        visible:{opacity:1}
                    }}
                    initial="hidden"
                    animate="visible"
                    >

                        <div className="w-[40%] h-[50%] bg-[#e0e0e0] dark:bg-second p-4 ">
                            <X className="ml-auto" onClick={()=>{setModal(!modal)}}/>
                            <div className="flex justify-center items-center flex-col gap-4 w-full">
                            <input type="text" className="w-[60%] text-whitetext" placeholder="Enter a Quiz Name" onChange={(e)=>{setQuizname(e.target.value)}}/>
                            <input type="number" placeholder="Enter the number of Questions" onChange={(e)=>{setCount(e.target.value)}} />
                            <Select options={options} onChange={(e)=>{setType(e.value)}}/>
                            <button onClick={createclicked}>CREATE</button>
                            </div>
                        </div>
                    </motion.div>
                )
            }
            <div className="flex flex-col bg-[#e0e0e0] dark:bg-[#1b1b1b]  h-[100vh]">
                <div className="flex justify-between items-center overflow-hidden w-full h-12 p-8">
                    <button className="p-4 rounded-full w-12 h-12 overflow-hidden flex justify-center items-center dark:shadow-sm dark:shadow-white" onClick={togglemode}>
                        <Lightbulb className=" w-40 h-40 dark:text-yellow-600" />
                    </button>
                    <div className=" ml-auto">
                        <UserButton />
                    </div>
                </div>
                <div className="w-full h-full">
                    <div className="w-full h-full grid grid-cols-6 grid-rows-6 justify-items-center gap-4 pl-20 pr-20 pt-10">
                        <motion.div
                            className="rounded-[50px] pt-8 col-start-1 col-end-3 row-start-1 row-end-3 h-[100%] shadow-cards text-whitetext w-full dark:shadow-darkcards dark:bg-[#1b1b1b] flex justify-center items-center flex-col"
                            ref={rref}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={isinview ? { scale: 1, opacity: 1, color: "black" } : { scale: 0, opacity: 0, color: "white" }}
                            transition={{ duration: .7 }}
                        >
                            <p className="text-black text-xl dark:text-whitetext font-semibold mb-auto">CREATED QUIZZES</p>
                            <p className=" h-full w-full flex justify-center items-center">{}</p>


                        </motion.div>

                        <motion.div
                            className="rounded-[50px] dark:shadow-darkcards col-start-3 col-end-7 row-start-1 row-end-6 shadow-cards text-whitetext w-full dark:bg-[#1b1b1b]    flex justify-center items-center"
                            ref={rref}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={isinview ? { scale: 1, opacity: 1, color: "black" } : { scale: 0, opacity: 0, color: "white" }}
                            transition={{ duration: .7 }}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3 ">
                                    <button className="w-full h-4 p-4 flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-700" onClick={ ()=>{setModal(!modal)} }>CREATE</button>
                                    <button className="w-full h-4 p-4 flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-700" onClick={() => { joinclicked() }}>JOIN</button>
                                </div>
                                <input type="text" className="p-2 w-full outline-none border rounded-md border-gray-400" placeholder="Enter Room Code" />
                            </div>

                        </motion.div>
                        <motion.div
                            className="rounded-[50px] dark:shadow-darkcards col-start-1 col-end-3 row-span-3 shadow-cards text-whitetext w-full  dark:bg-[#1b1b1b]   flex justify-center items-center"
                            ref={rref}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={isinview ? { scale: 1, opacity: 1, color: "black" } : { scale: 0, opacity: 0, color: "white" }}
                            transition={{ duration: .7 }}
                        >
                            <p className="text-black text-xl dark:text-whitetext font-semibold mb-auto pt-8">RECENTS</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
