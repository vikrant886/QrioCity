import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dash from "./components/dash";
import Home from "./components/Home";
import { Context } from "./components/utils/Context";
import CreateWaiting from "./components/createwaiting";
import Waiting from "./components/waiting";
import Creator from "./components/creator";
import Quiz from "./components/quiz";

function App() {
  const [theme,setTheme] = useState("light")
  const [userdata,setUserdata] = useState(null)
  const [participants , setParticipants] = useState(null)
  const [room,setRoom] = useState(null)
  const [count,setCount] = useState(0);
  const [question, setQuestion] = useState(null)
  const [type,setType] = useState(null)

  return (
    <Context.Provider value={{theme,setTheme,userdata,setUserdata,type,setType,participants,setParticipants,room,setRoom,count,setCount,question,setQuestion}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dash" element={<Dash/>}/>
          <Route path="/create" element={<CreateWaiting/>}/>
          <Route path="/waiting" element={<Waiting/>}/>
          <Route path="/creator" element={<Creator/>}/>
          <Route path="/quiz" element={<Quiz/>}/>
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App;
