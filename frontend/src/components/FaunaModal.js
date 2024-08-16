import { Button, Modal } from 'reactstrap'; 

const FaunaModal = ({ photo, modal, toggle }) => {
    return (
        <Modal isOpen={modal} toggle={toggle}>
            <Button className='modal-button' onClick={toggle}>
                Close
            </Button>
            <img className='modal-photo' src={photo.url} alt={photo.name} />
        </Modal>
    )
}

export default FaunaModal;