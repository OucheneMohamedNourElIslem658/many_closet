import { Box, Button, styled } from '@mui/material';
import Images from '../../../commun/utils/images'
import { Link } from 'react-router-dom';

// Add this style to set maxHeight to 100vh for the section container
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
}));

const ShopButton = styled(Button)({
    paddingLeft: '50px',
    paddingRight: '50px',
})

const ImgBg = styled(Box) (({theme}) => ({
    backgroundColor: '#E0E0E0',
    gridRow: 'span 5',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    '&.side-img': {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        }
    },
    '&.top-bottom-pic': {
        gridRow: 'span 1', 
        [theme.breakpoints.down('md')]: {
            gridColumn: 'span 3',
        }
    },
    '&.bottom-pic': {
        backgroundColor: '#F39D90',
    },
}));

const Heading = styled('h1')({
    fontSize: 50,
    marginBottom: 20,
    fontFamily: 'Dancing Script, cursive',
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
                <img src={Images.Amani1} alt=""/>
            </ImgBg>

            <ImgBg className='top-bottom-pic'>
                <img src={Images.Amani4} alt="" />
            </ImgBg>

            <ImgBg className='side-img'>
                <img src={Images.Amani2} alt="" />
            </ImgBg>
            
            <Content className="content">
                <Heading>Welcome To our Many Closet!</Heading>

                <Paragraph>
                    Shop and Buy the best quality products at the best price.
                </Paragraph>

                <ShopButton variant="contained" color="primary" component={Link} to='/shop'>
                    Shop Now
                </ShopButton>
            </Content>

            <ImgBg className='top-bottom-pic bottom-pic'>
                <img src={Images.Amani3} alt="" />
            </ImgBg>
        </LandingSectionContentAlignment>
    );
}
 
export default LandingSection;