import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Container,
    Table
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ApiRequestHandler from '../entities/ApiRequestHelper';

export default function UsersTable({ useAuthHandler, onlyStudents, onlyProfessors }) {
    const authHandler = useAuthHandler();
    const [users, setUsers] = useState([]);

    const renderUsers = () => {
        return (
            <Container>
                <Card>
                    <CardHeader>
                        <CardTitle tag="h3">{onlyStudents ? 'Registered Student' : (onlyProfessors ? 'Registered Professors' : 'Users') }</CardTitle>
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
                                { users && users.map((j, i) =>
                                    <tr key={j.id}>
                                        <th scope="row">{i + 1}</th>
                                        <th><Link to={`/user/${j.username}`}>{j.username}</Link></th>
                                        <th>{j.surname}</th>
                                        <th>{j.name}</th>
                                    </tr>)
                                }
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Container>
        )
    }
    useEffect(() => {
        const requestHandler = new ApiRequestHandler();
        (async () => {
            await requestHandler.get('/users', {
                query: `?is_professor=${onlyStudents ? 0 : (onlyProfessors ? 1 : 0)}`,
                headers: { Authorization: `Bearer ${authHandler.getToken()}` }
            }, async resp => {
                let stdnts = [];
                for (let i = 0; i < Object.keys(resp).length - 1; i++) {
                    stdnts.push(resp[i])
                }
                setUsers(stdnts)
            });
        })();
    }, [authHandler, onlyStudents, onlyProfessors]);
    return (
        renderUsers()
    )
}