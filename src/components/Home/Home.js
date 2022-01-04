import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN_NAME, ACCOUNT_ENDPOINT, API } from "../../constants/constants";
import useToken from "../../hooks/useToken";
import axios from "axios";
import { Container } from "react-bootstrap";

export default function Home() {
    const { token } = useToken();
    const [name, setName] = useState();

    useEffect(() => {
        async function getAccountFromDatabase() {
            if (token) {
              try {
                const config = {
                  headers: {
                    "Content-Type": "application/json",
                    [ACCESS_TOKEN_NAME]: token,
                  }
                } 
          
                const res = await axios.get(`${API}/${ACCOUNT_ENDPOINT}`, config);
                const { data } = res;
                setName(data[0].name);
              } catch (error) {
                console.error(error);
              }
            }
        }
    
        getAccountFromDatabase();
    }, [token]);

    return (
        <Container
            style={{
                justifyContent: "center",
                alignItems: "center",
                padding: "30px",
            }}
        >
            <div style={{ paddingBottom: "20px" }}>
                Olá, {name}!
            </div>
            Bem vindo ao sistema de administração,
            utilize o menu para navegar.
        </Container>
    );
}