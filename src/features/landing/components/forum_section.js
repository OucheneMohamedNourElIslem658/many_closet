import { Button, styled, TextField } from "@mui/material";
import images from "../../../commun/utils/images";

const Content = styled('div')({
    display: 'flex',
    alignItems: 'center',
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 20px',
    position: 'relative'
})

const ForumForm = styled('div')(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    [theme.breakpoints.down('md')]: {
        position: 'absolute',
        marginLeft: '50%',
        width: '90%',
        transform: 'translate(-55%, 0)',
    }
}))

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
    maxWidth: 500,
    borderRadius: 12,
    backgroundColor: 'white',
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

const RightPic = styled('img')(({theme}) => ({
    width: 320,
    alignSelf: 'end',
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}))

const ForumSection = () => {
    const contactMail  = 'amaniouchene123@gmail.com'

    return (
        <Content id="contact">
            <img src={images.ForumLeftPic} alt="Forum Left" />
            <ForumForm>
                <Title>Say Something To Us</Title>
                <Desc>We value your feedback. Please share your thoughts with us.</Desc>
                <MailField placeholder={contactMail} disabled></MailField>
                <Button variant='contained' onClick={() => window.location.href = `mailto:${contactMail}`}>
                    Send Mail Now
                </Button>
            </ForumForm>
            <RightPic src={images.ForumRightPic} alt="Forum Right" />
        </Content>
    );
}
 
export default ForumSection;