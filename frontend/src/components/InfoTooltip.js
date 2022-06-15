import successImage from '../images/authsuccess.svg';
import errorImage from '../images/autherror.svg';

export default function InfoTooltip(props) {
  const { onPopupClick, isOpen, onClose, isSuccessful } = props;
  return (
    <div onClick={onPopupClick} className={`popup popup_type_info ${isOpen ? 'popup_active' : ''}`}>
      <div className="popup__window popup__window_type_info">
        <button type="button" className="popup__close-button" aria-label="close" onClick={onClose}></button>
        <img
          className="popup__auth-image"
          alt={isSuccessful ? 'V shape signifying successful process' : 'X shape signifying error in process'}
          src={isSuccessful ? successImage : errorImage}
        ></img>
        <h2 className="popup__title">{isSuccessful ? 'Success! You have now been registered.' : 'Oops, something went wrong! Please try again.'}</h2>
      </div>
    </div>
  );
}
