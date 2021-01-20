import { useState, useEffect } from 'react';
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
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table
} from 'reactstrap';
import ApiRequestHandler from '../entities/ApiRequestHelper';
import { useParams } from 'react-router-dom';

export default function Team({ useAuthHandler, onlyStudents, onlyProfessors }) {
    const authHandler = useAuthHandler();
    const [members, setMembers] = useState(null);
    const [deliverables, setDeliverables] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState(null);
    const { teamId } = useParams();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState)

    const renderMembers = () => {
        return (<Card>
            <CardHeader>
                <CardTitle tag="h3"> Members</CardTitle>
            </CardHeader>
            <CardBody>
                <Table responsive striped hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Surname</th>
                            <th>Name</th>
                            {/* {renderRemoveButtonHeader()} */}
                        </tr>
                    </thead>
                    <tbody>
                        {members && members.map((j, i) =>
                            <tr key={j.id}>
                                <th scope="row">{i + 1}</th>
                                <th>{j.username}</th>
                                <th>{j.surname}</th>
                                <th>{j.name}</th>
                                {/* {renderRemoveButton(j.id)} */}
                            </tr>)
                        }
                    </tbody>
                </Table>
            </CardBody>
        </Card>)
    }

    const renderDeliverables = () => {
        return (<Card>
            <CardHeader>
                <CardTitle tag="h3"> Deliverables</CardTitle>
            </CardHeader>
            <CardBody>
                <Table responsive striped hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Url</th>
                            {/* {renderRemoveButtonHeader()} */}
                        </tr>
                    </thead>
                    <tbody>
                        {deliverables && deliverables.map((j, i) =>
                            <tr key={j.id}>
                                <th scope="row">{i + 1}</th>
                                <th>{j.title}</th>
                                <th>{j.description}</th>
                                <th>{j.url}</th>
                                {/* {renderRemoveButton(j.id)} */}
                            </tr>)
                        }
                    </tbody>
                </Table>
            </CardBody>
        </Card>)
    }
    // const getUsers = async () => {
    //     const requestHandler = new ApiRequestHandler();
    //     await requestHandler.get('/users', {
    //         query: `?is_professor=${onlyStudents ? 0 : (onlyProfessors ? 1 : 0)}`,
    //         headers: authHandler.getAthorizationHeader()
    //     }, async resp => {
    //         let stdnts = [];
    //         for (let i = 0; i < Object.keys(resp).length - 1; i++) {
    //             stdnts.push(resp[i])
    //         }
    //         setUsers(stdnts)
    //     });
    // };
    const addMemberDropdown = () => {
        console.log(users);
        return (
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret>
                    Add member to team
                    </DropdownToggle>
                <DropdownMenu>
                    {users && users.map((j, i) => {
                        <DropdownItem >
                            {j.username}
                        </DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        )
    }
    useEffect(() => {
        const requestHandler = new ApiRequestHandler();
        (async () => {
            await requestHandler.get('/users', {
                query: `?username=${authHandler.getUsername()}`,
                headers: authHandler.getAthorizationHeader()
            }, resp => resp.status === 200 && setCurrentUser(resp[0]));

            await requestHandler.get(`/teams/${teamId}`, {
                headers: authHandler.getAthorizationHeader()
            }, async resp => {
                setDeliverables(resp.Deliverables);
                setMembers(resp.Users);
            });
            await requestHandler.get('/users', {
                query: `?is_professor=${onlyStudents ? 0 : (onlyProfessors ? 1 : 0)}`,
                headers: authHandler.getAthorizationHeader()
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
        <Col>
            <Row xs="2">
                <Col>{renderMembers()}</Col>
                <Col>{renderDeliverables()}</Col>
            </Row>
            {addMemberDropdown()}
        </Col>
    );
}