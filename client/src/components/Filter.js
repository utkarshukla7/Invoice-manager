import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryFilter = ({ show, onHide, onApplyFilter }) => {
  const categories = ['Fuel', 'Food', 'Shopping', 'Transport', 'Health Care', 'Utilities', 'Others'];
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleApplyFilter = () => {
    console.log(selectedCategories)
    onApplyFilter(selectedCategories);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Filter Categories</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {categories.map((category) => (
            <Form.Check
              key={category}
              type="checkbox"
              label={category}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleApplyFilter}>
          Apply Filter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryFilter;