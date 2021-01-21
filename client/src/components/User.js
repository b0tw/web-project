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

const renderTeams = (authHandler, user, setError, setSuccess, setConfirmation) => {
  const requestHandler = new ApiRequestHandler();
  const deleteFromTeam = async (teamId, user) => {
    await requestHandler.delete(`/teams/${teamId}/members`, {
      headers: authHandler.getAuthorizationHeader(),
      body: [{ id: user.id, username: user.username }]
    }, resp => {
      resp.status !== 200 ? setError(resp.message) : setSuccess(resp.message);
      setConfirmation({require: false});
    });
  };

  const renderTeamsHeader = _ =>
  {
    return (<tr>
      <th>#</th>
      <th>Team name</th>
      <th>Project name</th>
      <th>Grade</th>
      {user.Teams && user.Teams.length > 0 && user.currentUser && user.currentUser.is_professor === 1 && <th></th>}
    </tr>);
  };
  const renderTeamRow = (t, i) =>
  {
    const computeGrade = t => {
      const grade = (t.Jury.grades.reduce((sum, g) => sum + g.value, 0) / t.Jury.grades.length).toFixed(2);

      if(isNaN(grade))
        return 'None';
      return grade;
    }

    return (<tr key={t.id}>
      <th scope="row">{i + 1}</th>
      <th>{t.name}</th>
      <th>{t.project_name}</th>
      <th>{computeGrade(t)}</th>
      { user.currentUser && user.currentUser.is_professor === 1 &&
      <th><Button size="xs" color="danger" onClick={() => setConfirmation({ require: true, message: `Are you sure you want to remove ${user.name} ${user.surname} from being a member of team '${t.name}'?`, callback: async () => await deleteFromTeam(t.id, user) })}>Remove</Button></th>
      }
    </tr>);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5">Teams</CardTitle>
      </CardHeader>
      <CardBody>
        <Table striped responsive>
          <thead>
            { renderTeamsHeader() }
          </thead>
          <tbody>
            { user && user.Teams && user.Teams.length > 0 && user.Teams.map((t, i) => renderTeamRow(t, i)) }
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

const renderJuries = (authHandler, user, setError, setSuccess, setConfirmation) => {
  const requestHandler = new ApiRequestHandler();
  const deleteFromTeam = async (teamId, user) => {
    await requestHandler.delete(`/teams/${teamId}/juries`, {
      headers: authHandler.getAuthorizationHeader(),
      body: [{ id: user.id, username: user.username }]
    }, resp => {
      resp.status !== 200 ? setError(resp.message) : setSuccess(resp.message);
      setConfirmation({require: false});
    });
  };

  const renderJuriesHeader = _ =>
  {
    if(user.currentUser.username === user.username)
    {
      return (
        <tr>
          <th>#</th>
          <th>Team name</th>
          <th>Project name</th>
          <th>Graded awarded</th>
          <th>Deadline to modify grade</th>
          {user.Teams && user.Teams.length > 0 && user.currentUser && user.currentUser.is_professor === 1 && <th></th>}
        </tr>);
    }

    return (
      <tr>
        <th>#</th>
        <th>Team name</th>
        <th>Project name</th>
        {user.Teams && user.Teams.length > 0 && user.currentUser && user.currentUser.is_professor === 1 && <th></th>}
      </tr>);
  };

  const renderJuryRow = (j, i) =>
  {
    if(user.currentUser.username === user.username)
    {
      return (<tr key={j.id}>
        <th scope="row">{i + 1}</th>
        <th>{j.Team.name}</th>
        <th>{j.Team.project_name}</th>
        <th>{j.UserJury.grade}</th>
        <th>{j.UserJury.deadline && j.UserJury.deadline.replace('T', ' ').substr(0, j.UserJury.deadline.length - 5)}</th>
        { user.currentUser && user.currentUser.is_professor === 1 &&
        <th><Button size="xs" color="danger" onClick={() => setConfirmation({ require: true, message: `Are you sure you want to remove ${user.name} ${user.surname} from being a jury of team '${j.Team.name}'?`, callback: async () => await deleteFromTeam(j.Team.id, user) })}>Remove</Button></th>
        }
      </tr>);
    }

    return (<tr key={j.id}>
      <th scope="row">{i + 1}</th>
      <th>{j.Team.name}</th>
      <th>{j.Team.project_name}</th>  
      { user.currentUser && user.currentUser.is_professor === 1 &&
      <th><Button size="xs" color="danger" onClick={() => setConfirmation({ require: true, message: `Are you sure you want to remove ${user.name} ${user.surname} from being a jury of team '${j.Team.name}'?`, callback: async () => await deleteFromTeam(j.Team.id, user) })}>Remove</Button></th>
      }
    </tr>);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5">Jury member in</CardTitle>
      </CardHeader>
      <CardBody>
        <Table striped responsive>
          <thead>
              { renderJuriesHeader() }
          </thead>
          <tbody>
            { user && user.Juries && user.Juries.length > 0 && user.Juries.map((j, i) => renderJuryRow(j, i)) }
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

export default function User({ useAuthHandler })
{
  const authHandler = useAuthHandler();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmation, setConfirmation] = useState({ require: false });
  const [isEdittingUserData, editUserData] = useState(false);
  const [userData, setUserData] = useState({});
  const { username } = useParams();
  const renderTeamsAndJuries = () => user && user.is_professor === 0 ? (
      <Row xs="2">
        <Col>{renderTeams(authHandler, user, setError, setSuccess, setConfirmation)}</Col>
        <Col>{renderJuries(authHandler, user, setError, setSuccess, setConfirmation)}</Col>
      </Row>
  ) : null;
  const getUserData = async (requestHandler) => {
    let currentUser;
    await requestHandler.get('/users', {
      query: `?username=${authHandler.getUsername()}`,
      headers: authHandler.getAuthorizationHeader()
    }, resp => resp.message ? setError(resp.message) : currentUser = resp[0]);

    await requestHandler.get('/users', {
      query: `?username=${username}`,
      headers: authHandler.getAuthorizationHeader()
    }, async resp => {
      if (resp && (resp.status !== 200 || resp.length < 1 || resp[0].name == null))
      {
        setError(resp.message || 'Could not find user.');
      }
      else if(resp && resp[0])
      {
        await requestHandler.get(`/users/${resp[0].id}`, {
          headers: authHandler.getAuthorizationHeader()
        }, async userResp => {
          if(userResp && userResp.status !== 200)
          {
            setError(userResp.message);
          }
          else
          {
            for(let i = 0; i < userResp.Teams.length; ++i)
            {
              await requestHandler.get(`/teams/${userResp.Teams[i].id}`, {
                headers: authHandler.getAuthorizationHeader() 
              }, teamResp => userResp.Teams[i].Jury = teamResp.Jury);
            }
            setUser({ ...userResp, currentUser: currentUser });
            setUserData({ ...userResp });
          }
        });
      }
    });
  };
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
  const saveUserData = async () => {
    const requestHandler = new ApiRequestHandler();
    await requestHandler.put(`/users/${user.id}`, {
      headers: authHandler.getAuthorizationHeader(),
      body: { ...userData }
    }, resp => {
      if(resp.status !== 200)
      {
        //editUserData(false);
        setError(resp.message);
      }
      else
      {
        setSuccess(resp.message);
      }
    });
  };

  useEffect(() => {
    const requestHandler = new ApiRequestHandler();
    getUserData(requestHandler);
  }, [username]);

  return (
    <Container fluid='true' className="py-2 px-5">
      <Modal isOpen={confirmation.require} toggle={() => setConfirmation({require: false})}>
        <ModalHeader>Remove from team</ModalHeader>
        <ModalBody>
          <Alert color="danger">{confirmation.message}</Alert>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setConfirmation({ require: false })}>Cancel</Button>
          <Button color="danger" onClick={confirmation.callback}>Remove</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={success.length > 0} toggle={() => setSuccess('')}>
        <ModalHeader>Account created.</ModalHeader>
        
        <ModalBody>
          <Alert color="success">{success}</Alert>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => {
            if(userData.username !== username)
            {
              localStorage.removeItem('user-state');
            }
            window.location.reload();
            setSuccess('');
            }}>
            Ok
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isEdittingUserData} toggle={() => editUserData(false)}>
        <ModalHeader>Edit user data</ModalHeader>
        <Form onSubmit={e => e.preventDefault()} method="POST" className="text-left">
          <ModalBody>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input id="username" name="username" type="text" placeholder="jdoe23" value={userData.username} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="surname">Surame</Label>
              <Input id="surname" name="surname" type="text" placeholder="Doe" value={userData.surname} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input id="name" name="name" type="text" placeholder="John" value={userData.name} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="password">password</Label>
              <Input id="password" name="password" type="password" placeholder="******" value={userData.password} onChange={handleChange} />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input id="is_professor" type="checkbox" name="is_professor" checked={userData.is_professor === 1} onChange={handleChange} />{' '}
                Professor account.
              </Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => editUserData(false)}>Cancel</Button>
            <Button color="danger" onClick={async () => { await saveUserData(); }}>Save</Button>
          </ModalFooter>
        </Form>
      </Modal>
      <Modal isOpen={error.length > 0} toggle={() => setError('')}>
        <ModalHeader>Error</ModalHeader>
        <ModalBody>
          <Alert color="danger">Could not find user. {error}</Alert>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setError('')}>Ok</Button>
        </ModalFooter>
      </Modal>
      <Row className="my-2 mb-3">
        <Col md="4" className="mx-auto">
          { user && error.length < 1 &&
          <Card>
              <CardBody>
                <CardTitle tag="h4">{ `${user.surname}, ${user.name}` }</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">{ user ? (user.is_professor === 1 ? 'Professor' : 'Student') : null }</CardSubtitle>
                {user.currentUser && user.currentUser.is_professor === 1 && <Button size="sm" color="primary" onClick={() => editUserData(true)}>Edit</Button>}
              </CardBody>
          </Card> 
          }
        </Col>
      </Row>
      {renderTeamsAndJuries()}
    </Container>
  );
}
