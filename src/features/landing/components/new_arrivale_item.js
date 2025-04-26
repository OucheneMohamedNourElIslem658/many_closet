import { Skeleton, styled } from "@mui/material";
import { Fragment } from "react";

const ItemContentAlignment = styled('li')(({theme}) => ({
    width: 250,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)',
    padding: 10,
    borderRadius: 10,
    gridColumn:  'span 2',
    [theme.breakpoints.down('md')]: {
        gridColumn: 'span 3',
    },
    [theme.breakpoints.down('sm')]: {
        gridColumn: 'span 6'
    }
}))

const ItemImage = styled('div')({
    height: '150px',
    backgroundSize: 'cover',
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    gridColumn: 'span 2',
    marginBottom: 10,
})

const ItemName = styled('p')(({theme}) => ({
    whiteSpace: 'nowrap',
    textAlign: 'start',
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    alignSelf: 'end',
    fontWeight: 500
}))

const ItemPrice = styled('p')(({theme}) => ({
    justifySelf: 'end',
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
}))

const ItemDescription = styled('p')(({theme}) => ({
    gridColumn: 'span 2',
    fontSize: 12,
    color: theme.palette.text.secondary,
    marginBottom: 10,
    textAlign: 'start',
    fontFamily: theme.typography.fontFamily,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
}))

const AvailablityTag = styled('div')(({theme}) =>({
    border: `${theme.palette.error.main} 1px solid`,
    borderRadius: 50,
    textAlign: 'center',
    justifySelf: 'start',
    padding: '2px 10px',
    color: theme.palette.error.main,
    '&.available': {
        border: `${theme.palette.success.main} 1px solid`,
        color: theme.palette.success.main,
    }
}))

const OffmarketContent = styled('p')(({theme}) => ({
    fontSize: 12,
    fontFamily: theme.typography.fontFamily
}))

const NewArrivalItem = ({item, isLoading}) => {
    return isLoading ? (
        <ItemContentAlignment>
            <ItemImage/>
            <ItemName>
                <Skeleton variant="text" width="80%" />
            </ItemName>
            <ItemDescription>
                <Skeleton variant="text" width="90%" />
            </ItemDescription>
            <Skeleton variant="text" width="60px" />
        </ItemContentAlignment>
    ) : (
        <ItemContentAlignment>
            <Fragment>
            <ItemImage style={{
                backgroundImage: 'url(' + item.image + ')',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
            }}>
            </ItemImage>
            <ItemName>
                {item.name}
            </ItemName>
            <ItemPrice>
                {item.price}DA
            </ItemPrice>
            <ItemDescription>
                {item.description}
            </ItemDescription>
            <AvailablityTag className={item.isAvailable ? 'available' : ''}>
                <OffmarketContent>{ item.isAvailable ? 'available' : 'not available' }</OffmarketContent> 
            </AvailablityTag>
            </Fragment>
        </ItemContentAlignment>
    );
}

export default NewArrivalItem