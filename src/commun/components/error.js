import { ErrorOutlineRounded, WarningAmberRounded } from "@mui/icons-material";
import { styled } from "@mui/material";

const Title = styled('h1')(({ theme }) => ({
    fontSize: 35,
    fontWeight: 100,
    color: theme.palette.text.primary,
}))

const SubTitle = styled('p')(({ theme }) => ({
    fontSize: 16,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
}))

const ContentContainer = styled('div')({
    justifySelf: 'center', 
    display: "flex", 
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    marginTop: 40
})

const ErrorComponent = ({error}) => {
    return (
        <ContentContainer>
            <WarningAmberRounded style={{height: 100, width: 100}}/>
            <Title>Something went wrong</Title>
            <div style={{display: "flex", gap: 10}}>
                <ErrorOutlineRounded/>
                <SubTitle>{error}</SubTitle>
            </div>
        </ContentContainer>
    );
}
 
export default ErrorComponent;