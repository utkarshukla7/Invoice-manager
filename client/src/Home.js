import React, { useState } from 'react';
import './Home.css';
import MyVerticallyCenteredModal from './components/Popup';
import EnhancedTable from './components/Table';
import ExpenseTracker from './components/Dashboard';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
    const [modalShow, setModalShow] = useState(false);
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
    const [uploadedImage, setUploadedImage] = useState(null);
    const [page, setPage] = useState(1);
    const [ExtractedText, setExtractedText] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [formValues, setFormValues] = useState({
      category: '',
      date: '',
      time: '',
      amount: '',
      shop: '',
    });

  const handleModify = () => {
    setIsEditable(true);
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = () => {
    setIsEditable(false);

  };
    const handleImageUpload = (e) => {
        setUploadedImage(e);
    };
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('image', uploadedImage);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data.text)
        setExtractedText(response.data.text);
        console.log(ExtractedText)
        const lines = ExtractedText.split('\n');
        const category = lines.find((line) => line.startsWith('Category:'))?.split(':')[1].trim();
        const date = lines.find((line) => line.startsWith('Date:'))?.split(':')[1].trim();
        const time = lines.find((line) => line.startsWith('Time:'))?.split(':')[1].trim();
        const shopName = lines.find((line) => line.startsWith('Name of shop:'))?.split(':')[1].trim();
        const amount = lines.find((line) => line.startsWith('Total Amount:'))?.split(':')[1].trim();
      console.log(category,date,time,shopName,amount)
    setFormValues({
      category: category || '',
      date: date || '',
      time: time || '',
      amount: amount || '',
      shop: shopName || '',
    });
        setShowModal(true);

      } catch (error) {
        console.error('Error sending image:', error);
      }
    }
  return (
    <div className = 'window' style = {{
      display: 'flex'
    }}>
      <div className="sidebar" >
        <div className="button-container">
          <button className="sidebar-button" onClick={() => setModalShow(true)}>New Transaction</button>
          <button className="sidebar-button" onClick = {()=> setPage(1)}>Dashboard</button>
          <button className="sidebar-button" onClick = {()=> setPage(2)}>Transactions</button>
          <button className="sidebar-button" onClick = {()=> setPage(3)}>About</button>
        </div>
        <button className="sidebar-button logout-button">Logout</button>
        <button className="sidebar-button logout-button" onClick={() => loginWithRedirect()}>
            Login
          </button>
      </div>
      <div className='main'>
      {page === 1 && <ExpenseTracker></ExpenseTracker>}
      {page === 2 && <EnhancedTable></EnhancedTable>}
        
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onImageUpload={handleImageUpload}
        onSubmit = {handleSubmit}
      />
      {<Modal show={showModal} onHide={!showModal}>
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
            <Button variant="secondary" onClick={()=>{setShowModal(false)}}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleModalSubmit}>
              Submit
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>}
      
    </div>
  );
};

export default Home;
