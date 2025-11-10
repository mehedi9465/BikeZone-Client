import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Image } from 'react-bootstrap';
import swal from 'sweetalert';

const ManageAllOrder = () => {
    const [orders, setOrders] = useState([]);
    const [dependency, setDependencey] = useState({});
    useEffect(() => {
        axios.get('https://bikezone-server.onrender.com/orders')
        .then(({ data }) => setOrders(data))
    }, [dependency]);

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
                        alert('Successfully Deleted');
                        const filtered = orders.filter(order => order._id !== id);
                        setOrders(filtered);
                    }
                    else{
                        alert('Failed to Delete')
                    }
                });
              }
          })
    }

    const handleShipping = (id) => {
        console.log(id);
        swal("Do you want to start Shipping?", {
            buttons: true,
          }).then(result => {
              if(result){
                axios.put(`https://bikezone-server.onrender.com/orders/shipping/${id}`)
                .then(({ data }) => {
                    console.log(data);
                    if(data.modifiedCount === 1){
                        swal({
                            title: "Successfully Shipped!",
                            icon: "success",
                            button: "ok",
                          });
                        setDependencey(data)
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
            <h1 className='text-center'>Orders Found: {orders?.length}</h1>
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
                                <td className='py-4' align="center"><Button onClick={() => handleDelete(order?._id)} variant='transparent'><Image src='https://i.ibb.co/jDqXJSc/3221897.png' width='28'/></Button></td>
                                :
                                <td className='py-4' align="center"><Button variant='transparent' onClick={() => handleShipping(order?._id)} ><Image src='https://cdn-icons-png.flaticon.com/512/600/600186.png' width='28'/></Button> <Button variant='transparent' onClick={() => handleDelete(order?._id)}><Image className='ms-3' src='https://i.ibb.co/jDqXJSc/3221897.png' width='28'/></Button> </td>

                            }
                        </tr>
                    )
                }
            </tbody>
            </Table>
        </div>
    );
};

export default ManageAllOrder;