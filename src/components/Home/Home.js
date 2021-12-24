import React, { useState, useEffect } from "react";
import { ACCOUNT_ENDPOINT, API } from "../../constants/constants";
import useToken from "../../hooks/useToken";
import axios from "axios";
import AccountForm from "../AccountForm/AccountForm";

export default function Home() {
    const { token } = useToken();
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [commercialName, setCommercialName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [isEmailVerified, setIsEmailVerified] = useState();

    useEffect(() => {
        async function getAccountFromDatabase() {
            if (token) {
              try {
                const config = {
                  headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                  }
                } 
          
                const res = await axios.get(`${API}/${ACCOUNT_ENDPOINT}`, config);
                const { data } = res;
                setEmail(data[0].email);
                setName(data[0].name);
                setCommercialName(data[0].commercial_name);
                setPhoneNumber(data[0].phone_number);
                setIsEmailVerified(data[0].is_email_verified);
              } catch (error) {
                console.error(error);
              }
            }
        }
    
        getAccountFromDatabase();
    }, [token]);

    return (
        <AccountForm
            email={email} 
            name={name} 
            commercialName={commercialName} 
            phoneNumber={phoneNumber} 
            isEmailVerified={isEmailVerified} 
        />
    );
}