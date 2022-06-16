import React, { useEffect, useReducer } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Main from './Main';
import Footer from './Footer';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import UserDetails from './UserDetails';
import { register, authenticate, validateToken } from '../utils/auth';
import Register from './Register';
import Login from './Login';
import { popupReducer, popupReset } from './reducers/popupReducer';

function App() {
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cardToDelete, setCardToDelete] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isMobileSized, setIsMobileSized] = React.useState(window.innerWidth <= 650);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [popupState, popupDispatch] = useReducer(popupReducer, popupReset(), popupReset);
  const navigate = useNavigate();

  const handleResize = () => setWindowWidth(window.innerWidth);

  const handlePopupClick = (event) => event.target.classList.contains('popup_active') && closeAllPopups();

  const handleUpdateAvatar = (url) => {
    setIsLoading(true);
    api
      .updateUserImage(url)
      .then((user) => {
        setCurrentUser({ ...currentUser, ...user });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateUser = ({ name, about }) => {
    setIsLoading(true);
    api
      .updateUserInfo({ name, about })
      .then((user) => {
        setCurrentUser({ ...currentUser, ...user });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleAddPlaceSubmit = ({ name, link }) => {
    setIsLoading(true);
    api
      .submitNewCard({ name, link })
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleCardLike = (card, isLiked) => {
    api
      .handleLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((currentCard) => (currentCard._id === card._id ? newCard : currentCard)));
      })
      .catch((err) => console.log(err));
  };

  const handleCardDeleteClick = (card) => {
    setCardToDelete(card);
    popupDispatch({ type: 'open delete confirm' });
  };

  const handleConfirmDeleteClick = () => {
    setIsLoading(true);
    const { _id: id } = cardToDelete;
    api
      .deleteCard(id)
      .then(() => {
        const filteredCards = cards.filter((card) => card._id !== id);
        setCards(filteredCards);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleNewUserSubmit = ({ email, password }) => {
    setIsLoading(true);
    register({ email, password })
      .then((user) => {
        // receives user.data._id user.data.email
        // optionally log user in here
        popupDispatch({ type: 'open auth ok' });
        navigate('/signin');
      })
      .catch((err) => {
        popupDispatch({ type: 'open auth err' });
      })
      .finally(() => setIsLoading(false));
  };

  const handleLogin = ({ email, password }) => {
    setIsLoading(true);
    authenticate({ email, password })
      .then(async (user) => {
        localStorage.setItem('jwt', user.token);
        const loggedUser = await validateToken(user.token);
        api.setUserToken(user.token);
        setIsLoggedIn(true);
        setCurrentUser(loggedUser);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        popupDispatch({ type: 'open auth err' });
      })
      .finally(() => setIsLoading(false));
  };

  const handleLogout = () => {
    // setCurrentUser({});
    setIsLoggedIn(false);
    popupDispatch({ type: 'close user details' });
    localStorage.removeItem('jwt');
  };

  const handleHamburgerClick = () => {
    popupDispatch({ type: 'toggle user details' });
  };

  const closeAllPopups = () => {
    popupDispatch({ type: 'close all popups' });
    setSelectedCard(null);
  };

  useEffect(() => {
    api
      .getInitialCards()
      .then((cards) => {
        cards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCards(cards);
      })
      .catch((err) => console.log(err));

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      validateToken(jwt)
        .then((user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          navigate('/');
        })
        .catch((err) => console.log(err));
    }

    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', closeByEscape);
    return () => {
      document.removeEventListener('keydown', closeByEscape);
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  useEffect(() => {
    setIsMobileSized(windowWidth <= 650);
  }, [windowWidth]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <InfoTooltip isOpen={popupState.isAuthOkPopupOpen} onClose={closeAllPopups} isSuccessful={true} onPopupClick={handlePopupClick} />
        <InfoTooltip isOpen={popupState.isAuthErrPopupOpen} onClose={closeAllPopups} isSuccessful={false} onPopupClick={handlePopupClick} />
        <EditProfilePopup
          onPopupClick={handlePopupClick}
          isLoading={isLoading}
          onUpdateUser={handleUpdateUser}
          isOpen={popupState.isEditProfilePopupOpen}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          onPopupClick={handlePopupClick}
          isLoading={isLoading}
          onAddPlaceSubmit={handleAddPlaceSubmit}
          isOpen={popupState.isAddPlacePopupOpen}
          onClose={closeAllPopups}
        />
        <EditAvatarPopup
          onPopupClick={handlePopupClick}
          isLoading={isLoading}
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={popupState.isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        />
        <DeleteConfirmPopup
          handlePopupClick={handlePopupClick}
          handleDeleteConfirm={handleConfirmDeleteClick}
          isOpen={popupState.isConfirmPopupOpen}
          handleCloseClick={closeAllPopups}
          isLoading={isLoading}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} onPopupClick={handlePopupClick} />
        {popupState.isUserDetailsOpen && isMobileSized && <UserDetails handleLogout={handleLogout} />}
        <Header
          isMobileSized={isMobileSized}
          isDropDownOpen={popupState.isUserDetailsOpen}
          handleHamburgerClick={handleHamburgerClick}
          handleLogout={handleLogout}
          isLoggedIn={isLoggedIn}
        />
        <Routes>
          <Route path="/signin" element={<Login isLoading={isLoading} onSubmit={handleLogin} isLoggedIn />} />
          <Route path="/signup" element={<Register onSubmit={handleNewUserSubmit} isLoading={isLoading} isLoggedIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectPath="/signin" isLoggedIn={isLoggedIn}>
                <Main
                  onEditProfileClick={() => popupDispatch({ type: 'open edit profile' })}
                  onAddPlaceClick={() => popupDispatch({ type: 'open add place' })}
                  onEditAvatarClick={() => popupDispatch({ type: 'open edit avatar' })}
                  onCardClick={setSelectedCard}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDeleteClick}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
