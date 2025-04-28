import { ThemeProvider } from '@mui/material';
import './App.css';
import AppBar from './commun/components/appbar';
import LandingPage from './features/landing/landing';
import theme from './commun/utils/theme';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
      <div className="App">
        <header className="App-header"></header>
        <AppBar />
        <div className="content">
          <Switch>
            <Route path='/admin/products/create'>
              <CreateProductPage/>
            </Route>
            <Route path='/admin/auth'>
              <AdminAuthPage/>
            </Route>
            <Route path="/admin/products">
              <ProductsBoardPage/>
            </Route>
            <Route path='/admin/orders'>
              <OrdersBoardPage/>
            </Route>
            <Route path="/auth/success">
              <AuthSuccess/>
            </Route>
            <Route path="/shop">
              <ShopPage />
            </Route>
            <Route path='/product/:id'>
              <ProductPage/>
            </Route>
            <Route path='/orders'>
              <OrdersPage/>
            </Route>
            <Route path="/">
              <LandingPage />
            </Route>
          </Switch>
        </div>
        <BottomNav/>
        <Footer/>
      </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
