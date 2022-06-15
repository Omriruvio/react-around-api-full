export default function PopupWithForm(props) {
  const { handlePopupClick, name, title, onSubmit, children, buttonText, isOpen, onClose, isValid = true } = props;
  const buttonClassName = `${!isValid ? 'button_disabled' : 'button'} form__submit-button`;
  return (
    <div onMouseDown={handlePopupClick} className={`popup popup_type_${name} ${isOpen ? 'popup_active' : ''}`}>
      <div className="popup__window">
        <button type="button" className="popup__close-button" aria-label="close" onClick={onClose}></button>
        <h2 className="popup__title">{title}</h2>
        <form onSubmit={onSubmit} className={`form form_${name}`} name={name}>
          {children}
          <button disabled={!isValid} type="submit" className={buttonClassName}>
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
