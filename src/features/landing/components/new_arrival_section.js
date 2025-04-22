import { styled } from '@mui/material/styles';
import NewArrivalItem from './new_arrivale_item';
import { Button } from '@mui/material';
import { PromiseBuilder } from '../../../commun/components/promise_builder';
import { getProducts } from '../../../services/product';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import EmptyDataComponent from '../../../commun/components/empty';

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
    const itemsCount = 9

    return ( 
        <Content>
            <ContentHeader>
                <Title>New Arrival</Title>
                <Desc>Discover our latest collection of fashion items, carefully curated to bring you style and comfort.</Desc>
            </ContentHeader>
            <PromiseBuilder
                promise={() => getProducts({currentPage: 1, pageSize: itemsCount})}
                loading={
                    <Items>
                        {Array.from(new Array(itemsCount)).map((_, index) => (
                            <NewArrivalItem key={index} isLoading={true}/>
                        ))}
                    </Items>
                }
                builder={(data) => {
                    if (!data) {
                        return <EmptyDataComponent/>
                    }
                    
                    const products = data.products.map((product) => {
                        return {
                            id: product.$id,
                            name: product.name,
                            price: product.price,
                            description: product.description,
                            image: product.images?.[0]?.url || null,
                            status: product.status,
                            isAvailable: product.is_available,
                        }
                    })

                    return <Items>
                        {products.map((product) => (
                            <NewArrivalItem key={product.id} item={product} />
                        ))}
                    </Items>
                }}
            />
            <ViewAllButton variant='contained' component={Link} to='shop'>View All</ViewAllButton>
        </Content>
    );
}
 
export default NewArrivalSection;