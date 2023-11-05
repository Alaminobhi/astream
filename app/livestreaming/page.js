"use client"

import React, { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
var socket
  socket = io("http://localhost:3001");

const Page = () => {

    const total = Date.parse(new Date());
      console.log(total);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    const second = Math.floor((total / 1000) % 60);

    // console.log(hours, minutes, seconds);

  const myVideo = useRef(null);
  const [screenToCamera, setScreenToCamera] = useState(false); 
  const [stream, setStream] = useState(null);

    // const [date, setDate] = useState('');
    // const [presente, setPresente] = useState('');
    // const [taka, setTaka] = useState('');
    // const [vara, setVara] = useState('');

    // const data = {date, presente, taka, vara};
   
    
    /* Create a reference to the video element,  
    which helps in storing continous video stream  
    irespective of multiple renders. */
    const screenRecording = useRef(null); 
  
    const [Recorder, setRecorder] = useState(null); 
    const [displayMedia, setDisplayMedia] = useState(null); 
    const startScreenRecording = async () => { 
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
            audio: true, video: true
        }); 
        // socket.emit('start-stream', stream);
        myVideo.current.srcObject = stream;
        const recorder = new MediaRecorder(stream); 
        setRecorder(recorder); 
        setDisplayMedia(stream.getVideoTracks()[0]); 
        const screenRecordingChunks = []; 
        recorder.ondataavailable = (e) => { 
            if (e.data.size > 0) { 
                screenRecordingChunks.push(e.data); 
                // socket.emit('start-stream', e.data);
            } 
            socket.emit('start-stream', e.data);
        } 
        recorder.onstop = () => { 
            //onstop event of media recorder  
            const blob = new Blob(screenRecordingChunks, 
                { type: 'video/webm' }); 
            const url = URL.createObjectURL(blob); 
            screenRecording.current.src = url; 
            socket.emit('start-stream', blob);
            if (displayMedia) { 
                displayMedia.stop(); 
            } 
        } 
        //Start the recording. 
        recorder.start(); 
    } 
    // Style the Button 
    const ButtonStyle = { 
        backgroundColor: 'green', 
        color: 'white', 
        fontSize: '2em', 
    }; 
    socket.on('start-stream', (data)=>{
      console.log('hiughuiyytuyguytg', data);
    });


    const startstream = async () => {
      // const recorder2 = new MediaRecorder(Recorder); 

      // recorder.ondataavailable = (e) => { 
      //   if (e.data.size > 0) { 
      //     socket.emit('start-stream', e.data);
          
      //   }
      // }
      // socket.emit('start-stream2', 'kkk');
      socket.emit('start-stream', 'hhhh');
      alert('live start');
      }

        // useEffect(() => {
        //   camera()
        // }, [])
      
        async function screen() {
          const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
          myVideo.current.srcObject = stream;
          setStream(stream);
          setScreenToCamera(true)
          
        }
      
        async function camera() {
          setScreenToCamera(false)
         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
         myVideo.current.srcObject = stream;
         setStream(stream);
         
         
        }
      
      
    return (
        <div>
            
            <div>
            <button style={ButtonStyle} onClick={() =>  
                           startScreenRecording()}> 
                Start Recording 
            </button> 
            </div>
           <div>
           <button style={ButtonStyle} onClick={() =>  
                          { Recorder && Recorder.stop() }}> 
                Stop Recording 
            </button></div> 
            <br />
            <video ref={screenRecording}  
                   height={300}  
                   width={600} controls /> 
                   <br/> <br/>
             <video ref={myVideo}  
                   height={300}  
                   width={600} controls autoPlay playsInline />
                   <br/>
          {
            screenToCamera === false ? <p> <button onClick={screen}> Screen </button> </p> : <p> <button onClick={camera}> Camera </button> </p>
          }
          <br/>
          <button onClick={startstream}> Live Streaming Start </button>

{/* <div className="row">
              <p className="col"><input 
                placeholder="তারিখ"
                type="text" 
                value={date} 
                required
                onChange={(e) => setDate(e.target.value)}
                /></p>
              <p className="col"><select name={presente} placeholder="হাজিরা" required onChange={(e) => setPresente(e.target.value)}>
                <option value="A">No presente</option>
                <option value="P">Presente</option>
                <option value="P2">P2</option>
                <option value="P.5">P.5</option>
                <option value="P1.5">P1.5</option>
                <option value="P3">P3</option>
                </select></p>
              <p className="col"><input 
                placeholder="টাকা"
                type="text" 
                value={taka} 
                required
                onChange={(e) => setTaka(e.target.value)}
                /></p>
              <p className="col"><input 
                placeholder="ভারা টাকা"
                type="text" 
                value={vara} 
                required
                onChange={(e) => setVara(e.target.value)}
                /></p>
              <p className="col"><button className="btn btn-success" onClick={handleSubmit}>Add Hisab</button></p>
            </div> */}
            
        </div>
    );
};

export default Page;