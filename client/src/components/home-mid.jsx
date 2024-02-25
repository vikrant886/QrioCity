import React, { useState, useTransition, useEffect, useContext } from "react";
import { socket } from "./socket";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Context } from "./utils/Context";
import { useNavigate } from "react-router-dom";
import ImageContainer from "./imagecontainer";
import { X } from "lucide-react";
import {motion} from "framer-motion"

export default function HomeMid() {
    const [code, setCode] = useState(null)
    const [create, setCreate] = useState(false)
    const { user } = useUser();
    const { setUserdata, setParticipants, setRoom } = useContext(Context)
    const [join, setJoin] = useState(false);
    const [username, setUsername] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate()


    useEffect(() => {
        if (user) {
            axios
                .post(process.env.REACT_APP_SOCKET_URL+"getuser", { username: user.username })
                .then((res) => {
                    console.log(res);
                    sessionStorage.setItem("userdata", JSON.stringify(res.data.userdata))
                    setUserdata(res)
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [user]);

    socket.on("wrong code", (data) => {
        alert(data);
    })

    socket.on("anotheruser", (data) => {
        console.log(data);
        setParticipants(data);
        console.log("mid anotheruser")
        navigate('/waiting')
    });

    function joinclicked() {
        socket.connect()
        setRoom(code)
        socket.emit("joinclicked", { code: code, username, image })

    }
    function createclicked() {
        console.log("clicked")
    }
    return (
        <>
            {join && (
                <div className=" absolute bg-opacity-60 inset-0 w-full h-full bg-black flex justify-center items-center">
                    <div className="w-[30%] h-[40%] bg-white p-4 dark:bg-second rounded-xl ">
                        <X className="ml-auto" onClick={()=>{setJoin(!join)}} />
                        <div className="flex flex-col justify-start gap-4 items-center w-full h-full">
                        <ImageContainer onImagechange={(e) => setImage(e)} />
                        <motion.input type="text" className="w-[50%] bg-white dark:bg-second dark:text-[#7d828c] rounded-lg p-2 outline-none hover:border text-center" placeholder="Enter a Avatar Name" onChange={(e) => { setUsername(e.target.value) }} 
                        />
                        <button onClick={joinclicked} className="text-whitetext font-bold ">join</button>
                        </div>
                    </div>
                </div>
            )
            }
            <div className="flex flex-col p-8 pt-20 pb-20 dark:shadow-darkcards shadow-cards rounded-[50px] gap-2 ">
                <h1 className="text-center font-bold text-3xl dark:text-white">QrioCity</h1>
                <h2 className="font-semibold dark:text-whitetext"> A vibrant city of quizzes in all shapes and sizes</h2>
                <div className="flex gap-3">
                    <button className="w-full h-4 p-4 flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-700" onClick={() => { createclicked() }}>CREATE</button>
                    <button className="w-full h-4 p-4 flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-700" onClick={() => { setJoin(!join) }}>JOIN</button>
                </div>
                <input type="text" className="p-2 w-full outline-none border rounded-md border-gray-400" placeholder="Enter Room Code" onChange={(e) => { setCode(e.target.value) }} />
            </div>
        </>
    )
}