import { Button, styled, TextField } from "@mui/material";

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
    return (
        <ContentContainer>
            <div>
                <h1>Authentification</h1>
                <SubTitle>Sign In with admin email and password</SubTitle>
            </div>
            <FormContainer>
                <TextField
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    required
                />
                <Button style={{alignSelf: 'flex-end', fontSize: '12px'}}>
                    Reset Password
                </Button>
                <TextField
                    margin="dense"
                    id='password'
                    name='password'
                    label='Password'
                    type='password'
                    fullWidth
                    variant="standard"
                    required
                    style={{
                        marginBottom: '30px',
                        position: 'relative',
                        bottom: 15
                    }}
                />
                <Button variant="contained" color="primary" type="submit" style={{width: '100%'}}>
                    Login
                </Button>
            </FormContainer>
        </ContentContainer>
    );
}
 
export default AdminAuthPage;