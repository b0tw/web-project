import {useEffect, useState} from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'reactstrap';
import ApiRequestHelper from '../entities/ApiRequestHelper';

const renderTeams = teams =>
{
  return (
    <Table responsive striped hover>
      <thead>
        <th>#</th>
        <th>Team name</th>
        <th>Project name</th>
        <th>Grade</th>
        <th>Deadline to alter grade</th>
      </thead>

      <tbody>
        {teams && teams.map((t, i) => (
          <tr key={t.id}>
            <th scope="row">{i + 1}</th>
            <th>{t.name}</th>
            <th>{t.project_name}</th>
            <th>{(t.Jury.grades.reduce((sum, g) => sum + g, 0) / t.Jury.grades.length).toFixed(2)}</th>
            <th>{t.Jury.UserJury.deadline && t.Jury.UserJury.deadline.replace('T', ' ').substr(0, t.Jury.UserJury.deadline.length - 5)}</th>
          </tr>
        ))}
        {!teams &&
          <tr>
            <th colSpan="5">No assigned teams found.</th>
          </tr>}
      </tbody>
    </Table>
  );
};

const createModal = (color, message, toggle) =>
{
  return (
    <Modal isOpen={message.length > 0} toggle={toggle}>
      <ModalHeader>{ color === 'success' ? 'Success' : 'Error' }</ModalHeader>
      
      <ModalBody>
        <Alert color={color}>{message}</Alert>
      </ModalBody>
      
      <ModalFooter>
        <Button color="primary" onClick={toggle}>Ok</Button>
      </ModalFooter>
    </Modal>
  );
};

export default function Grade({ useAuthHandler })
{
  const authHandler = useAuthHandler();
  const [teams, setTeams] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(_ =>
  {
    const requestHandler = new ApiRequestHelper();

    (async _ => {
      requestHandler.get(`/users/${authHandler.getUsername()}`, {
        headers: authHandler.getAuthorizationHeader()
      }, resp => resp.status === 200 ? setTeams(resp[0].Teams) : setError(resp.message));
    })();
  }, [authHandler]);

  return (
    <Container className="py-2">
      {createModal('success', success, _ => setSuccess(''))}
      {createModal('danger', error, _ => setError(''))}
      <Card>
        <CardHeader>Projects assigned for grading</CardHeader>
        <CardBody>
          {renderTeams(teams)}
        </CardBody>
      </Card>
    </Container>
  );
}
