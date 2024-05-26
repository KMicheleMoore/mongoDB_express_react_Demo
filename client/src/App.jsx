import React, {useState, useEffect} from 'react';
// Components
import NavBar from './components/NavBar';
import Main from './components/Main';
import SignIn from './components/SignIn';
import Register from './components/Register';
import Footer from './components/Footer';
import CreateForm from './components/CreateForm';
import EditForm from './components/EditForm';
// Routing
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';

const App = () => {

  const [message, setMessage] = useState({});

  return (
    <React.Fragment>
      <NavBar />
      {message.content && ( 
        <div className={`alert alert-${message.type} status-message text-center`} role="alert">
          {message.content}
        </div>
      )}
      <div id="main-content">
        <Routes>
          <Route path="/" element={<Main updateMessage={setMessage} />} />
          <Route path="/signin" element={<SignIn updateMessage={setMessage}/>} />
          <Route path="/register" element={<Register updateMessage={setMessage}/>} />

          <Route element={<ProtectedRoutes/>}> 
            <Route path='/create' element={<CreateForm updateMessage={setMessage}/>} />  
            <Route path='/edit/:id' element={<EditForm updateMessage={setMessage}/>} />      
          </Route>
        </Routes>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default App;