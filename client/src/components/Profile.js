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
  Table
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
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Team name</th>
                <th>Project name</th>
              </tr>
            </thead>
            <tbody>
              { user && user.Teams && user.Teams.length > 0 &&
                  user.Teams.map((t, i) => <tr key={t.id}>
                    <th scope="row">{i + 1}</th>
                    <th>{t.name}</th>
                    <th>{t.project_name}</th>
                  </tr>)
              }
              { !(user && user.Teams && user.Teams.length > 0) &&
                <tr>
                  <th colSpan="3">Not a member of a team.</th>
                </tr>
              }
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
  const renderJuries = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h5">Jury member in</CardTitle>
        </CardHeader>
        <CardBody>
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Team name</th>
                <th>Project name</th>
                <th>Graded awarded</th>
                <th>Deadline to modify grade</th>
              </tr>
            </thead>
            <tbody>
              { user && user.Juries && user.Juries.length > 0 &&
                  user.Juries.map((j, i) => <tr key={j.id}>
                    <th scope="row">{i + 1}</th>
                    <th>{j.Team.name}</th>
                    <th>{j.Team.project_name}</th>
                    <th>{j.UserJury.grade}</th>
                    <th>{j.UserJury.deadline && j.UserJury.deadline.replace('T', ' ').substr(0, j.UserJury.deadline.length - 5)}</th>
                  </tr>)
              }
              { !(user && user.Juries && user.Juries.length > 0) &&
                <tr>
                  <th colSpan="5">Not a jury of a team.</th>
                </tr>
              }
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }

  const renderTeamsAndJuries = () => (
      <Row xs="2">
        <Col>{renderTeams()}</Col>
        <Col>{renderJuries()}</Col>
      </Row>
  );
    
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
      <Row className="my-2 mb-3">
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
      {renderTeamsAndJuries()}
    </Container>
  );
}
