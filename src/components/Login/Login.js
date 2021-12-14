import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Usuário</Form.Label>
          <Form.Control onChange={e => setUsername(e.target.value)} type="text" placeholder="" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha</Form.Label>
          <Form.Control onChange={e => setPassword(e.target.value)} type="password" placeholder="" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </Container>
    
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};