import { Button, styled, TextField } from "@mui/material";
import { loginWithEmailAndPassword } from "../../services/auth";
import CustomizedSnackbar from "../../commun/components/snackbar";
import { useState } from "react";
import { Helmet } from "react-helmet";

const SubTitle = styled('p')(({ theme }) => ({
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.secondary,
    marginTop: '10px',
}));

const ContentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: '50px',
    textAlign: 'center',
}));

const FormContainer = styled('form')(({ theme }) => ({  
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
    maxWidth: '400px',
    width: '100%',
}));

const AdminAuthPage = () => {
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setDisabled(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        setDisabled(true);

        try {
            await loginWithEmailAndPassword(email, password);
        } catch (error) {
            setError(error.message);
        } finally {
            setDisabled(false)
        }
    }

    return (
        <ContentContainer>
            <Helmet>
                <title>Auth</title>
                <meta name="description" content="Admin authentication page for signing in with email and password." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div>
                <h1>Authentification</h1>
                <SubTitle>Sign In with admin email and password</SubTitle>
            </div>
            <FormContainer onSubmit={handleSubmit} noValidate>
                <TextField
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    disabled={disabled}
                    required
                />
                <TextField
                    margin="dense"
                    id='password'
                    name='password'
                    label='Password'
                    type='password'
                    fullWidth
                    variant="standard"
                    disabled={disabled}
                    required
                    style={{
                        marginBottom: '30px',
                    }}
                />
                <Button variant="contained" color="primary" type="submit" style={{width: '100%'}} disabled={disabled}>
                    Login
                </Button>
            </FormContainer>
            <CustomizedSnackbar
                message={error}
                type="error"
                open={Boolean(error)}
                onClose={() => setError(null)}
            />
        </ContentContainer>
    );
}
 
export default AdminAuthPage;