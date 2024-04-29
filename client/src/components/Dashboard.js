// Dashboard.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js/auto';
import styles from './Dashboard.module.css';
import { useEffect,useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
const ExpenseTracker = () => {


  Chart.register(ArcElement);
  const {user} = useAuth0();
  const [expenseData, setExpenseData] = useState({
    labels: ['Fuel', 'Food', 'Shopping', 'Transport', 'Health Care', 'Utilities', 'Others'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: ['#e67e22', '#c0392b', '#f1c40f', '#9b59b6', '#2ecc71', '#e74c3c', '#3498db'],
      },
    ],
  });
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
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const email = user.email;
        const response = await axios.post('http://localhost:5000/getTransactions', {
          email: email, // Replace with actual email
        });
        const transactions = response.data;
        console.log(transactions)
        const categoryMap = new Map();
        transactions.forEach(transaction => {
          let { category, amount } = transaction;
          amount = parseInt(transaction.amount, 10) || 0;
          // console.log(category, amount)
          if (categoryMap.has(category)) {
            // console.log(category,categoryMap.get(category) + amount)
            categoryMap.set(category, categoryMap.get(category) + amount);
          } else {
            categoryMap.set(category, amount);
          }
        });

        const updatedExpenseData = {
          labels: [...expenseData.labels],
          datasets: [
            {
              data: expenseData.labels.map(label => categoryMap.get(label) || 0),
              backgroundColor: expenseData.datasets[0].backgroundColor,
            },
          ],
        };

        setExpenseData(updatedExpenseData);
        // console.log(categoryMap)
        console.log(updatedExpenseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTransactions();
  }, []);

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