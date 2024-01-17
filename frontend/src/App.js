import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Keyboard from './components/Keyboard/Keyboard';
import CreateAccount from './components/CreateAccount/CreateAccount';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/welcome_teacher" element={<Keyboard />} />
          <Route path="/welcome_student" element={<Keyboard />} />
          <Route path="/create_account" element={<CreateAccount />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
