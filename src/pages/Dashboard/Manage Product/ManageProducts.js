import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Row, Button, Table, Image } from 'react-bootstrap';
import { useHistory, useRouteMatch } from 'react-router';
import swal from 'sweetalert';

const ManageProducts = ({ url }) => {
    const [products, setProducts] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios.get('https://bikezone-server.onrender.com/products')
        .then(({ data }) => setProducts(data))
    }, []);

    const hanldeUpdate = id => {
        history.push(`${url}/${id}`);
    }

    const handleDelete = (id) => {
        console.log(id);
        swal("Are you sure?", {
            dangerMode: true,
            buttons: true,
          }).then(result => {
              if(result){
                axios.delete(`https://bikezone-server.onrender.com/products/${id}`)
                .then(({ data }) => {
                    console.log(data);
                    if(data.deletedCount === 1){
                        swal({
                            title: "Successfully Deleted!",
                            icon: "success",
                            button: "ok",
                          });
                        const filtered = products.filter(user => user._id !== id);
                        setProducts(filtered);
                    }
                    else{
                        swal({
                            title: "Something went wrong!",
                            icon: "error",
                            button: "ok",
                          });
                    }
                });
              }
          })
    }

    return (
        <div>
            <Table striped hover className="w-75 mx-auto my-5 table-responsive">
            <thead>
                <tr>
                <th className='text-center py-3' scope="col" >Name</th>
                <th className='text-center py-3' scope="col" >Emission</th>
                <th className='text-center py-3' scope="col" >Engine</th>
                <th className='text-center py-3' scope="col" >Price</th>
                <th className='text-center py-3' scope="col" >Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.map(product => 
                        <tr key={product?._id}>
                            <td className='py-4' align="center">{product?.title}</td>
                            <td className='py-4' align="center">{product?.emission}</td>
                            <td className='py-4' align="center">{product?.displacement}</td>
                            <td className='py-4' align="center">{product?.price}</td>
                            <td className='py-3' align="center"><Button variant='transparent' onClick={() => hanldeUpdate(product?._id)}><Image src='https://i.ibb.co/kmZWhGK/1601884.png' alt='Update' width='27'/></Button> <Button variant='transparent' onClick={() => handleDelete(product?._id)}><Image src='https://i.ibb.co/jDqXJSc/3221897.png' width='28'/></Button></td>
                        </tr>
                    )
                }
            </tbody>
            </Table>
        </div>
    );
};

export default ManageProducts;