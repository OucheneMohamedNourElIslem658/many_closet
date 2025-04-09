import { styled } from '@mui/material/styles';
import NewArrivalItem from './new_arrivale_item';
import images from '../../../commun/utils/images';
import { Button } from '@mui/material';

const Content = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: '0 20px',
    marginBottom: 50,
})

const ContentHeader = styled('div')({
    maxWidth: 600,
})

const Title = styled('h1')({
    marginBottom: 10
})

const Desc = styled('p')(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: 50,
    fontFamily: theme.typography.fontFamily,
    fontSize: 16
}))

const Items = styled('ul')({
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 20,
    flexWrap: 'wrap',
    marginBottom: 70,
})

const ViewAllButton = styled(Button)({
    padding: '13px 100px'
})

const NewArrivalSection = () => {
    const items = [
        {
            id: 1,
            name: 'Shiny Dress',
            price: '$200',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque du...',
            image: images.ForumLeftPic,
            status: 'off market'
        },
        {
            id: 2,
            name: 'Casual Shirt',
            price: '$50',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque du...',
            image: images.ForumRightPic,
            status: 'available'
        },
        {
            id: 3,
            name: 'Elegant Skirt',
            price: '$120',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque du...',
            image: images.ForumLeftPic,
            status: 'off market'
        },
        {
            id: 1,
            name: 'Shiny Dress',
            price: '$200',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque du...',
            image: images.ForumLeftPic,
            status: 'off market'
        },
        {
            id: 2,
            name: 'Casual Shirt',
            price: '$50',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque du...',
            image: images.ForumRightPic,
            status: 'available'
        },
        {
            id: 3,
            name: 'Elegant Skirt',
            price: '$120',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque du...',
            image: images.ForumLeftPic,
            status: 'off market'
        },
        {
            id: 1,
            name: 'Shiny Dress',
            price: '$200',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque du...',
            image: images.ForumLeftPic,
            status: 'off market'
        },
        {
            id: 2,
            name: 'Casual Shirt',
            price: '$50',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque du...',
            image: images.ForumRightPic,
            status: 'available'
        },
        {
            id: 3,
            name: 'Elegant Skirt',
            price: '$120',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque du...',
            image: images.ForumLeftPic,
            status: 'off market'
        }
    ]

    return ( 
        <Content>
            <ContentHeader>
                <Title>New Arrival</Title>
                <Desc>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin </Desc>
            </ContentHeader>
            <Items>
                {
                    items.map((item) => {
                        return <NewArrivalItem item={item}/>
                    })
                }
            </Items>
            <ViewAllButton variant='contained'>View All</ViewAllButton>
        </Content>
    );
}
 
export default NewArrivalSection;