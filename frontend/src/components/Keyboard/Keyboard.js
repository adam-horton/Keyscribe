import React, { useState, useEffect } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import { KeyboardWrapper } from './Keyboard.styled';
import Button from '@mui/material/Button';
import MidiWriter from 'midi-writer-js';
import 'react-piano/dist/styles.css';

const apiURL = process.env.REACT_APP_BACKEND_URL;

const sendRequest = (note, state) => {
    fetch(`${apiURL}/led`, {
        method: 'POST',
        //mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: note, state: state }),
    })
    .then((response) => {
        if (response.ok) {
            console.log(`Successfully turned on ${note} LED.`);
            console.log(response.body.toString());
        } else {
            //console.error(`Failed to turn on ${color} LED.`);
            console.log(response.body);
        }
    })
    .catch((error) => {
        console.error(`Error: ${error}`);
    });
}

const handleMouseDown = (midiNumber) => {
    sendRequest(midiNumber.toString(), '0')
}

const handleMouseUp = (midiNumber) => {
    sendRequest(midiNumber.toString(), '1')
}

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
};

const Keyboard = () => {
 const firstNote = MidiNumbers.fromNote('c3');
 const lastNote = MidiNumbers.fromNote('f3');
 const keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: firstNote,
      lastNote: lastNote,
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
 });
 const [isRecording, setRecording] = useState(false);
 const [timer, setTimer] = useState(0);

 useEffect(() => {
    let interval;

    if (isRecording) {
        interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
    } else {
        clearInterval(interval);
        setTimer(0);
    }

    return () => clearInterval(interval);
}, [isRecording]);

 const startRecording = () => {
    setRecording(true);
    console.log("Recording...");

    // Send message to Pi telling it to start storing data
 }

 const stopRecording = () => {
    setRecording(false);
    console.log("Done Recording");

    // Receive note information from Pi to create MIDI file

    // Create new MIDI track
    const track = new MidiWriter.Track();
    const note = new MidiWriter.NoteEvent({pitch: ['C4', 'E4', 'G4'], duration: '2'});
    track.addEvent(note);

    // Generate a data URI
    const write = new MidiWriter.Writer(track);
    const dataUri = write.dataUri();

    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'generated_midi_file.mid'; // Default file name
    link.click();
 }

 return (
    <KeyboardWrapper data-testid="Keyboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

    {isRecording && (
         <div style={{ position: 'absolute', top: -175, left: -320, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <div style={{ width: '25px', height: '25px', backgroundColor: 'red', borderRadius: '50%' }}></div>
     </div>
    )}

    {isRecording && (
         <div style={{ position: 'absolute', top: 150, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <p>Time Passed - {formatTime(timer)}</p>

     </div>
    )}  

    {(!isRecording && timer > 0) ? (
                 <div style={{ position: 'absolute', top: 25, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Recording stopped. Total time: {formatTime(timer)}</p>
                </div>
            ) : null}

    <Button onClick={startRecording} variant="contained" style={{ textTransform: 'none' }} disabled={isRecording}>Start Recording</Button>
    <div class="piano-container">
        
        {/* <div onClick={() => sendRequest('green')} class="piano-key white" id="greenButton">Green</div>
        <div class="piano-key black" id="blackButton1">Black</div>
        <div onMouseDown={() => sendRequest("27", "0")} onMouseUp={() => sendRequest("27", "1")} class="piano-key white" id="redButton">Red</div>
        <div class="piano-key black" id="blackButton2">Black</div>
        <div onMouseDown={() => sendRequest("10", "0")} onMouseUp={() => sendRequest("10", "1")} class="piano-key white" id="yellowButton">Yellow</div>
        <div class="piano-key black" id="blackButton3">Black</div>
         <div onClick={() => sendRequest('blue')} class="piano-key white" id="blueButton">Blue</div> */ }
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber) => {
            // Play a given note - see notes below
            handleMouseDown(midiNumber)
          }}
          stopNote={(midiNumber) => {
            // Stop playing a given note - see notes below
            handleMouseUp(midiNumber)
          }}
          width={500}
          keyboardShortcuts={keyboardShortcuts}
        />
    </div>

    <Button onClick={stopRecording} variant="contained" style={{ textTransform: 'none' }} disabled={!isRecording}>Stop Recording</Button>
    </KeyboardWrapper>
 );
 };

// Keyboard.propTypes = {};

// Keyboard.defaultProps = {};

export default Keyboard;
