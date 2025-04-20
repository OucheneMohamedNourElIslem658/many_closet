import { useEffect } from "react";
import { logoutUser, storeCurrentUser } from "../../../services/auth";
import { CircularProgress, styled } from "@mui/material";

const Description = styled('div')(({ theme }) => ({
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 10,
    '& p': {
        fontFamily: theme.typography.fontFamily,
        marginBottom: 50
    },
}));

const AuthSuccess = () => {

    useEffect(() => {
        const storeCurrentUserInDatabase = () => {
            storeCurrentUser().then(() => {
                window.location.href = '/shop';
            }).catch((error) => {
                if (error.code !== 409) {
                    logoutUser()
                    return
                }
                window.location.href = '/shop';
            });
        }

        storeCurrentUserInDatabase();
    }, []);

    return (
        <Description>
            <h1>Authentication Successful</h1>
            <p>You will be redirected to the shop page shortly.</p>
            <CircularProgress size={'40px'}/>
        </Description>
    );
}
 
export default AuthSuccess;