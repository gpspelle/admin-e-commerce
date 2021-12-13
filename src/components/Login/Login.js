import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import { API, LOGIN_ENDPOINT } from '../../constants/constants';

async function loginUser(credentials) {
 return fetch(`${API}/${LOGIN_ENDPOINT}`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export default function Login({ setToken }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await loginUser({
      username,
      password
    });

    setToken(token);
  }

  return (
    <div>
        <h1>Realize Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
              <label className="form-label">Usuário</label>
              <input type="text" className="form-control" id="exampleInputUsername1" onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input type="password" className="form-control" id="exampleInputPassword1" onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};