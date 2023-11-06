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

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get('/video-live', function(req, res){
  
  const range = req.headers.range;
  if(!range){
      res.status(400).send("Requires Range header");
  }
  const video = 'https://www.youtube.com/watch?v=RLzC55ai0eo'; 
  const videoPath = "./videos/ok.mp4";
  
  const videoSize = fs.statSync(videoPath).size;
  // console.log("size of video is:", videoSize);
  const CHUNK_SIZE = 10**6; //1 MB
  const start = Number(range.replace(/\D/g, "")); 
  const end = Math.min(start + CHUNK_SIZE , videoSize-1);
  const contentLength = end-start+1;
  const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": 'bytes',
      "Content-Length": contentLength,
      "Content-Type": "video/mp4"
  }
  res.writeHead(206,headers);
  const videoStream = fs.createReadStream(videoPath, {start, end});
  videoStream.pipe(res);

});

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


app.post('/added-stream', async (req, res) => {
  console.log(req.body);

  try {
    const filePath = path.join(__dirname, './videos/ok.mp4');

    const url ='rtmps://live-api-s.facebook.com:443/rtmp/FB-231542346605076-0-AbyE4AmCXITp4eKd';
    const url1 ='FB-231542346605076-0-AbyE4AmCXITp4eKd';


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
  
   } catch (error) {
     console.log(error);
   }

  });

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});