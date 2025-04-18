import { styled } from "@mui/material";

const Title = styled('h1')(({ theme }) => ({
    fontSize: 130,
    color: theme.palette.text.primary,
    fontWeight: 'bold',
}))

const SubTitle = styled('p')(({ theme }) => ({
    fontSize: 25,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
}))

const ContentContainer = styled('div')({
    justifySelf: 'center', 
    display: "flex", 
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    marginTop: 40
})

const EmptyDataComponent = () => {
    return (
        <ContentContainer>
            <Title dangerouslySetInnerHTML={{ __html: "(&#94;-&#94;*)" }}></Title>
            <SubTitle>No Data Found!</SubTitle>
        </ContentContainer>
    );
}
 
export default EmptyDataComponent;