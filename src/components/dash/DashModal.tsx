import { Button, Modal } from 'react-bootstrap';

interface ModalProps {
  isShow: boolean;
  setShow: (show: boolean) => void;
  onDeleteClicked: (id: string) => Promise<void> | null;
  id: string;
  data: string;
}

const DashModal = ({ isShow, setShow, onDeleteClicked, data, id }: ModalProps) => {
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
        <Modal.Title>Delete "{data}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>Delete this? Are you sure?</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
          }}
        >
          No
        </Button>
        {onDeleteClicked !== undefined && (
          <Button
            onClick={() => {
              setShow(false);
              onDeleteClicked(id);
            }}
            variant="primary"
          >
            Yes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default DashModal;
