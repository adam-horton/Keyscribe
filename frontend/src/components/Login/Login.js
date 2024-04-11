import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext'
import { Container, Background, HeaderText, LoginForm, FormField, CreateAccountButton} from './Login.styled';
import { colors, Button, Input} from '../../App.styled';

const Login = () => {
   const navigate = useNavigate();
   const { login } = useAuth();
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const handleLogin = async () => {
      try {
         if (username && password) {
            if(await login(username, password)) {
               navigate('/welcome');
            }
            else {
               console.error('Incorrect username and password');
            }
         }
      } catch (error) {
         console.error('Error during login', error);
      }
   }
   const handleCreateAccount = async () => {
      navigate('/create_account');
   }

   return (
      <Container>
         <Background />
         <LoginForm>
            <HeaderText>KeyScribe</HeaderText>
            <FormField>
               <Input 
                  type="text" 
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  indent="40px"
               />
            </FormField>
            <FormField>
               <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' ? handleLogin() : ''}
                  indent="40px"
               />
            </FormField>
            <Button type="button" className="btn" top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={handleLogin}>Login</Button>
            <CreateAccountButton onClick={handleCreateAccount}>Create Account</CreateAccountButton>
         </LoginForm>
      </Container>
   );
};

export default Login;
