import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom"
import { ACCOUNT_ENDPOINT, API } from "../../constants/constants";
import { Form, Container, Button, Spinner } from "react-bootstrap";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput";
import useToken from "../../hooks/useToken";
import AlertWithMessage from "../Alert/AlertWithMessage";

var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
const isValidPassword = (password) => strongRegex.test(password)
const isValidPhoneNumber = (phoneNumber) => String(phoneNumber).match(/^\+?[1-9]\d{1,14}$/)

export default function AccountForm(props) {
    const { token } = useToken();
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [commercialName, setCommercialName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [createEditAccountBackendMessage, setCreateEditAccountBackendMessage] = useState();
    const [isWaitingResponse, setIsWaitingResponse] = useState(false);
    const [alertVariant, setAlertVariant] = useState();

    useEffect(() => {
        if (props) {
            setName(props.name)
            setEmail(props.email)
            setCommercialName(props.commercialName)
            setPhoneNumber(props.phoneNumber)
        }
    }, [props])

    const isCreateInputValid = () => {
        return (email !== "" &&
            name !== "" &&
            commercialName !== "" &&
            phoneNumber !== "" &&
            isValidPhoneNumber(phoneNumber) &&
            password !== "" &&
            isValidPassword(password));
    }

    const isEditInputValid = () => {
        return (email !== "" &&
            name !== "" &&
            commercialName !== "" &&
            phoneNumber !== "" &&
            isValidPhoneNumber(phoneNumber));
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
            setAlertVariant("danger");
            setCreateEditAccountBackendMessage(error.response.data.message);
            setShow(true);
        }
    }

    async function handleEditAccount(event) {
        event.preventDefault();
        setShow(false);
        if (!isEditInputValid()) {
            return; 
        }

        const body = { email: props.email }

        if (props.email !== email) {
            // we still do not allow change of email as it is
            // the partition key of the admins table
            return;
        }

        if (props.name !== name) body.name = name
        if (props.commercialName !== commercialName) body.commercial_name = commercialName
        if (props.phoneNumber !== phoneNumber) body.phone_number = phoneNumber

        if (Object.keys(body).length === 1) {
            return;
        } 

        var config = {
            headers: { 
                "Content-Type": "application/json",
                "x-access-token": token
            },
        };
        
        try {
            setIsWaitingResponse(true);
            const response = await axios.patch(`${API}/${ACCOUNT_ENDPOINT}`, JSON.stringify(body), config);
            setAlertVariant("success");
            setCreateEditAccountBackendMessage(response.data.message);
        } catch (error) {
            setAlertVariant("danger");
            setCreateEditAccountBackendMessage(error.response.data.message);
        } finally {
            setShow(true);
            setIsWaitingResponse(false);
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
            <Form onSubmit={props ? handleEditAccount : handleCreateAccount}>
                <h1>{props ? `Bem vindo, ${name}` : "Crie uma nova conta"}</h1>
                <AlertWithMessage variant={alertVariant} show={show} setShow={setShow} message={createEditAccountBackendMessage} />
                <Form.Group className="mb-3" controlId="formCreateAccountEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control disabled={props ? true : false} value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="gabriel@gmail.com" />
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
                {!props && 
                    <Form.Group className="mb-3" controlId="formCreateAccountPassword">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="" />
                        <ol type="I">
                            <li>Pelo menos 8 (oito) caracteres</li>
                            <li>Pelo menos uma letra minúscula</li>
                            <li>Pelo menos uma letra maiúscula</li>
                            <li>Pelo menos um número</li>
                        </ol>
                    </Form.Group>
                }
                <Button 
                    type="submit"
                    variant="primary" 
                    className="w-100"
                    disabled={isWaitingResponse}
                >
                    {isWaitingResponse &&
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <span className="visually-hidden">Aguarde...</span>
                        </>
                    }
                    {isWaitingResponse ? "Aguarde..." : (props ? "Atualizar perfil" : "Deletar")}
                </Button>
            </Form>
        </Container>
    )
}