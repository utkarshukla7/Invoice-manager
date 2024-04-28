import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import apurvaImg from './assets/apurva.jpg';
import abhishekImg from './assets/abhishek.jpg';
import samyakImg from './assets/samyak.jpg';
import vishalImg from './assets/vishal.jpg';
import utkarshImg from './assets/utkarsh.jpg';
import bhupiImg from './assets/bhupi.jpg';
import styles from './About.module.css';

const About = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      {/* Text Box */}
      <div className={`${styles.textBox} text-center`}>
        <h1 className={styles.heading}>
          <span className={styles.heading__part1}>Crafted</span>{' '}
          <span className={styles.heading__part2}>with</span>{' '}
          <span className={styles.heading__part3}>Passion</span>
        </h1>
        <p className={styles.description}>
          Crafted by a collaborative team of five, BillEase subtly transforms
          invoice management. Through intuitive automation and insightful
          analysis, it simplifies expense tracking, providing users with
          effortless organization and a deeper understanding of their financial
          landscape. Rooted in a commitment to innovation and user empowerment,
          BillEase discreetly empowers individuals to navigate their finances
          with clarity and ease.
        </p>
      </div>

      {/* Cards Here */}
      <Row
        className="justify-content-center"
        style={{ flexWrap: 'nowrap', width: '30%' }}
      >
        <Col xs={4}>
          <Card>
            <Card.Img variant="top" src={apurvaImg} />
          </Card>
        </Col>
        <Col xs={4}>
          <Card>
            <Card.Img variant="top" src={abhishekImg} />
          </Card>
        </Col>
        <Col xs={4}>
          <Card>
            <Card.Img variant="top" src={samyakImg} />
          </Card>
        </Col>
        <Col xs={4}>
          <Card>
            <Card.Img variant="top" src={vishalImg} />
          </Card>
        </Col>
        <Col xs={4}>
          <Card>
            <Card.Img variant="top" src={utkarshImg} />
          </Card>
        </Col>
      </Row>
      <Row
        className="justify-content-center"
        style={{ flexWrap: 'nowrap', width: '30%', marginTop: '4%' }}
      >
        <Col xs={4}>
          <Card>
            <Card.Img variant="top" src={bhupiImg} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default About;