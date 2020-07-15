import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';

import axios from 'axios';

function SheetRequest({ monsters }) {
  const [ sent, setSent ] = useState(false); 
  const [ message, setMessage ] = useState(''); 
  const [ email, setEmail ] = useState('');
  const [ name, setName ] = useState('');

  const changeName = e => setName(e.target.value);
  const changeEmail = e => setEmail(e.target.value);

  const connect = () => {
    if(!name) {
      setMessage('Name your encounter');
      setSent(false);
      return false;
    }

    if(email && email.includes('@')) {
      const body = { monsters: monsters.map((mon) => mon.name), email, encounter: name };
      axios.post('http://localhost:8008/request-sheet', body)
        .then(({ data }) => console.log(data))

      setMessage('Encounter sheet is being delivered'); 
      setSent(true); 
      setEmail('');
      setName('');

    } else {
      setMessage('Please enter a valid email.');
      setSent(false);
    }
  };
  
  return (
    <Card className="mb-1 mt-1">
      <Card.Header>D&D Encounter Stat Block Sheet Builder</Card.Header> 
      <Card.Body>
        <div> 
          { message && <Alert variant={sent ? 'success' : 'danger'}>{message}</Alert> }
            <FormControl type="text" placeholder="Encounter name" value={name} onChange={changeName} />
            <br />
            <InputGroup>
                <FormControl type="email" placeholder="Enter email" value={email} onChange={changeEmail} />
                <InputGroup.Append>
                  <Button variant="primary" onClick={connect}>Send Sheet</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
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
            <Button variant="secondary" onClick={submit}>Add Monster</Button>
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

function Monster({ name, remove }) {

  const [ block, setBlock ] = useState(false);

  const statBlock = useRef();

  useEffect(() => {
    if(!block) {
      axios.get(`http://localhost:8008/${name}`) 
        .then(({data}) => {
          
          const { current } = statBlock; 
      
          if(current) {

            setBlock(true);
            current.innerHTML = data;
          
          }
        
        })
     }
  }, [statBlock, setBlock, block, name])

  return (
    <Accordion>
      <Card className="mb-1 mt-1">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Accordion.Toggle as="dt" eventKey="block" style={{cursor: 'pointer'}}>
            <h5 className="m-0">{name}</h5>
          </Accordion.Toggle>
          <RemoveButton onClick={remove} />         
        </Card.Header>
        <Accordion.Collapse eventKey="block">
          <Card.Body ref={statBlock} className="d-flex justify-content-center p-2">
            { !block && <Spinner animation="border" role="loading" /> }
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

function App() {
  const [monsters, setMonsters] = useState([]);

  const addMonster = (name, block) => {
    setMonsters([...monsters, { name }]);
  }

  const removeMonster = (idx) => {
    monsters.splice(idx, 1);
    setMonsters([...monsters]); 
  }

  return (
     <Container fluid className="pt-1">
        <Row>
          <Col sm={6} md={5} lg={4}>
            <SheetRequest monsters={monsters} />
          </Col>
          <Col>
            <MonsterAdder addMonster={addMonster}/> 
            {
              monsters.map(({name}, i) => {
                const key = `monster-${name}-${i}`; 
                return <Monster key={key} name={name} remove={() => removeMonster(i)}/>
              })
            }
          </Col>
        </Row>
     </Container>
  );
}

export default App;
