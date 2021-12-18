import React, { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom"
import { ACCOUNT_ENDPOINT, API } from "../../constants/constants";
import { Form, Container, Button } from "react-bootstrap";

var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
const passwordMeetRequirements = (password) => strongRegex.test(password)

export default function CreateAccountForm() {
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [commercialName, setCommercialName] = useState("");
    const [password, setPassword] = useState("");

    const isCreateInputValid = () => {
        return (email !== "" &&
            name !== "" &&
            commercialName !== "" &&
            password !== "" &&
            passwordMeetRequirements(password));
    }

    async function handleCreateAccount(event) {
        event.preventDefault();

        if (!isCreateInputValid()) {
            return; 
        }

        const body = JSON.stringify({
            email,
            name,
            commercialName,
            password,
        });

        var config = {
            headers: { "Content-Type": "application/json" },
        };

        try {
            const res = await axios.put(`${API}/${ACCOUNT_ENDPOINT}`, body, config);

            if (res.status === 200) {
                history.push({pathname: "/", state: { email: email }})
            }
        } catch (error) {
            console.error(error);
        }
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
            <Form onSubmit={handleCreateAccount}>
            <h1>Crie uma nova conta</h1>
            <Form.Group className="mb-3" controlId="formCreateAccountEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="gabriel@gmail.com" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCreateAccountFullName">
                <Form.Label>Nome completo</Form.Label>
                <Form.Control value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Gabriel da Silva" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCreateAccountCommercialName">
                <Form.Label>Nome comercial</Form.Label>
                <Form.Control value={commercialName} onChange={e => setCommercialName(e.target.value)} type="text" placeholder="Ateliê do Gabriel" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCreateAccountPassword">
                <Form.Label >Senha</Form.Label>
                <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="" />
                <ol type="I">
                    <li>Pelo menos 8 (oito) caracteres</li>
                    <li>Pelo menos uma letra minúscula</li>
                    <li>Pelo menos uma letra maiúscula</li>
                    <li>Pelo menos um número</li>
                </ol>
            </Form.Group>
            <Button type="submit" className="w-100 btn btn-primary">Criar conta</Button>
            </Form>
        </Container>
    )
}