import {useEffect, useState} from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'reactstrap';
import ApiRequestHelper from '../entities/ApiRequestHelper';

const renderTeams = (teams, setEditModalData, setGrade) =>
{
  const getGradeFromJury = (userId, jury) => jury.grades.filter(g => g.userId === userId)[0].value.toFixed(2);
  const formatDeadlineDate = jury =>
  {
    if(jury && jury.deadline)
    {
      return jury.deadline.replace('T', ' ').substr(0, jury.deadline.length - 5);
    }

    return null;
  };

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
            <th>
              <Button color="primary"
                onClick={() => {
                  if(getGradeFromJury(teams.userId, t.Jury))
                  {
                    setGrade(getGradeFromJury(teams.userId, t.Jury));
                  }
                  setEditModalData({ isOpen: true, teamId: t.id, deliverables: t.Deliverables });
                }}>
                {getGradeFromJury(teams.userId, t.Jury) || 'No grade'}
              </Button>
            </th>
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
  const btnClickEvent = async e =>
  {
    await toggle(e);
    if(color === 'success')
    {
      window.location.reload();
    }
  };

  return (
    <Modal isOpen={message.length > 0} toggle={toggle}>
      <ModalHeader>{ color === 'success' ? 'Success' : 'Error' }</ModalHeader>
      
      <ModalBody>
        <Alert color={color}>{message}</Alert>
      </ModalBody>
      
      <ModalFooter>
        <Button color="primary" onClick={btnClickEvent}>Ok</Button>
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

const createEditModal = (authHandler, data, setData, grade, setGrade, setSuccess, setError) =>
{
  const handleChange = e =>
  {
    if(e.target.value !== '')
    {
      let value = parseFloat(e.target.value);
      if(isNaN(value))
      {
        setError('Grade is not a number.');
      }
      else
      {
        setGrade(value);
      }
    }
  };

  const saveGrade = async _ =>
  {
    const requestHandler = new ApiRequestHelper();

    await requestHandler.post(`/teams/${data.teamId}/grade`, {
      body: { grade: grade },
      headers: authHandler.getAuthorizationHeader()
    }, resp => resp.status === 200 ? setSuccess(resp.message) : setError(resp.message));
  };

  return (
    <Modal isOpen={data.isOpen} toggle={_ => setData({ isOpen: false })}>
      <ModalHeader>Edit grade</ModalHeader>
      <ModalBody>
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Deliverable</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.deliverables && data.deliverables.map((d, i) => (
              <tr key={i}>
                <th>{d.title}</th>
                <th>{d.description}</th>
                <th><a className="link" href={d.url || 'https://google.com'} rel="noreferrer" target="_blank">Open</a></th>
              </tr>
            ))}
            {!data.deliverables && (
              <tr>
                <th colSpan="3">No deliverables found.</th>
              </tr>
            )}
          </tbody>
        </Table>
        <FormGroup>
          <Label for="grade">Grade</Label>
          <Input id="grade" name="grade"
            type="number" placeholder="10" min="0" max="10"
            step="0.5"
            value={grade} onChange={handleChange} />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={_ => setData({ isOpen: false })}>Cancel</Button>
        <Button color="primary" onClick={async _ => await saveGrade()}>Save</Button>
      </ModalFooter>
    </Modal>
  );
}

export default function Grade({ useAuthHandler })
{
  const authHandler = useAuthHandler();
  const [teams, setTeams] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editModal, setEditModalData] = useState({ isOpen: false });
  const [grade, setGrade] = useState(5);

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
      {createEditModal(authHandler, editModal, setEditModalData, grade, setGrade, setSuccess, setError)}
      <Card>
        <CardHeader>Projects assigned for grading</CardHeader>
        <CardBody>
          {renderTeams(teams, setEditModalData, setGrade)}
        </CardBody>
      </Card>
    </Container>
  );
}
