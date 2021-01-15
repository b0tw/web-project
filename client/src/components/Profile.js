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
  const renderTeams = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h5">Teams</CardTitle>
        </CardHeader>
        <CardBody>
          <Container>
            { user && user.Teams && user.Teams.length > 0 &&
                user.Teams.map(t => <Row key={t.id}><Col md="3">{t.name}</Col><Col md="3">{t.project_name}</Col></Row>)
            }
            { !(user && user.Teams && user.Teams.length > 0) &&
              <Row>
                <Col>Not a member of a team.</Col>
              </Row>
            }
          </Container>
        </CardBody>
      </Card>
    );
  }
  const renderJuries = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h5">Jury member</CardTitle>
        </CardHeader>
        <CardBody>
          <Container>
            { user && user.Juries && user.Juries.length > 0 &&
                user.Juries.map(j => <Row key={j.id}><Col md="3">Judges: </Col><Col md="3">{j.Team.name}</Col><Col md="3">{j.Team.project_name}</Col></Row>)
            }
            { !(user && user.Juries && user.Juries.length > 0) &&
              <Row>
                <Col>Not a jury of a team.</Col>
              </Row>
            }
          </Container>
        </CardBody>
      </Card>
    );
  }
    
  console.log(user);
  useEffect(() => {
    const requestHandler = new ApiRequestHandler();

    (async () => 
      await requestHandler.get('/users', {
        query: `?username=${authHandler.getUsername()}`,
        headers: { Authorization: `Bearer ${authHandler.getToken()}` }
      }, async resp => {
        if (resp && (resp.status !== 200 || resp.length < 1))
        {
          setError(resp.message);
        }
        else
        {
          await requestHandler.get(`/users/${resp[0].id}`, {
            headers: { Authorization: `Bearer ${authHandler.getToken()}` }
          }, userResp => userResp && userResp.status !== 200 ? setError(userResp.message) : setUser(userResp));
        }
      }))();
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
      {renderTeams()}
      {renderJuries()}
    </Container>
  );
}
