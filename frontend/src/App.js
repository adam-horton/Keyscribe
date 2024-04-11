import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Keyboard from './components/Keyboard/Keyboard';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Welcome from './components/Welcome/Welcome';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './components/AuthContext/AuthContext';
import Settings from './components/Settings/Settings';
import Session from './components/Session/Session';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/welcome_teacher" element={<Keyboard />} />
            <Route path="/welcome_student" element={<Keyboard />} />
            <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
            {/* <Route path="/welcome" element={<Welcome />} /> */}
            <Route path="/create_account" element={<CreateAccount />} />
            <Route path="/settings" element={<Settings />}></Route>
            {/*                                            </Route> // TODO: Make it a ProtectedRoute */}
            <Route path='/session' element={<Session />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
