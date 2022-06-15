import PopupWithForm from './PopupWithForm';
import React from 'react';

export default function AddPlacePopup(props) {
  const { isOpen, onClose, onAddPlaceSubmit, isLoading, onPopupClick } = props;
  const [inputs, setInputs] = React.useState({});
  const [errorFields, setErrorFields] = React.useState({});
  const [isValid, setIsValid] = React.useState(true);

  React.useEffect(() => {
    setInputs({});
    if (!isOpen) setErrorFields({});
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddPlaceSubmit({ name: inputs.title, link: inputs.link });
  };

  const handleInput = (event) => {
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    });
    setErrorFields({
      ...errorFields,
      [event.target.name]: event.target.validationMessage,
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      const formIsValid = inputs.link && inputs.title && !Object.values(errorFields).some((val) => Boolean(val));
      setIsValid(formIsValid || false);
    }
  }, [errorFields, inputs, isOpen]);

  return (
    <PopupWithForm
      handlePopupClick={onPopupClick}
      isValid={isValid}
      onSubmit={handleSubmit}
      name="new-card"
      title="New place"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={isLoading ? 'Saving...' : 'Create'}
    >
      <input
        onChange={handleInput}
        value={inputs.title || ''}
        id="image-title-input"
        type="text"
        className={`form__input ${errorFields.title && 'form__input_type_error'}`}
        placeholder="Title"
        name="title"
        required
        minLength="1"
        maxLength="30"
      />
      <span id="image-title-input-error" className={`form__input-error ${isValid ? '' : 'form__input-error_active'}`}>
        {errorFields.title}
      </span>
      <input
        onChange={handleInput}
        value={inputs.link || ''}
        id="image-link-input"
        type="url"
        className={`form__input ${errorFields.link && 'form__input_type_error'}`}
        placeholder="Image link"
        name="link"
        required
      />
      <span id="image-link-input-error" className={`form__input-error ${isValid ? '' : 'form__input-error_active'}`}>
        {errorFields.link}
      </span>
    </PopupWithForm>
  );
}
