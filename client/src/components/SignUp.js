import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
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
import ApiRequestHandler from '../entities/ApiRequestHelper';

export default function SignUp({ useAuthHandler })
{
  const authHandler = useAuthHandler();
  const requestHandler = new ApiRequestHandler();
  const [userData, setUserData] = useState({
    username: '', 
    name: '',
    surname: '',
    email: '',
    password: '',
    is_professor: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleChange = e => {
    let currentData = { ...userData };
    if(e.target.type === 'checkbox')
    {
      currentData[e.target.name] = e.target.checked;
    }
    else
    {
      currentData[e.target.name] = e.target.value;
    }
    setUserData(currentData);
  };
  const signUp = async () => {
    const user = { ...userData };
    user.is_professor = user.is_professor ? 1 : 0;

    requestHandler.post('/users', { body: user }, resp => {
      if(resp.status === 200)
      {
        setSuccess(resp.message);
      }
      else
      {
        setError(resp.message);
      }
    });
  };

  return (
    <div>
      {authHandler.isAuthenticated()
      ? (<Redirect to="/" />)
      : (<div>
        <Modal isOpen={success.length > 0} toggle={() => setSuccess('')}>
          <ModalHeader>Account created.</ModalHeader>
          
          <ModalBody>
            <Alert color="success">{success} Please login with your new account.</Alert>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={() => setSuccess('')}>Ok</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={error.length > 0} toggle={() => setError('')}>
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
                  <CardTitle>Sign up for AnonGrading</CardTitle>
                  <Form onSubmit={e => e.preventDefault()} method="POST" className="text-left">
                    <FormGroup>
                      <Label for="username">Username</Label>
                      <Input id="username" name="username" type="text" placeholder="jdoe23" value={userData.username} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="surname">Surname</Label>
                      <Input id="surname" name="surname" type="text" placeholder="Doe" value={userData.surname} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input id="name" name="name" type="text" placeholder="John" value={userData.name} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">password</Label>
                      <Input id="password" name="password" type="password" placeholder="abc123" value={userData.password} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input id="is_professor" type="checkbox" name="is_professor" checked={userData.is_professor} onChange={handleChange} />{' '}
                        Professor account.
                      </Label>
                    </FormGroup>

                    <Button onClick={signUp} className="w-100 text-center">Sign up</Button>
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
