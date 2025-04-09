import { Box, Button, styled } from '@mui/material';
import Images from '../../../commun/utils/images'

const LandingSectionContentAlignment = styled('div')(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    maxWidth: 1200,
    margin: "0 auto",
    gap: 20,
    marginBottom: 50,
    padding: '0 20px',
    [theme.breakpoints.down('md')]: {
        maxWidth: '600px',
    },
}))

const ShopButton = styled(Button)({
    paddingLeft: '50px',
    paddingRight: '50px',
})

const ImgBg = styled(Box) (({theme}) => ({
    backgroundColor: '#E0E0E0',
    gridRow: 'span 5',
    paddingTop: 100,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
    '&.side-img': {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        }
    },
    '&.top-bottom-pic': {
        gridRow: 'span 1', 
        paddingTop: 10,
        [theme.breakpoints.down('md')]: {
            gridColumn: 'span 3',
        }
    },
    '&.bottom-pic': {
        backgroundColor: '#F39D90'
    },
}));

const Heading = styled('h1')({
    fontSize: 50,
    marginBottom: 20,
});

const Paragraph = styled('p')(({theme}) => ({
    fontSize: 18,
    color: '#7C7C7C',
    marginBottom: 20,
    fontFamily: theme.typography.fontFamily
}));

const Content = styled('div')(({theme}) => ({
    gridRow: 'span 3',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
        gridColumn: 'span 3',
    }
}));

const LandingSection = () => {
    return ( 
        <LandingSectionContentAlignment>
            <ImgBg className='side-img'>
                <img src={Images.LandingSectionLeftPic} alt=""/>
            </ImgBg>

            <ImgBg className='top-bottom-pic'>
                <img src={Images.LandingSectionTopPic} alt="" />
            </ImgBg>

            <ImgBg className='side-img'>
                <img src={Images.LandingSectionRightPic} alt="" />
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

            <ImgBg className='top-bottom-pic bottom-pic'>
                <img src={Images.LandingSectionTopPic} alt="" />
            </ImgBg>
        </LandingSectionContentAlignment>
    );
}
 
export default LandingSection;