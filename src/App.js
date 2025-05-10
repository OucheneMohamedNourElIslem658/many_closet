import { ThemeProvider } from '@mui/material';
import './App.css';
import AppBar from './commun/components/appbar';
import LandingPage from './features/landing/landing';
import theme from './commun/utils/theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShopPage from './features/shop/shop';
import ProductPage from './features/product/product';
import OrdersPage from './features/orders/orders';
import AuthSuccess from './features/landing/components/auth_success';
import Footer from './commun/components/footer';
import BottomNav from './commun/components/bottom_nav';
import AdminAuthPage from './features/auth/admin_auth';
import ProductsBoardPage from './features/product/products_board';
import OrdersBoardPage from './features/orders/orders_board';
import CreateProductPage from './features/product/create_product';
import UpdateProductPage from './features/product/edit_product';
import ErrorComponent from './commun/components/error';
import { Helmet } from 'react-helmet';
import OrdersPrices from './features/orders/orders_prices';
import CreateOrderPrice from './features/orders/create_order_price';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
      <div className="App">
        <header className="App-header"></header>
        <Helmet>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Welcome to Many Closet, your one-stop shop for all your fashion needs." />
            <meta name="keywords" content="fashion, shop, clothing, accessories" />
            <meta name="author" content="Many Closet Team" />
            <title>Many Closet</title>
        </Helmet>
        <AppBar />
        <div className="content">
          <Routes>
            <Route path='/admin/products/:id/edit' element={<UpdateProductPage />} />
            <Route path='/admin/products/create' element={<CreateProductPage />} />
            <Route path='/admin/auth' element={<AdminAuthPage />} />
            <Route path="/admin/products" element={<ProductsBoardPage />} />
            <Route path='/admin/orders' element={<OrdersBoardPage />} />
            <Route path='/admin/orders/prices/create' element={<CreateOrderPrice />} />
            <Route path='/admin/orders/:id' element={<OrdersBoardPage />} />
            <Route path='/admin/orders/prices' element={<OrdersPrices />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path='/products/:id' element={<ProductPage />} />
            <Route path='/orders' element={<OrdersPage />} />
            <Route path='/orders/:id' element={<OrdersPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path='/new' element={<LandingPage/>}/>
            <Route path='/contact' element={<LandingPage/>}/>
            <Route path="*" element={<ErrorComponent
                error={"The page you are looking for does not exist."}
            />} 
          />
          </Routes>
        </div>
        <BottomNav/>
        <Footer/>
      </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
