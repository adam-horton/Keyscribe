import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import PropTypes from 'prop-types';
import { SettingsWrapper, ListWrapper, BoardNameWrapper } from './Settings.styled';
import { colors, NavBar, Button, Input, FormField, NavHeaderText, Card, CardButtonWrapper } from '../../App.styled';

const apiURL = process.env.REACT_APP_BACKEND_URL;

const Settings = () => {
   const { logout } = useAuth();
   const navigate = useNavigate();
   const [first, setFirstName] = useState('');
   const [last, setLastName] = useState('');
   const [username, setUsername] = useState('');
   const [emailaddress, setEmailAddress] = useState('');
   const [boardList, setBoardList] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch(`${apiURL}/getUserInfo`, {
               method: 'GET',
               credentials: 'include',
            });
            const data = await response.json();
            setFirstName(data.first);
            setLastName(data.last);
            setUsername(data.user);
            setEmailAddress(data.email);
         } catch(error) {
            console.error("Error getting user info: ", error);
         }
         refreshBoards();
      };
      fetchData();
   }, []);

   const refreshBoards = async() => {
      try {
         const response = await fetch(`${apiURL}/getKeyboards`, {
            method: 'GET',
            credentials: 'include',
         });
         const boards = await response.json();
         setBoardList(boards);
         console.log(boards);
      } catch(error) {
         console.error("Error getting board list: ", error);
      }
   }

   const handleBackWelcome = async () => {
      navigate('/welcome');
   }

   const handleLogOut = async () => {
      logout(); // WARNING! Does not work yet
      navigate('/login');
   }

   const [showBoardCard, setBoardShowCard] = useState(false);
   const [showFriendCard, setFriendShowCard] = useState(false);
   const isCardOpen = showBoardCard || showFriendCard;

   const openBoardCard = async () => {
      setBoardShowCard(true);
   };

   const closeBoardCard = async () => {
      setBoardShowCard(false);
   };

   const openFriendCard = async () => {
      setFriendShowCard(true);
   };

   const closeFriendCard = async () => {
      setFriendShowCard(false);
   };

   const [boardData, setBoardData] = useState({
      name: '',
      boardId: '',
   });

   const handleBoardChange = (e) => {
      const { name, value } = e.target;
      setBoardData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const confirmBoard = async () => {
      console.log('Board Data Submitted:', boardData);
      try {
         const response = await fetch(`${apiURL}/claim`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(boardData),
         });
         console.log(response);
         closeBoardCard();
      } catch(error) {
         console.error("Error adding board:", error);
         // TODO: Show error to user
      }
   };

   const [friendData, setFriendData] = useState({
      friendName: '',
      friendEmail: '',
   });

   const handleFriendChange = (e) => {
      const { name, value } = e.target;
      setFriendData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
      };

   const confirmFriend = async () => {
      console.log('Friend Data Submitted:', friendData);
      try {
         const response = await fetch(`${apiURL}/friend`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(friendData),
         });
         console.log(response);
      } catch(error) {
         console.error("Error adding friend:", error);
      }
   };

   const selectBoard = async (boardId) => {
      console.log('Activating ', boardId, "...");
      try {
         const response = await fetch(`${apiURL}/setActiveKeyboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ boardId }),
         });
         console.log(response);
         refreshBoards();

      } catch(error) {
         console.error("Error setting active board:", error);
      }
   };

   return (
      <SettingsWrapper className='settings-wrapper'>
         <NavBar className='nav-bar'>
            <Button type='button' top='0px' bg={colors.med_bg} txt={colors.dark_txt} hbg={colors.light_hover} 
               onClick={handleLogOut}>Log Out</Button>
            <NavHeaderText className='header'>KeyScribe</NavHeaderText>
            <Button type='button' top='0px' bg={colors.med_bg} txt={colors.dark_txt} hbg={colors.light_hover} 
               onClick={handleBackWelcome}>Back to Welcome</Button>
         </NavBar>
         <ListWrapper className='user-list'>
            <h1>My Info</h1>
            <p>First Name: {first}</p>
            <p>Last Name: {last}</p>
            <p>Username: {username}</p>
            <p>Email: {emailaddress}</p>
            <Button type='button' top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover}>Edit</Button>
         </ListWrapper>
         <ListWrapper className='boards-list'>
            <h1>My Boards</h1>
            {boardList.map(board => (
               <BoardNameWrapper key={board.id} selected={board.selected} 
                  onClick={() => selectBoard(board.id)}>{board.name} 
               </BoardNameWrapper>
            ))}
            <Button type='button' top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover}
               onClick={openBoardCard} disabled={isCardOpen}>Claim Board</Button>
         </ListWrapper>
         <ListWrapper className='friends-list'>
            <h1>My Friends</h1>
            <p>Bob Gator</p>
            <p>Dr. Alex</p>
            <p>Carsten</p>
            <p>Anna</p>
            <Button type='button' top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} 
               onClick={openFriendCard} disabled={isCardOpen}>Add Friend</Button>
         </ListWrapper>

         {showBoardCard && (
            <Card raised='true' bg={colors.light_bg} w='45%' h='45%'>
               <h2>Add Board</h2>
               <FormField>
                  <Input
                     type="text" 
                     name="name"
                     placeholder="Choose Board Name"
                     value={boardData.name}
                     onChange={handleBoardChange}
                  />
               </FormField>
               <FormField>
                  <Input
                     type="text" 
                     name="boardId"
                     placeholder="Provided Board ID" // hardware ID
                     value={boardData.boardId}
                     onChange={handleBoardChange}
                  />
               </FormField>
               <CardButtonWrapper>
                  <Button type='button' top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={closeBoardCard}>Cancel</Button>
                  <Button type='button' top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={confirmBoard}>Confirm</Button>
               </CardButtonWrapper>
            </Card>
         )}

         {showFriendCard && (
            <Card bg={colors.light_bg} w='45%' h='45%'>
               <h2>Add Friend</h2>
               <FormField>
                  <Input
                     type="text" 
                     name="friendName"
                     placeholder="Friend Name"
                     value={friendData.friendName}
                     onChange={handleFriendChange}
                  />
               </FormField>
               <FormField>
                  <Input
                     type="text" 
                     name="friendEmail"
                     placeholder="Friend Email"
                     value={friendData.friendEmail}
                     onChange={handleFriendChange}
                  />
               </FormField>
               <CardButtonWrapper>
                  <Button type='button' top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={closeFriendCard}>Cancel</Button>
                  <Button type='button' top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={confirmFriend}>Confirm</Button>
               </CardButtonWrapper>
            </Card>
         )}
      </SettingsWrapper>
   );
};

Settings.propTypes = {};

Settings.defaultProps = {};

export default Settings;
