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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
      <div className="App">
        <header className="App-header"></header>
        <AppBar />
        <div className="content">
          <Switch>
            <Route path="/auth/success">
              <AuthSuccess/>
            </Route>
            <Route path="/shop">
              <ShopPage />
            </Route>
            <Route path='/product'>
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
      </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
