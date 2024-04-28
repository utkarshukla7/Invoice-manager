// Dashboard.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js/auto';
import styles from './Dashboard.module.css';

const ExpenseTracker = () => {
  // Sample data for charts and components
  const totalExpenses = 38060;
  const income = 43300;
  const balance = 5240;
  const transactions = 1284;

  Chart.register(ArcElement);

  const expenseData = {
    labels: ['Fuel', 'Food', 'Shopping', 'Transport', 'Health Care', 'Utilities', 'Others'],
    datasets: [
      {
        data: [6120, 10300, 14000, 14700, 2375, 13275, 2275],
        backgroundColor: ['#e67e22', '#c0392b', '#f1c40f', '#9b59b6', '#2ecc71', '#e74c3c', '#3498db'],
      },
    ],
  };

  const balanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Expense',
        data: [4500, 5000, 6500, 5900, 4800, 6000, 5200, 4500, 6700, 5400, 5800, 5240],
        fill: false,
        borderColor: '#2ecc71',
        tension: 0.1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed && context.parsed.toFixed) {
              label += context.parsed.toFixed(2);
            }
            return label;
          }
        }
      }
    }
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
    <div className={styles.container}>
      <Container>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Total Expenses</Card.Title>
                <div className="chart-container" style={{ width: '50%', margin: 'auto' }}>
                  <Doughnut data={expenseData} options={doughnutOptions} />
                </div>
                {/* Render expense category descriptions */}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Account Expense</Card.Title>
                <Line data={balanceData} options={lineOptions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ExpenseTracker;