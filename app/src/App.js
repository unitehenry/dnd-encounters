import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion';

function Authenticator() {
  const [ authenticated, setAuthenticated ] = useState(false); 

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [service, setService] = useState('Google');

  const [message, setMessage] = useState('');

  const changeUser = e => {
    setUser(e.target.value);
  }

  const changePass = e => {
    setPass(e.target.value);
  }

  const changeService = e => {
    setService(e.target.value); 
  }

  const connect = () => {
    if(!user) {
      setMessage('Invalid username');
      return false;
    }

    if(!pass) {
      setMessage('Invalid password');
      return false;
    }

    setAuthenticated(true);
  }

  return (
    <Card className="mb-1 mt-1">
      <Card.Header>Connect to D&D Beyond</Card.Header>
      <Card.Body>
        {
          authenticated ? 
           <h5>Connected Successfully</h5> 
          :
          ( 
             <div> 
                { message && <Alert variant="danger">{message}</Alert> }
                <Form>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={user} onChange={changeUser} />
                  </Form.Group>
        
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={pass} onChange={changePass}/>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Account Type</Form.Label>
                    <Form.Control as="select" custom onChange={changeService} value={service}>
                      <option>Google</option>
                      <option>Twitch</option>
                      <option>Apple</option>
                    </Form.Control>
                  </Form.Group>

                  <Button variant="primary" onClick={connect} >Connect</Button>
                </Form>
              </div>
            )
        }
      </Card.Body>
    </Card>
  );
}

function Actions() {
  return (
    <Card>
      <Card.Body>
        <Button variant="info">Download Printable</Button>
      </Card.Body>
    </Card>
  );
}

function MonsterAdder({addMonster}) {
  const [name, setName] = useState(''); 

  const submit = (evt) => {
    if(evt.key && evt.key !== 'Enter') {
      return false;
    }

    if(name) {
      addMonster(name);
      setName('');
    }
  }

  const changeName = e => {
    setName(e.target.value); 
  }
  
  return (
    <Card className="mb-1 mt-1"> 
      <Card.Header>Add a Monster</Card.Header> 
      <Card.Body>
        <InputGroup>
          <FormControl aria-label="Monster Name" value={name} onChange={changeName} onKeyUp={submit} />
          <InputGroup.Append>
            <Button variant="primary" onClick={submit}>Add Monster</Button>
          </InputGroup.Append>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

function RemoveButton({onClick}) {
  return (
    <svg onClick={onClick} style={{cursor: 'pointer'}} width="20px" height="20px" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
      <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
    </svg>
  );
}

function Monster({ name, block, remove}) {

  const statBlock = useRef();

  useEffect(() => {
    const { current } = statBlock; 
    
    if(current) {
      current.innerHTML = block; 
    }
  }, [statBlock])

  return (
    <Accordion>
      <Card className="mb-1 mt-1">
        <Card.Header>
          <Container>
            <Row> 
              <Col className="d-flex align-items-center justify-content-start">
                <Accordion.Toggle as="dt" eventKey="block" style={{cursor: 'pointer'}}>
                  {name}
                </Accordion.Toggle>
              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <RemoveButton onClick={remove} />         
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Accordion.Collapse eventKey="block">
          <Card.Body ref={statBlock}>{block}</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

function App() {
  const [monsters, setMonsters] = useState([]);

  const addMonster = (name) => {
    setMonsters([...monsters, {name, block: '<p style="color: red">this is a stat block</p>'}]);
  }

  const removeMonster = (idx) => {
    monsters.splice(idx, 1);
    setMonsters([...monsters]); 
  }

  return (
     <Container fluid className="pt-1">
        <Row>
          <Col sm={6} md={5} lg={4}>
            <Authenticator />
            <Actions />
          </Col>
          <Col>
            <MonsterAdder addMonster={addMonster}/> 
            {
              monsters.map(({name, block}, i) => {
                const key = `monster-${name}-${i}`; 
                return <Monster key={key} name={name} block={block} remove={() => removeMonster(i)}/>
              })
            }
          </Col>
        </Row>
     </Container>
  );
}

export default App;
