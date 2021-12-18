import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from "react-router-dom"
import { API, LOGIN_ENDPOINT } from '../../constants/constants';
import { Form, Button, Container} from 'react-bootstrap';

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
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  
  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await loginUser({
      email,
      password
    });

    setToken(token);
  }

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <Form onSubmit={handleSubmit}>
        <h1>Bem vindo</h1>
        <Button onClick={() => history.push("/create-account")} className="w-100 my-2" variant="outline-success">Criar nova conta</Button>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha</Form.Label>
          <Form.Control onChange={e => setPassword(e.target.value)} type="password" placeholder="" />
        </Form.Group>
        <div style={{ justifyContent: "right", display: "flex"}}>
          <Button variant="primary" type="submit">
            Enviar
          </Button>
        </div>

      </Form>
    </Container>
    
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};