import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import useAuth from '../../../hooks/useAuth';

const MyOrders = () => {
    const [orders, setorders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        axios.get(`https://bikezone-server.onrender.com/orders/${user?.email}`)
        .then(({ data }) => {
            console.log(data);
            setorders(data);
        })
    }, [user?.email]);

    const handleDelete = (id) => {
        console.log(id);
        swal("Are you sure?", {
            dangerMode: true,
            buttons: true,
          }).then(result => {
              if(result){
                axios.delete(`https://bikezone-server.onrender.com/orders/${id}`)
                .then(({ data }) => {
                    console.log(data);
                    if(data.deletedCount === 1){
                        swal({
                            title: "Successfully Deleted!",
                            icon: "success",
                            button: "ok",
                          });
                        const filtered = orders.filter(user => user._id !== id);
                        setorders(filtered);
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
            <Table striped hover className="w-75 mx-auto mt-5">
            <thead>
                <tr>
                <th className='text-center py-3' scope="col" >Name</th>
                <th className='text-center py-3' scope="col" >Price</th>
                <th className='text-center py-3' scope="col" >Delivery Location</th>
                <th className='text-center py-3' scope="col" >Order Status</th>
                <th className='text-center py-3' scope="col" >Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    orders.map(order => 
                        <tr key={order?._id}>
                            <td className='py-4' align="center">{order?.customerName}</td>
                            <td className='py-4' align="center">{order?.price}</td>
                            <td className='py-4' align="center">{order?.deliveryLocation}</td>
                            <td className='py-4' align="center">{order?.orderStatus}</td>
                            {
                                order?.orderStatus === 'Shipped' ?
                                <td className='py-4' align="center"><Button disabled variant='transparent'><Image src='https://i.ibb.co/jDqXJSc/3221897.png' width='28'/></Button></td>
                                :
                                <td className='py-4' align="center"><Button variant='transparent' onClick={() => handleDelete(order?._id)}><Image src='https://i.ibb.co/jDqXJSc/3221897.png' width='28'/></Button></td>

                            }
                        </tr>
                    )
                }
            </tbody>
            </Table>
            <Row>

            </Row>
        </div>
    );
};

export default MyOrders;