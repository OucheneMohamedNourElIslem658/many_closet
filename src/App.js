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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
      <div className="App">
        <header className="App-header"></header>
        <AppBar />
        <div className="content">
          <Routes>
            <Route path='/admin/products/:id/edit' element={<UpdateProductPage />} />
            <Route path='/admin/products/create' element={<CreateProductPage />} />
            <Route path='/admin/auth' element={<AdminAuthPage />} />
            <Route path="/admin/products" element={<ProductsBoardPage />} />
            <Route path='/admin/orders' element={<OrdersBoardPage />} />
            <Route path='/admin/orders/:id' element={<OrdersBoardPage />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path='/products/:id' element={<ProductPage />} />
            <Route path='/orders' element={<OrdersPage />} />
            <Route path='/orders/:id' element={<OrdersPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<ErrorComponent
                error={"The page you are looking for does not exist."}
            />} />
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
