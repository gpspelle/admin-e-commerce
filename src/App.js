import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Form from './components/Form/Form';
import Login from './components/Login/Login';
import Preferences from './components/Preferences/Preferences';
import useToken from './hooks/useToken';

function App() {
  const { token, setToken } = useToken();
  
  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <Form />
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;