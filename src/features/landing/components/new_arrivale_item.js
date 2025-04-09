import { styled } from "@mui/material";

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
    alignSelf: 'end'
}))

const ItemPrice = styled('p')(({theme}) => ({
    justifySelf: 'end',
    fontFamily: theme.typography.fontFamily,
    fontSize: 22,
}))

const ItemDescription = styled('p')(({theme}) => ({
    gridColumn: 'span 2',
    fontSize: 12,
    color: theme.palette.text.secondary,
    marginBottom: 10,
    textAlign: 'start',
    fontFamily: theme.typography.fontFamily,
}))

const OffmarketTag = styled('div')(({theme}) =>({
    border: `${theme.palette.error.main} 1px solid`,
    borderRadius: 50,
    textAlign: 'center',
    justifySelf: 'start',
    padding: '2px 10px'
}))

const OffmarketContent = styled('p')(({theme}) => ({
    fontSize: 12,
    color: theme.palette.error.main,
    fontFamily: theme.typography.fontFamily
}))

const NewArrivalItem = (props) => {
    let item = props.item

    return ( <ItemContentAlignment>
        <ItemImage style={{
            backgroundImage: 'url(' + item.image + ')',
        }}>
        </ItemImage>
        <ItemName>
            {item.name}
        </ItemName>
        <ItemPrice>
            {item.price}
        </ItemPrice>
        <ItemDescription>
            {item.description}
        </ItemDescription>
        <OffmarketTag>
            <OffmarketContent>off market!</OffmarketContent> 
        </OffmarketTag>
    </ItemContentAlignment>);
}

export default NewArrivalItem