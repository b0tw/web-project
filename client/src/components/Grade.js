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
  const formatDeadlineDate = jury =>
  {
    if(jury && jury.deadline)
    {
      return jury.deadline.replace('T', ' ').substr(0, jury.deadline.length - 5);
    }

    return null;
  };

  console.log()
  return (
    <Table responsive striped hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Team name</th>
          <th>Project name</th>
          <th>Grade</th>
          <th>Deadline to alter grade</th>
        </tr>
      </thead>

      <tbody>
        {teams && teams.values.filter(t => t.Jury.grades.some(g => g.userId === teams.userId)).map((t, i) => (
          <tr key={t.id}>
            <th scope="row">{i + 1}</th>
            <th>{t.name}</th>
            <th>{t.project_name}</th>
            <th>{t.Jury.grades.filter(g => g.userId === teams.userId)[0].value.toFixed(2)}</th>
            <th>{formatDeadlineDate(t.Jury.grades.filter(g => g.userId === teams.userId)[0])}</th>
          </tr>
        ))}
        {(!teams || teams.values.filter(t => t.Jury.grades.some(g => g.userId === teams.userId)).length < 1) &&
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

const getTeamsData = async (requestHandler, authHandler, teams, setTeams, setError) =>
{
  let detailedTeams = [], error = null;
  const processResp = resp => resp.status !== 200 ? error = resp.message : detailedTeams.push(resp);

  for(let t of teams.values)
  {
    await requestHandler.get(`/teams/${t.id}`, {
      headers: authHandler.getAuthorizationHeader()
    }, processResp);

    if(error != null)
    {
      break;
    }
  }

  if(error != null)
  {
    setError(error);
  }
  else
  {
    setTeams({ values: detailedTeams, userId: teams.userId });
  }
}

export default function Grade({ useAuthHandler })
{
  const authHandler = useAuthHandler();
  const [teams, setTeams] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(_ =>
  {
    const requestHandler = new ApiRequestHelper();

    (async _ => {
      requestHandler.get(`/users`, {
        query: `?username=${authHandler.getUsername()}`,
        headers: authHandler.getAuthorizationHeader()
      }, async resp => resp.status !== 200 ? setError(resp.message) : await requestHandler.get(`/users/${resp[0].id}`, {
        headers: authHandler.getAuthorizationHeader()
      }, async userResp => {
        if(userResp.status !== 200)
        {
          setError(userResp.message);
        }
        else
        {
          await getTeamsData(requestHandler, authHandler, { values: [ ...userResp.Juries.map(j => j.Team) ], userId: userResp.id }, setTeams, setError);
        }
      }));
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
