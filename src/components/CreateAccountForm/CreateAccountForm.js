import React, { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom"
import { ACCOUNT_ENDPOINT, API } from "../../constants/constants";
import { Form, Container, Button } from "react-bootstrap";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput";
import DangerAlertWithMessage from "../Alert/DangerAlertWithMessage";

var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
const isValidPassword = (password) => strongRegex.test(password)
const isValidPhoneNumber = (phoneNumber) => String(phoneNumber).match(/^\+?[1-9]\d{1,14}$/)

export default function CreateAccountForm() {
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [commercialName, setCommercialName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [createAccountBackendMessage, setCreateAccountBackendMessage] = useState();

    const isCreateInputValid = () => {
        return (email !== "" &&
            name !== "" &&
            commercialName !== "" &&
            phoneNumber !== "" &&
            isValidPhoneNumber(phoneNumber) &&
            password !== "" &&
            isValidPassword(password));
    }

    async function handleCreateAccount(event) {
        event.preventDefault();
        setShow(false);
        if (!isCreateInputValid()) {
            return; 
        }

        const body = JSON.stringify({
            email,
            name,
            commercialName,
            phoneNumber,
            password,
        });

        var config = {
            headers: { "Content-Type": "application/json" },
        };

        try {
            await axios.put(`${API}/${ACCOUNT_ENDPOINT}`, body, config);
            history.push({pathname: "/", state: { email: email }})

        } catch (error) {
            setCreateAccountBackendMessage(error.response.data.message);
            setShow(true);
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
            <DangerAlertWithMessage show={show} setShow={setShow} message={createAccountBackendMessage} />
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
            <PhoneNumberInput phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
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