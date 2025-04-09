import { Button, styled, TextField } from "@mui/material";
import images from "../../../commun/utils/images";

const Content = styled('div')({
    display: 'flex',
    alignItems: 'center',
    maxWidth: 1200,
    margin: '0 auto'
})

const ForumForm = styled('div')({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
})

const Title = styled('h1')({
    marginBottom: 15,
    fontSize: 35
})

const Desc = styled('p')(({theme}) => ({
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    margin: '0 10px',
    marginBottom: 20,
    fontSize: 16
}))

const MailField = styled(TextField)(({theme}) => ({
    marginBottom: 25,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)',
    width: '100%',
    borderRadius: 12,
    
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 'none',
        },
        '& input::placeholder': {
            color: theme.palette.primary.main,
            opacity: 1
        },
    },

}))

const ForumSection = () => {
    return (
        <Content>
            <img src={images.ForumLeftPic} alt="" />
            <ForumForm>
                <Title>Subscribe To Our Newsletter</Title>
                <Desc>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin </Desc>
                <MailField placeholder="michael@ymail.com" disabled></MailField>
                <Button variant='contained'>Subscribe Now</Button>
            </ForumForm>
            <img src={images.ForumRightPic} alt="" />
        </Content>
    );
}
 
export default ForumSection;