import { SignInButton, SignOutButton, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./utils/Context";
import { Lightbulb } from "lucide-react";

export default function Homeheader() {
    const [avatar, setAvatar] = useState(false)
    const { theme, setTheme } = useContext(Context)

    const navigate = useNavigate();


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

    const handlethemeswitch = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className=" bg-transparent pr-8 p-4 flex gap-8 justify-end items-center w-full">
            <button className="p-4 rounded-full w-12 h-12 overflow-hidden flex justify-center items-center dark:shadow-sm dark:shadow-white" onClick={handlethemeswitch}>
                <Lightbulb className=" w-40 h-40 dark:text-yellow-600" />
            </button>
            <SignedOut>
                <SignInButton afterSignInUrl="http://localhost:3000/dash"><button className="p-[6px] hover:text-blue-500 text-whitetext font-bold text-base">DASHBOARD</button></SignInButton>
                <SignInButton className=" w-12 h-12 rounded-full cursor-pointer" >
                    <img
                        src="https://image.freepik.com/free-vector/cute-elephant-cartoon_33070-2365.jpg"
                        className="w-12 h-12 rounded-full cursor-pointer border p-1"
                        alt=""
                        onClick={() => { avatar ? setAvatar(false) : setAvatar(true) }}
                    />
                </SignInButton>
            </SignedOut>
            
            <SignedIn>
                <button className="p-[6px] hover:text-blue-500 text-whitetext font-bold text-base" onClick={() => { navigate('/dash') }}>DASHBOARD</button>
                <UserButton afterSignOutUrl={window.location.href} />
            </SignedIn>
            

        </div>


    );
}
