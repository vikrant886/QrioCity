import React, { useContext, useEffect, useState } from "react";
import { socket } from "./socket";
import { Context } from "./utils/Context";
import { useNavigate } from "react-router-dom";

export default function CreateWaiting() {
    const [participants, setParticipants] = useState(null);
    const {count,room,type}= useContext(Context)
    const navigate = useNavigate()

    const startclicked = ()=>{
        alert("chil")
        socket.emit("start",{count,room,type})
        navigate('/creator')
    }
    socket.on("anotheruser", (data) => {
        console.log(data);
        setParticipants(data);
        console.log("createwaiting anotheruser")
    });
    socket.on("userlist",(data)=>{
        console.log(data)
        setParticipants(data)
    })
    useEffect(()=>{
        socket.emit("getroomuser",room)
    },[])
    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
            {
                participants && participants.map((data, index) => (
                    <div key={index}>
                        <img src={data.image} alt="" className="w-12 bg-black h-12 rounded-full" />
                    </div>
                ))
            }
            <button className="text-whitetext bg-blue-500" onClick={startclicked}>START QUIZ</button>
        </div>
    );
}
