import React, { useContext, useEffect, useState } from "react";
import { socket } from "./socket";
import { Context } from "./utils/Context";
import { useNavigate } from "react-router-dom";

export default function Waiting() {
    const { participants, setParticipants } = useContext(Context)
    const navigate = useNavigate()

    socket.on("starting", (data) => {
        console.log("startted")
        navigate('/quiz')
    })

    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
            {
                participants && participants.map((data, index) => (
                    <div key={index}>
                        <img src={data.image} alt="" className="w-12 bg-black h-12 rounded-full" />
                    </div>
                ))
            }
        </div>
    );
}
