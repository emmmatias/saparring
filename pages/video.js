import React, { useState, useEffect, useRef } from 'react';

function RecordOrWrite() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isMediaAvailable, setIsMediaAvailable] = useState({ audio: false, video: false });
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    // Verifica si hay un micrófono y/o cámara disponible
    const checkMediaAvailability = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsMediaAvailable(prevState => ({ ...prevState, audio: true }));
        audioStream.getTracks().forEach(track => track.stop()); // Detenemos el stream inmediatamente
      } catch {
        setIsMediaAvailable(prevState => ({ ...prevState, audio: false }));
      }

      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setIsMediaAvailable(prevState => ({ ...prevState, video: true }));
        videoStream.getTracks().forEach(track => track.stop()); // Detenemos el stream inmediatamente
      } catch {
        setIsMediaAvailable(prevState => ({ ...prevState, video: false }));
      }
    };

    checkMediaAvailability();
  }, []);

  const startRecording = async () => {
    // Eliminar la grabación anterior al comenzar una nueva grabación
    if (mediaBlob) {
      setMediaBlob(null);
    }

    const constraints = {
      audio: isMediaAvailable.audio,
      video: isMediaAvailable.video,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    mediaRecorderRef.current = new MediaRecorder(stream);

    const chunks = [];
    mediaRecorderRef.current.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: isMediaAvailable.video ? 'video/webm' : 'audio/webm' });
      setMediaBlob(blob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    if (mediaBlob) {
      formData.append('file', mediaBlob, isMediaAvailable.video ? 'recorded_video.webm' : 'recorded_audio.webm');
    } else {
      formData.append('text', textInput);
    }

    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error saving data');
      }

      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  return (
    <div className='div'>
      {isMediaAvailable.audio || isMediaAvailable.video ? (
        <div>
          <button onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          {mediaBlob && (
            <div>
              <p>Recording ready for submission.</p>
              <audio controls={isMediaAvailable.audio}>
                <source src={URL.createObjectURL(mediaBlob)} type={isMediaAvailable.video ? 'video/webm' : 'audio/webm'} />
                Your browser does not support the media element.
              </audio>
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Write your text here"
          />
        </div>
      )}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default RecordOrWrite; 