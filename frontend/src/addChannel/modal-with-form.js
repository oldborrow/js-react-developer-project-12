import React, { memo } from "react";
import Modal from "react-responsive-modal";
import FormModal from "./form-modal";

const ModalWithForm = ({ isOpen, handleClose }) => {
    console.log(isOpen)
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
        >
            <FormModal />
        </Modal>
    );
};

export default memo(ModalWithForm);