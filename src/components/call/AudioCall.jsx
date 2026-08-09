import React, { useEffect, useRef, useState } from "react";
import "./Call.css";
import { io } from "socket.io-client";

const socket = io("http://192.168.43.245:5000");

function AudioCall({
  userName,
  userId,
  profilePic,
  incoming,
  visible,
  onEnd,
}) {

  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const ringtoneRef = useRef(null);

  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const [callTime, setCallTime] = useState(0);
  const [callConnected, setCallConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [networkStatus, setNetworkStatus] = useState("🟢 Excellent");


  useEffect(() => {

    if(incoming && visible){

      ringtoneRef.current
      ?.play()
      .catch(err =>
        console.log("Ringtone error", err)
      );

    }else{

      if(ringtoneRef.current){

        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;

      }

    }

  },[incoming,visible]);



  const createPeerConnection = ()=>{

    const peer =
      new RTCPeerConnection();


    peer.ontrack = (event)=>{

      if(remoteAudioRef.current){

        remoteAudioRef.current.srcObject =
        event.streams[0];

        remoteAudioRef.current.play()
        .catch(()=>{});

      }

    };


    peer.onicecandidate=(event)=>{

      if(event.candidate){

        socket.emit(
          "ice-candidate",
          {
            candidate:event.candidate,
            to:userId,
          }
        );

      }

    };


    peerConnectionRef.current = peer;


    if(localStreamRef.current){

      localStreamRef.current
      .getTracks()
      .forEach(track=>{

        peer.addTrack(
          track,
          localStreamRef.current
        );

      });

    }


    return peer;

  };



  const createOffer = async()=>{

    const peer =
    peerConnectionRef.current;

    if(!peer) return;


    const offer =
    await peer.createOffer();


    await peer.setLocalDescription(
      offer
    );


    socket.emit(
      "call-offer",
      {
        offer,
        to:userId,
      }
    );

  };



  const toggleMic = ()=>{

    if(!localStreamRef.current)
      return;


    localStreamRef.current
    .getAudioTracks()
    .forEach(track=>{

      track.enabled =
      !track.enabled;

    });


    setMicOn(prev=>!prev);

  };



  const toggleSpeaker = ()=>{

    if(!remoteAudioRef.current)
      return;


    remoteAudioRef.current.muted =
    !remoteAudioRef.current.muted;


    setSpeakerOn(prev=>!prev);

  };
  useEffect(()=>{

    if(!visible) return;

    let stream;


    socket.on("offer-received",async(data)=>{

      const peer =
      peerConnectionRef.current;

      if(!peer) return;


      await peer.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );


      const answer =
      await peer.createAnswer();


      await peer.setLocalDescription(answer);


      socket.emit(
        "call-answer",
        {
          answer,
          to:data.from,
        }
      );


      setCallConnected(true);

    });



    socket.on("answer-received",async(data)=>{

      const peer =
      peerConnectionRef.current;

      if(!peer) return;


      await peer.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );


      setCallConnected(true);

    });



    socket.on("ice-candidate-received",async(data)=>{

      if(peerConnectionRef.current){

        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );

      }

    });



    socket.on("call-accepted",()=>{

      setCallConnected(true);

    });



    socket.on("call-rejected",()=>{

      stopCall();
      onEnd();

    });



    socket.on("call-ended",()=>{

      stopCall();
      onEnd();

    });



    const startAudio = async()=>{

      try{

        stream =
        await navigator.mediaDevices.getUserMedia({
          audio:true,
          video:false,
        });


        localStreamRef.current =
        stream;


        createPeerConnection();

        createOffer();


      }catch(error){

        console.error(
          "Mic Permission Error:",
          error
        );

      }

    };


    startAudio();



    return ()=>{

      socket.off("offer-received");
      socket.off("answer-received");
      socket.off("ice-candidate-received");
      socket.off("call-accepted");
      socket.off("call-rejected");
      socket.off("call-ended");


      stopCall();

    };


  },[visible]);



  const stopCall=()=>{

    if(ringtoneRef.current){

      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime=0;

    }


    if(localStreamRef.current){

      localStreamRef.current
      .getTracks()
      .forEach(track=>{
        track.stop();
      });

    }


    if(peerConnectionRef.current){

      peerConnectionRef.current.close();

      peerConnectionRef.current=null;

    }

  };



  useEffect(()=>{

    if(!visible || !callConnected)
      return;


    const timer =
    setInterval(()=>{

      setCallTime(prev=>prev+1);

    },1000);


    return ()=>clearInterval(timer);


  },[visible,callConnected]);



  if(!visible)
    return null;



  return(

    <div className="incoming-call-overlay">

      <div className="incoming-call-box">


        <audio
          ref={ringtoneRef}
          src="/ringtone.mp3"
          loop
        />


        <audio
          ref={localAudioRef}
          autoPlay
          muted
        />


        <audio
          ref={remoteAudioRef}
          autoPlay
        />



        <h2>📞 Audio Call</h2>


        <img
          src={
            profilePic
            ? `http://192.168.43.245:5000${profilePic}`
            : "/default-profile.png"
          }
          className="audio-profile-pic"
          alt="profile"
        />


        <h3>{userName}</h3>


        <p>
          {String(
            Math.floor(callTime/60)
          ).padStart(2,"0")}
          :
          {String(
            callTime%60
          ).padStart(2,"0")}
        </p>


        <p>{networkStatus}</p>


        {incoming && (

          <div className="call-action-buttons">

            <button
              className="accept-btn"
              onClick={()=>{

                ringtoneRef.current.pause();

                socket.emit(
                  "accept-call",
                  {
                    to:userId
                  }
                );

              }}
            >
              📞 Accept
            </button>


            <button
              className="reject-btn"
              onClick={()=>{

                stopCall();

                socket.emit(
                  "reject-call",
                  {
                    to:userId
                  }
                );

                onEnd();

              }}
            >
              ❌ Reject
            </button>

          </div>

        )}



        <div className="call-controls">


          <button onClick={toggleMic}>
            {micOn ? "🎤" : "🔇"}
          </button>


          <button onClick={toggleSpeaker}>
            {speakerOn ? "🔊" : "🔇"}
          </button>



          <button
            onClick={()=>{

              stopCall();

              socket.emit(
                "end-call",
                {
                  to:userId
                }
              );

              onEnd();

            }}
          >
            ❌ End Call
          </button>


        </div>


      </div>

    </div>

  );

}


export default AudioCall;