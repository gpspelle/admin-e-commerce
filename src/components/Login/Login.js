import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

const api = 'https://qbhf2c9996.execute-api.us-east-1.amazonaws.com/dev';

async function loginUser(credentials) {
 return fetch(`${api}/login`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export default function Login({ setToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await loginUser({
      email,
      password
    });

    setToken(token);
  }

  // TODO: input type="text" can become type="email" for email
  return (
    <div>
        <h1>Please Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={e => setEmail(e.target.value)} />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};