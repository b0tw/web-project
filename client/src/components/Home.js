import { useEffect, useState } from "react";
import { 
  Card,
  CardBody,
  CardTitle,
  Container,
  Table,
} from "reactstrap";
import ApiRequestHandler from '../entities/ApiRequestHelper';

const renderTeams = teams => {

  const renderTeamsHeader = _ =>
  {
    return (<tr>
      <th>#</th>
      <th>Team name</th>
      <th>Project name</th>
      <th>Grade</th>
    </tr>);
  };
  const renderTeamRow = (t, i) =>
  {
    return (<tr key={t.id}>
      <th scope="row">{i + 1}</th>
      <th>{t.name}</th>
      <th>{t.project_name}</th>
      <th>{(t.Jury.grades.reduce((sum, g) => sum + g, 0) / t.Jury.grades.length).toFixed(2)}</th>
    </tr>);
  };

  return (
    <Card>
      <CardTitle tag="h5">Top teams today</CardTitle>
      <CardBody>
        <Table striped responsive>
          <thead>
            { renderTeamsHeader() }
          </thead>
          <tbody>
            { teams && teams.length > 0 && teams.map((t, i) => renderTeamRow(t, i)) }
            { !(teams && teams.length > 0) &&
              <tr>
                <th colSpan="4">No teams found.</th>
              </tr>
            }
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

export default function Home({ useAuthHandler })
{
  const authHandler = useAuthHandler();
  const [teams, setTeams] = useState([]);

  useEffect(_ =>
  {
    const requestHandler = new ApiRequestHandler();

    (async _ =>
    {
      await requestHandler.get('/teams', {
        headers: authHandler.getAthorizationHeader()
      }, resp => {
        let teams = [];
        if(resp.status === 200)
        {
          for (let i = 0; i < Object.keys(resp).length - 1; ++i)
          {
            teams.push(resp[i]);
          }
        }
        setTeams(teams)
      });
    })();
  }, [authHandler]);

  return (
    <Container>
      {renderTeams(teams)}
    </Container>
  );
}