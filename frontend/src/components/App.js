import React, { useEffect } from 'react';
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

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isAuthOkPopupOpen, setIsAuthOkPopupOpen] = React.useState(false);
  const [isAuthErrPopupOpen, setIsAuthErrPopupOpen] = React.useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cardToDelete, setCardToDelete] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isMobileSized, setIsMobileSized] = React.useState(window.innerWidth <= 650);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [isLoading, setIsLoading] = React.useState(false);
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
    setIsConfirmPopupOpen(true);
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
        setIsAuthOkPopupOpen(true);
        navigate('/signin');
      })
      .catch((err) => {
        setIsAuthErrPopupOpen(true);
      })
      .finally(() => setIsLoading(false));
  };

  const handleLogin = ({ email, password }) => {
    setIsLoading(true);
    authenticate({ email, password })
      .then((user) => {
        // receives user.token
        localStorage.setItem('jwt', user.token);
        setIsLoggedIn(true);
        setCurrentUser({ ...currentUser, email });
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        setIsAuthErrPopupOpen(true);
      })
      .finally(() => setIsLoading(false));
  };

  const handleLogout = () => {
    // setCurrentUser({});
    setIsLoggedIn(false);
    setIsUserDetailsOpen(false);
    localStorage.removeItem('jwt');
  };

  const handleHamburgerClick = () => {
    setIsUserDetailsOpen(!isUserDetailsOpen);
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(null);
    setIsAuthOkPopupOpen(false);
    setIsAuthErrPopupOpen(false);
  };

  useEffect(() => {
    const getUserInfoFromAPI = () => {
      return api.init();
    };
    const getUserInfoFromToken = () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) return validateToken(jwt);
    };

    Promise.allSettled([getUserInfoFromAPI(), getUserInfoFromToken()])
      .then((values) => {
        const [cards, userFromAPI] = values[0].value; // handle API info
        const userFromToken = values[1].value ? values[1].value.data : null; // handle localstorage data
        setCards(cards);
        setCurrentUser({ ...userFromToken, ...userFromAPI });
        if (userFromToken) {
          setIsLoggedIn(true);
          navigate('/');
        }
      })
      .catch((err) => console.log(err));

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
  }, []);

  useEffect(() => {
    setIsMobileSized(windowWidth <= 650);
  }, [windowWidth]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <InfoTooltip isOpen={isAuthOkPopupOpen} onClose={closeAllPopups} isSuccessful={true} onPopupClick={handlePopupClick} />
        <InfoTooltip isOpen={isAuthErrPopupOpen} onClose={closeAllPopups} isSuccessful={false} onPopupClick={handlePopupClick} />
        <EditProfilePopup
          onPopupClick={handlePopupClick}
          isLoading={isLoading}
          onUpdateUser={handleUpdateUser}
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          onPopupClick={handlePopupClick}
          isLoading={isLoading}
          onAddPlaceSubmit={handleAddPlaceSubmit}
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
        />
        <EditAvatarPopup
          onPopupClick={handlePopupClick}
          isLoading={isLoading}
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        />
        <DeleteConfirmPopup
          handlePopupClick={handlePopupClick}
          handleDeleteConfirm={handleConfirmDeleteClick}
          isOpen={isConfirmPopupOpen}
          handleCloseClick={closeAllPopups}
          isLoading={isLoading}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} onPopupClick={handlePopupClick} />
        {isUserDetailsOpen && isMobileSized && <UserDetails handleLogout={handleLogout} />}
        <Header
          isMobileSized={isMobileSized}
          isDropDownOpen={isUserDetailsOpen}
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
                  onEditProfileClick={setIsEditProfilePopupOpen}
                  onAddPlaceClick={setIsAddPlacePopupOpen}
                  onEditAvatarClick={setIsEditAvatarPopupOpen}
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
