import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js/auto';
const ExpenseTracker = () => {
  // Sample data for charts and components
  const totalExpenses = 38060;
  const income = 43300;
  const balance = 5240;
  const transactions = 1284;
  Chart.register(ArcElement);
  const expenseData = {
    labels: ['Fuel', 'Food', 'Shopping','Transport', 'Health Care', 'Utilities', 'Others'],
    datasets: [
      {
        data: [6120, 10300, 14000, 14700, 2375, 13275, 2275],
        backgroundColor: [
          '#36A2EB',
          '#FF6384',
          '#FFCE56',
          '#9966FF',
          '#4BC0C0',
          '#FF9F40',
          '#36A2EB',
        ],
      },
    ],
  };

  const balanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Balance',
        data: [4500, 5000, 6500, 5900, 4800, 6000, 5200, 4500, 6700, 5400, 5800, 5240],
        fill: false,
        borderColor: '#4BC0C0',
        tension: 0.1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
   heigth: '50%',
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Income</Card.Title>
              <Card.Text>${income}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Expenses</Card.Title>
              <Card.Text>${totalExpenses}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Balance</Card.Title>
              <Card.Text>${balance}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Transactions</Card.Title>
              <Card.Text>{transactions}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
  <Col md={6}>
    <Card>
      <Card.Body>
        <Card.Title>Total Expenses</Card.Title>
        <Doughnut data={expenseData} options={doughnutOptions} />
        {/* Render expense category descriptions */}
      </Card.Body>
    </Card>
  </Col>
  <Col md={6}>
    <Card>
      <Card.Body>
        <Card.Title>Account Balance</Card.Title>
        <Line data={balanceData} options={lineOptions} />
      </Card.Body>
    </Card>
  </Col>
</Row>
    </Container>
  );
};

export default ExpenseTracker;