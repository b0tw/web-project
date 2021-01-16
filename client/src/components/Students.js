import React, { useState } from 'react';
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardSubtitle,
    CardTitle,
    Col,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table
  } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import ApiRequestHandler from '../entities/ApiRequestHelper';

export default function Students({ useAuthHandler }) {
    const authHandler = useAuthHandler();
    const requestHandler = new ApiRequestHandler();
    //request to get the students from the db
    //requestHandler.get('/users/?is_professor=0', async(res) =>{
    //    console.log(res.body);
   // });

    const renderStudents = () => {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h3">Student list</CardTitle>
                </CardHeader>
                <CardBody>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Surname</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        {/* afisam studentii */}
                        <tbody>

                        </tbody>
                    </Table>
                </CardBody></Card>
        )
    }
    return(
        renderStudents()
    )
}