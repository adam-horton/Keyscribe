import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateAccountWrapper, CreateAccountForm } from '../CreateAccount/CreateAccount.styled';
import { Background, HeaderText } from '../Login/Login.styled';
import { colors, Button, Input, FormField } from '../../App.styled';

const apiURL = process.env.REACT_APP_BACKEND_URL;

const CreateAccount = () => {
   const navigate = useNavigate()
   const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
   });

   const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData((prevData) => ({
      ...prevData,
      [name]: value,
   }));
   };

   const handleSubmit = async () => {
      if (formData.password !== formData.confirmPassword) {
         // client-side validation (TODO: server-side should also be added for security)
         console.error('Password and Confirm Password do not match');
         // TODO: show error message to user
      }
      else {
         console.log('Form Data Submitted:', formData);
         try {
            const response = await fetch(`${apiURL}/register`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  username: formData.username,
                  password: formData.password,
                  emailAddress: formData.emailAddress,
                  firstName: formData.firstName,
                  lastName: formData.lastName,
               }),
            });
            if (response.status === 200) {
               console.log('Account successfully created');
               navigate('/login');
            } else {
               console.error('Error: User already exists!');
            }
         }
         catch {

         }
      }
   };

   return (
      <CreateAccountWrapper data-testid="CreateAccount">
         <Background />
            <CreateAccountForm>
               <HeaderText>Create Account</HeaderText>
               <FormField>
                  <Input 
                     type="text"
                     name="firstName"
                     placeholder="First Name" 
                     value={formData.firstName}
                     onChange={handleInputChange}
                  />
               </FormField>
               <FormField>
                  <Input 
                     type="text" 
                     name="lastName"
                     placeholder="Last Name" 
                     value={formData.lastName}
                     onChange={handleInputChange}
                  />
               </FormField>
               <FormField>
                  <Input 
                     type="text" 
                     name="username"
                     placeholder="Username" 
                     value={formData.username}
                     onChange={handleInputChange}
                  />
               </FormField><FormField>
                  <Input 
                     type="text" 
                     name="emailAddress"
                     placeholder="Email Address" 
                     value={formData.emailAddress}
                     onChange={handleInputChange}
                  />
               </FormField>
               <FormField>
                  <Input 
                     type="password" 
                     name="password"
                     placeholder="Password" 
                     value={formData.password}
                     onChange={handleInputChange}
                  />
               </FormField>
               <FormField>
                  <Input 
                     type="password" 
                     name="confirmPassword"
                     placeholder="Confirm Password" 
                     value={formData.confirmPassword}
                     onChange={handleInputChange}
                  />
               </FormField>
               <Button type="button" className="btn" top='auto' bg={colors.dark_bg} txt={colors.light_txt} hbg={colors.dark_hover} onClick={handleSubmit}>Confirm</Button>
            </CreateAccountForm>
      </CreateAccountWrapper>
   );
};

CreateAccount.propTypes = {};

CreateAccount.defaultProps = {};

export default CreateAccount;