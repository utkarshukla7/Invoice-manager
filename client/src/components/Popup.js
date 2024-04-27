import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
function MyVerticallyCenteredModal(props) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    props.onImageUpload(file);
  };
  const handleSubmit =  () => {
    props.onHide()
    props.onSubmit()
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Invoice
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;
