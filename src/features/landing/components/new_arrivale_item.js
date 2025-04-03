import { styled } from "@mui/material";

const ItemContentAlignment = styled('li')({
    width: 250,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 10,
})

const ItemImage = styled('div')({
    height: '150px',
    backgroundSize: 'cover',
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    gridColumn: 'span 2',
    marginBottom: 10,
})

const ItemName = styled('h3')({
    whiteSpace: 'nowrap',
    marginBottom: 3,
    textAlign: 'start'
})

const ItemPrice = styled('h3')({
    justifySelf: 'end'
})

const ItemDescription = styled('p')(({theme}) => ({
    gridColumn: 'span 2',
    fontSize: 13,
    color: theme.palette.text.secondary,
    marginBottom: 10,
    textAlign: 'start'
}))

const OffmarketTag = styled('div')(({theme}) =>({
    border: `${theme.palette.error.main} 1px solid`,
    borderRadius: 50,
    textAlign: 'center',
    justifySelf: 'start',
    padding: '2px 10px'
}))

const OffmarketContent = styled('p')(({theme}) => ({
    fontSize: 13,
    color: theme.palette.error.main
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