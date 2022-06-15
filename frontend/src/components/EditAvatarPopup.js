import PopupWithForm from './PopupWithForm';
import React from 'react';

export default function EditAvatarPopup(props) {
  const { isOpen, onClose, onUpdateAvatar, isLoading, onPopupClick } = props;
  const [imageInput, setImageInput] = React.useState('');
  const [errorFields, setErrorFields] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateAvatar(imageInput);
  };

  const handleInput = (event) => {
    setImageInput(event.target.value);
    setErrorFields({
      [event.target.name]: event.target.validationMessage,
    });
    if (imageInput) {
      const isFormValid = Object.values(errorFields).some((validity) => Boolean(validity) === false);
      setIsValid(isFormValid);
    }
    if (!isValid) setShowError(!isValid);
  };

  React.useEffect(() => {
    setImageInput('');
    setShowError(false);
  }, [isOpen]);

  return (
    <PopupWithForm
      handlePopupClick={onPopupClick}
      isValid={isValid}
      onSubmit={handleSubmit}
      name="profile-image"
      title="Change profile picture"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={isLoading ? 'Updating...' : 'Save'}
    >
      <input
        onInput={handleInput}
        value={imageInput}
        id="profile-image-input"
        type="url"
        className={`form__input ${showError && 'form__input_type_error'}`}
        placeholder="Link to new profile image"
        name="profileImageUrlInput"
        required
        minLength="1"
      />
      <span id="profile-image-input-error" className={`form__input-error ${showError && 'form__input-error_active'}`}>
        {showError && errorFields['profileImageUrlInput']}
      </span>
    </PopupWithForm>
  );
}
