import { useTheme } from '@mui/material/styles';
import NewArrivalItem from './new_arrivale_item';
import images from '../../../commun/utils/images';

const NewArrivalSection = () => {
    const theme = useTheme();

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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        }}>
            <div style={{
                maxWidth: 600,
            }}>
                <h1 style={{
                    marginBottom: 20
                }}>
                    New Arrival
                </h1>
                <p style={{
                    color: theme.palette.text.secondary,
                    marginBottom: 50
                }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin 
                </p>
            </div>
            <ul style={{
                display: 'flex',
                gap: 20,
                flexWrap: 'wrap',
                maxWidth: 1000,
                // margin:  '0 auto',
            }}>
                {
                    items.map((item) => {
                        return <NewArrivalItem item={item}/>
                    })
                }
            </ul>
        </div>
    );
}
 
export default NewArrivalSection;