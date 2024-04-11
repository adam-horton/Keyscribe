import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SessionWrapper, InfoWrapper, ParticipantsWrapper, ColumnWrapper, LeaveContainer, RedCircle, RecordWrapper, Counter } from './Session.styled';
import { colors, NavBar, NavHeaderText, Button } from '../../App.styled';

const apiURL = process.env.REACT_APP_BACKEND_URL;

const Session = () => {

   const navigate = useNavigate();
   const [isRecording, setRecording] = useState(false);
   const [timer, setTimer] = useState(0);
   const [board, setBoard] = useState({ id: '', name: '' });
   const [sessionId, setSessionId] = useState('');

   const handleLeave = async() => {
      try {
         const response = await fetch(`${apiURL}/session/close`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({sessionId: sessionId}), 
         });
         if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
         }
         navigate('/welcome');
      } catch (error) {
         console.error("Error ending session:", error);
      }
   }

   const startRecord = () => {
      setRecording(true);
      console.log("Recording...");
   }

   const stopRecord = () => {
      setRecording(false);
      console.log("Done Recording");
   }

   useEffect(() => {
      fetch(`${apiURL}/getActiveKeyboard`)
         .then((response) => response.json())
         .then((data) => { 
            setBoard(data);
            return fetch(`${apiURL}/getSessionId?boardId=${data.id}`, {
               method: 'GET',
               credentials: 'include',
               headers: {
               'Content-Type': 'application/json',
               }
            })
         })
         .then((response) => response.json())
         .then((data) => setSessionId(data))
         .catch((err) => console.error("Error getting active keyboard: ", err));

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
  
   const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
      return `${formattedMinutes}:${formattedSeconds}`;
  };

   return (
      <SessionWrapper data-testid="Session">
         <NavBar>
            <NavHeaderText>Session in Progress</NavHeaderText>
            <LeaveContainer>
               <Button bg={colors.med_bg} txt={colors.dark_txt} hbg={colors.light_hover} onClick={handleLeave}>Leave Session</Button>
            </LeaveContainer>
         </NavBar>
         <ColumnWrapper>
            <InfoWrapper>
               <h2>Invite Code: {sessionId}</h2>
               <h3>Active Board: {board.name}</h3>
            </InfoWrapper>
            <ParticipantsWrapper>
               <h2>Participants:</h2>
            </ParticipantsWrapper>
            <RecordWrapper>
               {isRecording && (<RedCircle></RedCircle>)}
               {isRecording && (<Counter>{formatTime(timer)}</Counter>)}
               <Button type='button' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} 
                  onClick={isRecording ? stopRecord : startRecord}>
                     {isRecording ? 'Stop Recording' : 'Start Recording'}
               </Button>
            </RecordWrapper>
         </ColumnWrapper>
      </SessionWrapper>
   );
   
};

Session.propTypes = {};

Session.defaultProps = {};

export default Session;
