import { Box, Button, styled } from '@mui/material';
import Images from '../../../commun/utils/images'

const LandingSectioContentAlignment = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    maxWidth: 1200,
    margin: "0 auto",
    gap: 20,
    marginBottom: 50
})

const ShopButton = styled(Button)({
    paddingLeft: '50px',
    paddingRight: '50px',
})

const TopImg = styled('img')({
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    width: '100%',
    paddingTop: 10,
})

const BottomImg = styled('img')({
    translate: '0 10px',
})

const ImgBg = styled(Box) ({
    backgroundColor: '#E0E0E0',
    gridRow: 'span 5',
    paddingTop: 100,
    position: 'relative',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
    alignItems: 'center',
    width: '100%',
});

const Img = styled('img') ({
    overflow: 'hidden',
})

const Heading = styled('h1')({
    fontSize: 50,
    marginBottom: 20,
});

const Paragraph = styled('p')({
    fontSize: 20,
    color: '#7C7C7C',
    marginBottom: 20,
});

const Content = styled('div')({
    gridRow: 'span 3',
    textAlign: 'center',
});

const LandingSection = () => {
    return ( 
        <LandingSectioContentAlignment>
            <ImgBg component='div'>
                <Img src={Images.LandingSectionLeftPic} alt=""/>
            </ImgBg>

            <TopImg src={Images.LandingSectionTopPic} alt=""/>

            <ImgBg component='div'>
                <Img src={Images.LandingSectionRightPic} alt="" />
            </ImgBg>
            
            <Content className="content">
                <Heading>Welcome To our Shop!</Heading>

                <Paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </Paragraph>

                <ShopButton variant="contained" color="primary">
                    Shop Now
                </ShopButton>
            </Content>

            <BottomImg src={Images.LandingSectionBottomPic} alt=""/>
        </LandingSectioContentAlignment>
    );
}
 
export default LandingSection;