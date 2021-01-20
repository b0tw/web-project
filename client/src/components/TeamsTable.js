import React, { useState, useEffect } from 'react';
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Table
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ApiRequestHandler from '../entities/ApiRequestHelper';

export default function TeamsTable({ useAuthHandler, onlyStudents, onlyProfessors }) {
    const authHandler = useAuthHandler();
    const [teams, setTeams] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const deleteTeam = async id => {
        const requestHandler = new ApiRequestHandler();
        await requestHandler.delete(`/teams/${id}`, {
            headers: authHandler.getAuthorizationHeader()
        }, resp => resp.status === 204 ? setSuccess(`Successfully removed team.`) : setError('Could not remove team. Please try again later.'));
    };

    const renderRemoveButton = id => {
        if (!onlyProfessors && currentUser && currentUser.is_professor) {
            return (<th><Button size="xs" color="danger" onClick={async () => await deleteTeam(id)}>Remove</Button></th>);
        }

        return null;
    }
    const renderRemoveButtonHeader = _ => {
        if (!onlyProfessors && currentUser && currentUser.is_professor) {
            return (<th>Action</th>);
        }

        return null;
    }
    const renderTeams = () => {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h3"> Teams</CardTitle>
                </CardHeader>
                <CardBody>
                    <Table responsive striped hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Project name</th>
                                {renderRemoveButtonHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {teams && teams.map((j, i) =>
                                <tr key={j.id}>
                                    <th scope="row">{i + 1}</th>
                                    <th><Link to={`/teams/${j.id}`}>{j.name}</Link></th>
                                    <th>{j.project_name}</th>
                                    {renderRemoveButton(j.id)}
                                </tr>)
                            }
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        )
    }
    useEffect(() => {
        const requestHandler = new ApiRequestHandler();
        (async () => {
            await requestHandler.get('/users', {
                query: `?username=${authHandler.getUsername()}`,
                headers: authHandler.getAuthorizationHeader()
            }, resp => resp.status === 200 && setCurrentUser(resp[0]));

            await requestHandler.get('/teams', {
                headers: authHandler.getAuthorizationHeader()
            }, async resp => {
                let teamList = [];
                for (let i = 0; i < Object.keys(resp).length - 1; i++) {
                    teamList.push(resp[i])
                }
                setTeams(teamList)
            });
        })();
    }, [authHandler, onlyStudents, onlyProfessors]);

    return (
        renderTeams()
    )
}