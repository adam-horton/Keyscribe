import React, { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { SessionWrapper, InfoWrapper, ParticipantsWrapper, ColumnWrapper, LeaveContainer, RedCircle, RecordWrapper, Counter, CardButtonWrapper } from './Session.styled';
import { colors, NavBar, NavHeaderText, Button, Card, FormField, Input } from '../../App.styled';

const apiURL = process.env.REACT_APP_BACKEND_URL;

const Session = () => {

   const navigate = useNavigate();
   const [isRecording, setRecording] = useState(false);
   const [timer, setTimer] = useState(0);
   const [board, setBoard] = useState({ id: '', name: '' });
   const [user, setUser] = useState({username: '', user_id: ''});
   const [sessionId, setSessionId] = useState('');
   const [showFileCard, setShowFileCard] = useState(false);
   const [fileName, setFileName] = useState('');
   const [recId, setRecId] = useState();
   const [role, setRole] = useState('');

   const handleLeave = async() => {
      if (role == 'teacher') {
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
      else if (role == 'student') {
         try {
            const response = await fetch(`${apiURL}/session/leave/${board.id}`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
               },
            });
            if (!response.ok) {
               const errorMessage = await response.text();
               throw new Error(errorMessage);
            }
            navigate('/welcome');
         } catch (error) {
            console.error("Error leaving session:", error);
         }
      }
   }

   const startRecord = async() => {
      try {
         const response = await fetch(`${apiURL}/startRecording/${board.id}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: board.name}),
         });
         if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
         }
         setRecording(true);
         console.log("Recording...");
      } catch (error) {
         console.error("Error starting recording:", error);
      }
   }

   const openFileCard = async() => {
      setRecording(false);
      setShowFileCard(true);
   }

   const closeFileCard = async() => {
      setShowFileCard(false);
      stopRecord();
   }

   const stopRecord = async() => {
      try {
         const response = await fetch(`${apiURL}/stopRecording/${board.id}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               boardId: board.id,
               userId: user.user_id,
               name: fileName,
            }),
         });
         if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
         }
         const data = await response.json();
         setRecId(data.recordingId);
      } catch (error) {
         console.error("Error stopping recording:", error);
      }
   }

   useEffect(() => {
      // Triggered when recId is updated to be able to fetch the file from the backend to download
      const fetchData = async () => {
         try {
            const response = await fetch(`${apiURL}/recording/${recId}/${user.user_id}`, {
            // const response = await fetch(`${apiURL}/recording/87004730/${user.user_id}`, {
               method: 'GET',
               credentials: 'include',
            });
            if (response.ok) {
               const blob = await response.blob();
               const midiBlob = new Blob([blob], { type: 'audio/midi' });
               const url = window.URL.createObjectURL(midiBlob);
               const a = document.createElement('a');
               a.href = url;
               a.download = fileName + '.midi';
               document.body.appendChild(a);
               a.click();
               document.body.removeChild(a);
               window.URL.revokeObjectURL(url);
            } else {
               console.error("Error:", response.status);
            }
         } catch(error) {
            console.error("Error getting recording: ", error);
         }
      };
      if (recId && (user.user_id !== '')) {
         console.log("Done Recording", recId);
         fetchData();
      }
   }, [recId]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const responseBoard = await fetch(`${apiURL}/getActiveKeyboard`, {
               method: 'GET',
               credentials: 'include',
            });
            const dataBoard = await responseBoard.json();
            setBoard(dataBoard);
         
            const responseID = await fetch(`${apiURL}/getSessionId/${dataBoard.id}`, {
               method: 'GET',
               credentials: 'include',
            });
            const dataID = await responseID.json();
            setSessionId(dataID);

            const responseUser = await fetch(`${apiURL}/getUserInfo`, {
               method: 'GET',
               credentials: 'include',
            });
            const dataUser = await responseUser.json();
            setUser(dataUser);

            const responseRole = await fetch(`${apiURL}/getRole`, {
               method: 'GET',
               credentials: 'include',
            });
            const dataRole = await responseRole.json();
            setRole(dataRole);

         } catch(error) {
            console.error("Error fetching data: ", error);
         }
      };
      fetchData();

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
               <Button bg={colors.med_bg} txt={colors.dark_txt} hbg={colors.light_hover} onClick={handleLeave} disabled={showFileCard}>Leave Session</Button>
            </LeaveContainer>
         </NavBar>
         <ColumnWrapper>
            <InfoWrapper>
               <h2>Invite Code: {sessionId}</h2>
               <h3>Active Board: {board.name}</h3>
            </InfoWrapper>
            {/* <ParticipantsWrapper>
               <h2>Participants:</h2>
            </ParticipantsWrapper> */}
            <RecordWrapper>
               {isRecording && (<RedCircle></RedCircle>)}
               {isRecording && (<Counter>{formatTime(timer)}</Counter>)}
               <Button type='button' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} disabled={showFileCard}
                  onClick={isRecording ? openFileCard : startRecord}>
                     {isRecording ? 'Stop Recording' : 'Start Recording'}
               </Button>
            </RecordWrapper>
         </ColumnWrapper>
         {showFileCard && (
            <Card bg={colors.med_bg} w='25%' h='30%'>
               <h2>Name Your MIDI File:</h2>
               <FormField>
                  <Input
                     type="text" 
                     name="fileName"
                     placeholder="MyFile"
                     value={fileName}
                     onChange={(e) => setFileName(e.target.value)}
                  />
               </FormField>
               <CardButtonWrapper>
                  <Button top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={closeFileCard}>Confirm</Button>
               </CardButtonWrapper>
            </Card>
         )}
      </SessionWrapper>
   );
   
};

Session.propTypes = {};

Session.defaultProps = {};

export default Session;
