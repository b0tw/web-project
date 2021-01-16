import React, { useState, useEffect } from 'react';
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
import { Redirect, Link } from 'react-router-dom';
import ApiRequestHandler from '../entities/ApiRequestHelper';

export default function Students({ useAuthHandler }) {
    const authHandler = useAuthHandler();

    const [students, setStudents] = useState([]);


    const renderStudents = () => {
        console.log(students)
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h3">Student list</CardTitle>
                </CardHeader>
                <CardBody>
                    <Table responsive striped hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Surname</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                students && students.map((j, i) =>
                                    <tr key={j.id} tag={Link} to={"/users/" + j.username}>
                                        <th scope="row">{i + 1}</th>
                                        <th>{j.username}</th>
                                        <th>{j.surname}</th>
                                        <th>{j.name}</th>
                                    </tr>)
                                
                            }
                        </tbody>
                    </Table>
                </CardBody></Card>
        )
    }
    useEffect(() => {
        const requestHandler = new ApiRequestHandler();
        (async () => {
            await requestHandler.get('/users/', {
                query: `?is_professor=0`,
                headers: { Authorization: `Bearer ${authHandler.getToken()}` }
            }, async resp => {
                let stdnts = [];
                for (let i = 0; i < Object.keys(resp).length - 1; i++) {
                    stdnts.push(resp[i])
                }
                setStudents(stdnts)
            }
            );
        })();
    }, [authHandler]);
    return (
        renderStudents()
    )
}