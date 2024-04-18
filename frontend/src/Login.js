import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add your login logic here
    // Replace the following line with your actual authentication logic
    if (username === 'teacher' && password === 'teacher') {
      navigate('/welcome_teacher'); // Redirect to the teacher welcome page
    }

    if (username === 'student' && password === 'student') {
        navigate('/welcome_student'); // Redirect to the student welcome page
      }
  }

  const inputStyle = {
    marginBottom: '15px', // Increase the margin-bottom as needed for the input fields
  };

  const labelStyle = {
    marginBottom: '15px', // Increase the margin-bottom as needed for the labels
  };

  return (
    <div>
      <div style={inputStyle}>
        <label style={labelStyle}>Username: </label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div style={inputStyle}>
        <label style={labelStyle}>Password: </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div style={inputStyle}>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
