import React, { useState } from 'react';
import './Home.css';
import MyVerticallyCenteredModal from './components/Popup';
import EnhancedTable from './components/Table';
import ExpenseTracker from './components/Dashboard';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import First from './First';
import styles from './Home.module.css';
import About from './About';
import LoadingOverlay from './loadingOverlay';

const Home = () => {
  const [modalShow, setModalShow] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [ExtractedText, setExtractedText] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    category: '',
    date: '',
    time: '',
    amount: '',
    shop: '',
  });

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin, 
    });
  };

  const handleModify = () => {
    setIsEditable(true);
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = () => {
    const email = user.email; // Your email variable
    const data = {
      ...formValues,
      email: email,
    };

    axios.post('http://localhost:5000/addTransaction', data)
      .then((response) => {
        // Show success toast
        alert('Transaction added successfully');
        setShowModal(false);
      })
      .catch((error) => {
        // Show error toast
        setShowModal(false);
        console.error('There was an error adding the transaction:', error);
      });
      
  };

  const handleImageUpload = (e) => {
    setUploadedImage(e);
  };
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const handleSubmit = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', uploadedImage);
  
    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        if(response.data.success === false) {
          alert(response.data.text);
          return;
        }
        console.log(response.data.text);
        setExtractedText(response.data.text);
        // await wait(5000);
        return response
      })
      .then((response) => {
        const lines = response.data.text.split('\n').map(line => line.toLowerCase());
        console.log(lines)
        const category = lines.find((line) => line.startsWith('category:'))?.split(':')[1].trim();
        const date = lines.find((line) => line.startsWith('date:'))?.split(':')[1].trim();
        const time = lines.find((line) => line.startsWith('time:'))?.split(':')[1].trim();
        const shopName = lines.find((line) => line.startsWith('name of shop:'))?.split(':')[1].trim();
        const amount = lines.find((line) => line.startsWith('total amount:'))?.split(':')[1].trim();
        console.log(category, date, time, shopName, amount);
        setFormValues({
          category: category?.charAt(0).toUpperCase() + category?.slice(1) || '',
          date: date?.charAt(0).toUpperCase() + date?.slice(1) || '',
          time: time?.charAt(0).toUpperCase() + time?.slice(1) || '',
          amount: amount?.charAt(0).toUpperCase() + amount?.slice(1) || '',
          shop: shopName?.charAt(0).toUpperCase() + shopName?.slice(1) || '',
        });
        setShowModal(true);
      })
      .catch((error) => {
        console.error('Error sending image:', error);
      }).finally(() => {
        setIsLoading(false); 
      });
  }
  

  return (
    <>
      {!isAuthenticated && <First/>}
      {isAuthenticated &&
        <div className='window' style={{
          display: 'flex'
        }}>
          <div className={styles.sidebar}>
            <div className={styles.appName}>
              <span className={styles.billText}>Bill</span>
              <span className={styles.easeText}>Ease</span>
            </div>
            <div className={styles.buttonContainer}>
              <button 
                className={`${styles.sidebarButton} ${page === 0 ? styles.selectedPage : ''}`} 
                onClick={() => setModalShow(true)}
                >
                New Transaction
              </button>
              <button 
                className={`${styles.sidebarButton} ${page === 1 ? styles.selectedPage : ''}`} 
                onClick={() => setPage(1)}
                >
                Dashboard
              </button>
              <button 
                className={`${styles.sidebarButton} ${page === 2 ? styles.selectedPage : ''}`} 
                onClick={() => setPage(2)}
                >
                Transactions
              </button>
              <button 
                className={`${styles.sidebarButton} ${page === 3 ? styles.selectedPage : ''}`} 
                onClick={() => setPage(3)}
                >
                About
              </button>
            </div>

            
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
          <div className='main' >
            {page === 1 && <ExpenseTracker></ExpenseTracker>}
            {page === 2 && <EnhancedTable></EnhancedTable>}
            {page === 3 && <About></About>}
          </div>
          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            onImageUpload={handleImageUpload}
            onSubmit={handleSubmit}/>
          {<Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>File Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formValues.category}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    />
                </Form.Group>
                <Form.Group controlId="date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="date"
                    value={formValues.date}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    />
                </Form.Group>
                <Form.Group controlId="time">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="text"
                    name="time"
                    value={formValues.time}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    />
                </Form.Group>
                <Form.Group controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={formValues.amount}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    />
                </Form.Group>
                <Form.Group controlId="shop">
                  <Form.Label>Shop</Form.Label>
                  <Form.Control
                    type="text"
                    name="shop"
                    value={formValues.shop}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {!isEditable && <Button variant="primary" onClick={handleModify}>Modify</Button>}
              {isEditable && (
                <>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleModalSubmit}>
                    Submit
                  </Button>
                </>
              )}
            </Modal.Footer>
          </Modal>}
          <LoadingOverlay isLoading={isLoading} />
        </div>
      }
    </>
  );
};

export default Home;
{/* <div className={styles.buttonContainer}>
  <button className={styles.sidebarButton} onClick={() => setModalShow(true)}>New Transaction</button>
  <button className={styles.sidebarButton} onClick={() => setPage(1)}>Dashboard</button>
  <button className={styles.sidebarButton} onClick={() => setPage(2)}>Transactions</button>
  <button className={styles.sidebarButton} onClick={() => setPage(3)}>About</button>
</div> */}