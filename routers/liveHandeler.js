module.exports = (io,socket) => {
  const spawn = require('child_process').spawn;

  const ffmpegPath = require('ffmpeg-static');

  const path = require('path');

    const createLiveStream = async function (payload) {

    //   const socket = this; // hence the 'function' above, as an arrow function will not work
   try {
    console.log(payload);
    const filePath = path.join(__dirname, '../videos/ok.mp4');

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
  


    // Send a confirmation message to the client
    // socket.emit('start-stream', 'Live stream has started');
    

   } catch (error) {
     console.log(error);
   }

    
      
    };
  
    const readOrder = function (orderId, callback) {
      // ...
      console.log('ii');
    };
  
    return {
        createLiveStream,
      readOrder
    }
  }