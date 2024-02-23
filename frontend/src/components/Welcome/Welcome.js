import React, { useEffect, useState} from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import { WelcomeWrapper, UserWrapper } from './Welcome.styled';
import { colors, NavBar, Button, NavHeaderText, Card, FormField, Input, CardButtonWrapper } from '../../App.styled';

const apiURL = process.env.REACT_APP_BACKEND_URL;

const Welcome = () => {
   const { logout } = useAuth();
   const navigate = useNavigate();
   const [name, setName] = useState('');
   const [showJoinCard, setShowJoinCard] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch(`${apiURL}/getUserInfo`);
            const data = await response.json();
            setName(data.first);
         } catch(error) {
            console.error(error);
         }
      };
      fetchData();
   }, []);

   const handleSettings = async () => {
      navigate('/settings');
   }

   const handleLogOut = async () => {
      logout(); // WARNING! Does not work yet
      navigate('/login');
   }

   const handleStart = async() => {
      navigate('/session');
   }

   const openJoin = async() => {
      setShowJoinCard(true);
   }

   const closeJoin = async() => {
      setShowJoinCard(false);
   }

   return (
      <WelcomeWrapper data-testid="Welcome">
          <NavBar className='nav-bar'>
            <Button type='button' top='0px' bg={colors.med_bg} txt={colors.dark_txt} hbg={colors.light_hover} onClick={handleLogOut}>Log Out</Button>
            <NavHeaderText className='header'>KeyScribe</NavHeaderText>
            <Button type='button' top='0px' bg={colors.med_bg} txt={colors.dark_txt} hbg={colors.light_hover} onClick={handleSettings}>Settings</Button>
         </NavBar>
         <UserWrapper className='user-wrapper'>
            <h1>Welcome, {name}!</h1>
            <h2>Class: {}</h2>
            <h2>Selected Board: {}</h2>
         </UserWrapper>
         <Button type='button' top='0px' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={handleStart}>Start Session</Button>
         <Button type='button' top='0px' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={openJoin}>Join Session</Button>
      
         {showJoinCard && (
            <Card bg={colors.med_bg} w='30%' h='35%'>
               <h1>Enter Code</h1>
               <FormField>
                  <Input 
                     type="text" 
                     name="joinCode"
                     placeholder="Code"
                  />
               </FormField>
               <CardButtonWrapper>
                  <Button top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={closeJoin}>Cancel</Button>
                  <Button top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover}>Confirm</Button>
               </CardButtonWrapper>
            </Card>
         )}

      </WelcomeWrapper>
   );
};

export default Welcome;
