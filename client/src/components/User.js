import { useState, useEffect } from 'react';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import ApiRequestHandler from '../entities/ApiRequestHelper';
import { useParams } from 'react-router-dom';

export default function User({ useAuthHandler })
{
  const authHandler = useAuthHandler();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const requestHandler = new ApiRequestHandler();

    (async () => 
      await requestHandler.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${authHandler.getToken()}` }
      }, async resp => resp && resp.status !== 200 ? setError(resp.message) : setUser(resp)))();
  }, [authHandler, id]);

  return (
    <Container>
      <Row>
        <Col></Col>
      </Row>
    </Container>
  );
}
