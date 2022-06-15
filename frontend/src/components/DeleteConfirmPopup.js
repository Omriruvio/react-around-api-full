import PopupWithForm from './PopupWithForm';

const DeleteConfirmPopup = (props) => {
  const { isOpen, handleDeleteConfirm, handleCloseClick, handlePopupClick, isLoading } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    handleDeleteConfirm();
  };

  return (
    <PopupWithForm
      handlePopupClick={handlePopupClick}
      onClose={handleCloseClick}
      name="delete-confirm"
      title="Are you sure?"
      isOpen={isOpen}
      buttonText={isLoading ? 'Deleting...' : 'Yes'}
      onSubmit={handleSubmit}
    ></PopupWithForm>
  );
};

export default DeleteConfirmPopup;
