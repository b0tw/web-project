import { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import ApiRequestHandler from '../entities/ApiRequestHelper';

export default function Profile({ useAuthHandler })
{
  const authHandler = useAuthHandler();
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
    
  console.log(user);
  useEffect(() => {
    const requestHandler = new ApiRequestHandler();

    (async () => 
      await requestHandler.get('/users', {
        query: `?username=${authHandler.getUsername()}`,
        headers: { Authorization: `Bearer ${authHandler.getToken()}` }
      }, resp => resp && (resp.status !== 200 || resp.length < 1) ? setError(resp.message) : setUser(resp[0])))();
  }, [authHandler]);

  return (
    <Container className="py-2">
      <Modal isOpen={error.length > 0} toggle={() => setError('')}>
        <ModalHeader>Could not retrieve user data. Please try again later.</ModalHeader>
        <ModalBody>
          <Alert color="danger">{error}</Alert>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => setError('')}>Ok</Button>
        </ModalFooter>
      </Modal>
      { user && 
      <Row>
        <Col md="4" className="mx-auto">
          <Card>
            <CardBody>
              <CardTitle tag="h4">{`${user.surname}, ${user.name}`}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">{user.is_professor === 1 ? 'Professor' : 'Student'}</CardSubtitle>
            </CardBody>
          </Card>
        </Col>
      </Row>
      }
    </Container>
  );
}
