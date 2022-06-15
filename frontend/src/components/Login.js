import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Login = (props) => {
  const { isLoggedIn, isLoading, onSubmit } = props;
  const [inputs, setInputs] = React.useState({});
  const [errorFields, setErrorFields] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ email: inputs.emailInput, password: inputs.passwordInput });
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

  useEffect(() => {
    const areFieldsEmpty = !inputs.emailInput || !inputs.passwordInput;
    const formHasErrors = Boolean(errorFields.emailInput || errorFields.passwordInput);
    const isFormValid = !(areFieldsEmpty || formHasErrors);
    setIsValid(isFormValid);
  }, [inputs, errorFields]);

  useEffect(() => {
    // reset the form fields when user successfully registered/logged in
    // or when component switched to another form view
    setInputs({});
    setErrorFields({});
    setIsValid(false);
  }, [isLoggedIn]);

  return (
    <div className="form-page__container">
      <h2 className="form-page__title">Log in</h2>
      <form onSubmit={handleSubmit} className={`form-page__form`} name="signup">
        <input
          onChange={handleInput}
          value={inputs.emailInput || ''}
          id="email-input"
          type="email"
          className={`form-page__input`}
          name="emailInput"
          required
          minLength="2"
          maxLength="40"
          placeholder="Email"
        />
        <span className={`form__input-error ${isValid ? '' : 'form__input-error_active'}`}>{errorFields.emailInput}</span>
        <input
          onChange={handleInput}
          value={inputs.passwordInput || ''}
          id="password-input"
          type="password"
          className={`form-page__input`}
          name="passwordInput"
          required
          minLength="2"
          maxLength="200"
          placeholder="Password"
        />
        <span className={`form__input-error ${isValid ? '' : 'form__input-error_active'}`}>{errorFields.passwordInput}</span>
        <button disabled={!isValid} type="submit" className={`button form-page__submit-button ${!isValid ? 'button_disabled' : ''}`}>
          {isLoading ? 'Logging you in...' : 'Log in'}
        </button>
        <div className="form-page__text-info">
          <Link to="/signup" style={{ color: 'inherit', textDecoration: 'inherit' }}>
            Not a member? Sign up here!
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
