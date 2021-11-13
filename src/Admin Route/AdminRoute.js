import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Redirect, Route } from 'react-router';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children, ...rest }) => {
    let { user, isAdmin, isLoading } = useAuth();

    if(isLoading){
        return ( 
            <div className='h-100 d-flex justify-content-center align-items-center'>
                <Spinner className='mt-5' animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
            );
    }
    return (
        <Route
          {...rest}
          render={({ location }) =>
            user?.email && isAdmin ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: location }
                }}
              />
            )
          }
        />
      );
};

export default AdminRoute;