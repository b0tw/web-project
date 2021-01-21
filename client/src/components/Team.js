import { useState, useEffect } from 'react';
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container,
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
import { useParams, Link } from 'react-router-dom';


const createModal = (color, message, toggle) => {
    const btnClickEvent = async e => {
        await toggle(e);
        if (color === 'success') {
            window.location.reload();
        }
    };

    return (
        <Modal isOpen={message.length > 0} toggle={toggle}>
            <ModalHeader>{color === 'success' ? 'Success' : 'Error'}</ModalHeader>

            <ModalBody>
                <Alert color={color}>{message}</Alert>
            </ModalBody>

            <ModalFooter>
                <Button color="primary" onClick={btnClickEvent}>Ok</Button>
            </ModalFooter>
        </Modal>
    );
};


export default function Team({ useAuthHandler }) {
    const authHandler = useAuthHandler();
    const [members, setMembers] = useState(null);
    const [deliverables, setDeliverables] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState(null);
    const { teamId } = useParams();
    const [isMembersModalOpen, toggleMembersModal] = useState(false);
    const [isDelivModalOpen, toggleDelivModal] = useState(false);
    const requestHandler = new ApiRequestHandler();

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
                        </tr>
                    </thead>
                    <tbody>
                        {members && members.map((j, i) =>
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
        </Card>)
    }
    const renderRemoveButtonHeader = () => currentUser && members && members.some(m => m.username === currentUser.username) ? <th></th> : null;
    const renderRemoveButton = (deliverableId) => {
        if (currentUser && members && members.some(m => m.username === currentUser.username)) {
            return (
                <Button color="danger"
                    onClick={async () => {
                        await requestHandler.delete(`/teams/${teamId}/deliverables`, {
                            body: [{ id: deliverableId }],
                            headers: authHandler.getAuthorizationHeader()
                        }, resp => resp.status !== 200 ? setError(resp.message) : setSuccess(resp.message))
                    }}>
                    Remove
                </Button>
            )
        }
        return null;
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
                            {renderRemoveButtonHeader()}
                        </tr>
                    </thead>
                    <tbody>
                        {deliverables && deliverables.map((j, i) =>
                            <tr key={j.id}>
                                <th scope="row">{i + 1}</th>
                                <th>{j.title}</th>
                                <th>{j.description}</th>
                                <th>{j.url}</th>
                                {renderRemoveButton(j.id)}
                            </tr>)
                        }
                    </tbody>
                </Table>
            </CardBody>
        </Card>)
    }
    const handleChange = async (e) => {
        await requestHandler.get('/users', {
            query: `?name=${e.target.value}&surname=${e.target.value}`,
            headers: authHandler.getAuthorizationHeader()
        }, resp => {
            if (resp.status !== 200) {
                setError(resp.message)
            }
            else {
                let users = [];
                for (let i = 0; i < Object.keys(resp).length - 1; i++) {
                    if (!members.some(m => m.username === resp[i].username) && resp[i].is_professor === 0)
                        users.push(resp[i])
                }
                setUsers(users)
            }
        });
    }

    const addMember = async (username, id) => {
        await requestHandler.post(`/teams/${teamId}/members`, {
            body: [{ username: username, id: id }],
            headers: authHandler.getAuthorizationHeader()
        }, resp => {
            if (resp.status !== 200) {
                setError(resp.message);
            }
            else {
                setSuccess(resp.message);
            }
        });
    }
    const addDeliverableButton = () => {
        if (currentUser && members && !members.some(m => m.username === currentUser.username)) {
            return null;
        }

        const submit = async () => {
            await requestHandler.post(`/teams/${teamId}/deliverables`, {
                headers: authHandler.getAuthorizationHeader(),
                body: { title: document.getElementById('title').value, description: document.getElementById('description').value, url: document.getElementById('url').value }
            }, resp => resp.status !== 200 ? setError(resp.message) : setSuccess(resp.message))
        }
        const delivModal = () => {
            return (
                <Modal isOpen={isDelivModalOpen} toggle={_ => toggleDelivModal(false)}>
                    <ModalHeader>Add deliverable</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={(e) => e.preventDefault()}>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input id="title" name="title"
                                    type="text" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input id="description" name="description"
                                    type="text" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="url">URL</Label>
                                <Input id="url" name="url"
                                    type="text" />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => toggleDelivModal(false)}>Cancel</Button>
                        <Button color="primary" onClick={submit}>Save</Button>
                    </ModalFooter>
                </Modal>
            )
        }
        return (
            <div className="py-2">
                {delivModal()}
                <Button color="primary" onClick={() => toggleDelivModal(true)}>
                    Add deliverable
                </Button>
            </div>
        )
    }
    const addMemberButton = () => {
        if (!currentUser || currentUser.is_professor === 0)
            return null;
        const usersModal = () => {
            return (
                <Modal isOpen={isMembersModalOpen} toggle={_ => toggleMembersModal(false)}>
                    <ModalHeader>Add member</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="filter">Filter</Label>
                            <Input id="filter" name="filter"
                                type="text" placeholder="john"
                                onChange={handleChange} />
                        </FormGroup>
                        <Table responsive striped hover>
                            <thead>
                                <tr>
                                    <th>Surname</th>
                                    <th>Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map((d, i) => (
                                    <tr key={i}>
                                        <th>{d.surname}</th>
                                        <th>{d.name}</th>
                                        <th><Button color="success" onClick={async () => await addMember(d.username, d.id)}>Add</Button></th>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => toggleMembersModal(false)}>OK</Button>
                    </ModalFooter>
                </Modal>
            )
        }
        return (
            <div className="py-3">
                {usersModal()}
                <Button color="primary" onClick={() => toggleMembersModal(true)}>
                    Add members
                </Button>
            </div>
        )
    }
    useEffect(() => {
        const requestHandler = new ApiRequestHandler();

        (async () => {
            await requestHandler.get('/users', {
                query: `?username=${authHandler.getUsername()}`,
                headers: authHandler.getAuthorizationHeader()
            }, resp => resp.message ? setError(resp.message) : setCurrentUser(resp[0]));

            await requestHandler.get(`/teams/${teamId}`, {
                headers: authHandler.getAuthorizationHeader()
            }, async resp => {
                setDeliverables(resp.Deliverables);
                setMembers(resp.Users);
            });
        })();
    }, [authHandler, teamId]);

    return (
        <Container className="py-2" fluid>
            {createModal('success', success, _ => setSuccess(''))}
            {createModal('danger', error, _ => setError(''))}
            <Row xs="2">
                <Col>{renderMembers()}</Col>
                <Col>{renderDeliverables()}</Col>
            </Row>
            <Row xs="2">
                <Col>{addMemberButton()}</Col>
                <Col>{addDeliverableButton()}</Col>
            </Row>
        </Container>
    );
}
