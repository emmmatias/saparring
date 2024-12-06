import React, { useState, useEffect, useRef } from 'react';

function RecordOrWrite() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isMicAvailable, setIsMicAvailable] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    // Verifica si hay un micrófono disponible
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setIsMicAvailable(true))
      .catch(() => setIsMicAvailable(false));
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    const chunks = [];
    mediaRecorderRef.current.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioBlob(blob);
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

    if (audioBlob) {
      formData.append('file', audioBlob, 'recorded_audio.webm');
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
    <div>
      {isMicAvailable ? (
        <div>
          <button onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          {audioBlob && <p>Recording ready for submission.</p>}
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