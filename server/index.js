const http = require("http");
const cors = require("cors");
const socketIo = require('socket.io');
const express = require("express");
const mongoose = require("mongoose");
const { buffer } = require("micro");
const bodyParser = require('body-parser');
const { Webhook, WebhookRequiredHeaders } = require('svix');
const user = require("./models/user");
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.raw({ type: 'application/json' }));

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_KEY;
if (!webhookSecret) {
  console.error("You need a WEBHOOK_SECRET in your .env");
  process.exit(1);
}

app.get("/hello", (req, res) => {
  res.send("hello");
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const roommap = new Map();

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

const roomUsers = {};
let questions;
let options;
let ansArray;
const roomClocks = {};
let quesIndex = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function updateClock(room, socket) {
  roomClocks[room].time--;

  if (roomClocks[room].time <= 0) {
    if (roomClocks[room].time === 0) {
      console.log(ansArray)
      console.log(roommap.get(room))
      io.to(room).emit("res", {ansArray,room})
    }
    stopClock(room);
  }
  console.log(roomClocks[room].time)
  io.to(room).emit("time", roomClocks[room].time);
}

function startClock(room, socket) {
  const intervalId = setInterval(() => {
    updateClock(room, socket);
  }, 1000);

  roomClocks[room] = {
    time: 30,
    intervalId,
  };
}

function stopClock(room) {
  clearInterval(roomClocks[room].intervalId);
}

function start(room) {
  console.log(room);
  const data = questions[quesIndex];
  console.log(data)
  quesIndex++;
  const options = [...data.incorrect_answers, data.correct_answer].map((option, index) => ({ option, index }));
  ansArray = new Array(options.length).fill(0);
  shuffleArray(options);
  console.log(data)
  io.to(room).emit("question", { questions: data.question, options: options ,correct:data.correct_answer });
  startClock(room);
}

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("nextquestion",(data)=>{
    if(quesIndex<questions.length){
      console.log(data)
      console.log("t")
      start(data)
    }
    else{
      io.to(data).emit("ended","congrats ended")
    }
  })

  socket.on("answers", (data) => {
    ansArray[data]++;
    console.log(data);
  })

  socket.on("joinclicked", (data) => {
    socket.join(data.code);

    if (!roomUsers[data.code]) {
      socket.emit("wrong code", "wrongcode");
    } else {
      roomUsers[data.code].push({ username: data.username, image: data.image });
      io.to(data.code).emit("anotheruser", roomUsers[data.code]);
    }
  });

  socket.on("create", (data) => {
    console.log(`${socket.id} created room: ${data.quizname}`);
    if (!roomUsers[data.quizname]) {
      roomUsers[data.quizname] = [];
    }
    socket.join(data.quizname);
    socket.emit("createdRoom", `You have created room: ${data.quizname}`);
  });

  socket.on("endquiz",(data)=>{
    console.log("end quiz called",data)
    stopClock(data)
    io.to(data).emit("ended","congrats ended")
    roomClocks[data]=[]
  })

  socket.on("start", (data) => {
    console.log(data.type)
    quesIndex=0
    roommap.set(data.room, socket.id)
    const count = data.count;
    const apiUrl = 'https://opentdb.com/api.php?amount=' + count + '&category=' +data.type;
    console.log(data)

    axios.get(apiUrl)
      .then(response => {
        questions = response.data.results;
        socket.to(data.room).emit("starting", "starting");
        start(data.room, socket)
        console.log(questions)
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
      });
  })

  socket.on("getroomuser", (data) => {
    socket.emit("userlist", roomUsers[data])
  })
});


app.post('/getuser', async (req, res) => {
  console.log(req.body);
  const userdata = await user.findOne(req.body)
  res.json({ message: "userdata", userdata })
})

app.post("/user", async (req, res) => {

  if (req.body.type === "user.created") {
    const data = new user({
      username: req.body.data.username,
      first: req.body.data.first_name,
      last: req.body.data.last_name,
      image: req.body.data.image_url,
    })
    try {
      const result = await data.save();
      console.log(result);
      io.emit("usercreated", { message: "user created", result });
      res.json({ message: "user created", result });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
