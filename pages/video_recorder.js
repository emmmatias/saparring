import React, { useState, useEffect } from 'react';

const VideoCapture = () => {
  const [stream, setStream] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
      });
  }, []);

  const handleCapture = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
        setChunks(chunks);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideo(blob);
      };

      mediaRecorder.start();
      setGrabando(true);
    }
  };

  const handlePause = () => {
    if (mediaRecorder) {
      mediaRecorder.pause();
      setGrabando(false);
    }
  };

  const handleResume = () => {
    if (mediaRecorder) {
      mediaRecorder.resume();
      setGrabando(true);
    }
  };

  const handleStop = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setGrabando(false);
    }
  };

  const handleUpload = () => {
    // Código para subir el video a la API
  };

  return (
    <div>
      <h1>Capturar video</h1>
      {stream ? (
        <video autoPlay muted ref={(videoRef) => {
          if (videoRef) {
            videoRef.srcObject = stream;
          }
        }} />
      ) : (
        <p>Cargando...</p>
      )}
      <button onClick={handleCapture}>Comenzar grabación</button>
      {grabando ? (
        <button onClick={handlePause}>Pausar</button>
      ) : (
        <button onClick={handleResume}>Reanudar</button>
      )}
      <button onClick={handleStop}>Detener</button>
      {video ? (
        <div>
          <video autoPlay muted src={URL.createObjectURL(video)} />
          <button onClick={handleUpload}>
            {loading ? 'Subiendo...' : 'Subir video'}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default VideoCapture;