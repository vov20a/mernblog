import { Button, Modal } from 'react-bootstrap';

interface ModalProps {
  message?: string;
  isShow: boolean;
  setShow: (del: boolean) => void;
}

const DashAlertModal = ({ isShow = false, setShow, message = '' }: ModalProps) => {
  return (
    <Modal
      show={isShow}
      onHide={() => {
        setShow(false);
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DashAlertModal;
