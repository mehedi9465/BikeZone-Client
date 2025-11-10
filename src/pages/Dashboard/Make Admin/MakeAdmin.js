import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import swal from 'sweetalert';

const MakeAdmin = () => {
    const [email, setEmail] = useState('');
    const [adminList, setAdminList] = useState([]);
    const [dependency, setDependency] = useState({});

    useEffect(() => {
        axios.get('https://bikezone-server.onrender.com/users/admin')
        .then(({data}) => setAdminList(data))
    }, [dependency]);



    const handleOnSubmit = e => {
        e.preventDefault();
        axios.put(`https://bikezone-server.onrender.com/users/admin/${email.toLowerCase()}`)
        .then(({ data }) => {
            if(data.modifiedCount){
                swal({
                  title: "Done!",
                  icon: "success",
                  button: "ok",
                });
              }
            else if(data.matchedCount && !data.modifiedCount){
                swal({
                    title: "Already a Admin!",
                    icon: "success",
                    button: "ok",
                  });
            }
              else{
                swal({
                  title: "Something Went Wrong!",
                  icon: "error",
                  button: "ok",
                });
              }
              e.target.value= '';
              setDependency(data)
        })
        console.log(email);
    }

    const handleOnBlur = e => {
        setEmail(e.target.value);
    }

    return (
        <div>
            <Container>
                <Row className='justify-content-center my-5 py-5'>
                    <Col xl={7} lg={7} md={8} sm={9} xs={9}>
                    <Form className='d-flex flex-column justify-content-center align-items-center mt-5 pt-5' onSubmit={handleOnSubmit}>
                    <Form.Floating className="mb-3 w-100">
                        <Form.Control
                            required
                            placeholder='Email'
                            type="email"
                            name='email'
                            onBlur={handleOnBlur}
                            />
                            <label htmlFor="floatingInputCustom">Email</label>
                        </Form.Floating>
                        <Button type='submit'>Make Admin</Button>
                    </Form>
                    </Col>
                </Row>
                <Row className='pb-5 mb-5'>
                <Table striped hover className="w-75 mx-auto mt-5">
                    <thead>
                        <tr>
                            <th className='text-center py-3' scope="col" >Name</th>
                            <th className='text-center py-3' scope="col" >Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            adminList.map(admin => 
                                <tr key={admin?._id}>
                                    <td className='py-4' align="center">{admin?.displayName}</td>
                                    <td className='py-4' align="center">{admin?.email}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
                </Row>
            </Container>
        </div>
    );
};

export default MakeAdmin;