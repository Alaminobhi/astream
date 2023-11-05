const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const spawn = require('child_process').spawn;
const fs = require('fs');

const ffmpegPath = require('ffmpeg-static');

const httpServer = http.createServer(app);
const path = require('path');

 

const io = new Server(httpServer, {
  cors: {
    origin: '*', // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(cors());

const { createLiveStream, readOrder } = require("./routers/liveHandeler")(io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on('start-stream2', () =>{
    // const inputFilePath = path.resolve(__dirname, '/public/ll.mp4');
    const filePath = path.join(__dirname, '/videos/ok.mp4');

    const url ='rtmps://live-api-s.facebook.com:443/rtmp/FB-228981170194527-0-Abziph7CyknZ5MzS'

     const ffmpegProcess = spawn(ffmpegPath, ['-stream_loop', '-1', '-re', '-i', filePath, 
        '-c', 'copy',
        '-f', 'flv', url,]);

        ffmpegProcess.stdout.on('data', (data) => {
              console.log("fhuhuh", data.toString());
              
            });
        ffmpegProcess.stderr.on('data', (data) => {
          
              console.log(data.toString());
            });
        ffmpegProcess.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });
        // Handle errors
        ffmpegProcess.on('error', (err) => {
            console.error(`Error spawning ffmpeg: ${err}`);
        });

  });


   //stream
  socket.on('start-stream', createLiveStream);

  //stop stream
  socket.on('stop-stream', () => {
    console.log('Stop streaming event received');

    // Stop the FFmpeg process or take necessary actions to stop streaming
    console.log('kill: SIGINT')
    ffmpegProcess.kill('SIGINT')
    // Send a confirmation message to the client
    socket.emit('stream-stopped', 'Live stream has stopped');
  });

  socket.on("send_msg", (data) => {
    console.log(data, "DATA");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("receive_msg", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || "https://astream-live.vercel.app" || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});