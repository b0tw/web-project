import React, { useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
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
  Row
} from 'reactstrap'

export default function Login({ useAuthHandler })
{
  const authHandler = useAuthHandler();
  const history = useHistory();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleChange = e => {
    if(e.target.id === 'username')
    {
      setUsername(e.target.value);
    }
    else if(e.target.id === 'password')
    {
      setPassword(e.target.value);
    }
  };
  const login = async () => {
    const user = {
      username: username,
      password: password
    };

    await authHandler.login(user, resp => resp.message ? setError(resp.message) : history.push(location.state || { from: '/' }));
  };

  return (
    <div>
      {authHandler.isAuthenticated()
      ? (<Redirect to="/" />)
      : (<div>
        <Modal isOpen={error.length > 0} toggle={() =>setError('')}>
          <ModalHeader>Error trying to login.</ModalHeader>
          
          <ModalBody>
            <Alert color="danger">{error}</Alert>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={() => setError('')}>Ok</Button>
          </ModalFooter>
        </Modal>

        <Container className="py-2">
          <Row>
            <Col md="4" className="mx-auto">
              <Card>
                <CardBody>
                  <CardTitle>Login to AnonGrading</CardTitle>
                  <Form onSubmit={e => e.preventDefault()} method="POST" className="text-left">
                    <FormGroup>
                      <Label for="username">Username</Label>
                      <Input id="username" name="username" type="text" placeholder="jdoe23" value={username} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">password</Label>
                      <Input id="password" name="password" type="password" placeholder="abc123" value={password} onChange={handleChange} />
                    </FormGroup>

                    <Button onClick={login} className="w-100 text-center">Login</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>)}
    </div>
  );
}
