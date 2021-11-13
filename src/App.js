import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home/Home/Home';
import Login from './pages/Authentication/Login/Login';
import Register from './pages/Authentication/Register/Register';
import Products from './pages/Shared/All Products/Products/Products';
import Navigation from './pages/Home/Navigation/Navigation';
import ProductDetails from './pages/Shared/All Products/Product Details/ProductDetails';
import AuthProvider from './context/AuthProvider';
import PrivateRoute from './Private Route/PrivateRoute';
import Dashboard from './pages/Dashboard/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Router>
        <Navigation></Navigation>
        <Switch>
          <Route exact path='/'>
            <Home></Home>
          </Route>
          <Route path='/login'>
            <Login></Login>
          </Route>
          <Route path='/register'>
            <Register></Register>
          </Route>
          <PrivateRoute path='/products/:productId'>
            <ProductDetails></ProductDetails>
          </PrivateRoute>
          <Route path='/products'>
            <Products></Products>
          </Route>
          <PrivateRoute path='/dashboard'>
            <Dashboard></Dashboard>
          </PrivateRoute>
        </Switch>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
