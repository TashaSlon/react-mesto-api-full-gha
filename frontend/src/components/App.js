import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import {Main} from './Main';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import Login from './Login.js';
import Register from './Register.js';
import { api } from '../utils/Api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import {EditProfilePopup} from './EditProfilePopup.js';
import {EditAvatarPopup} from './EditAvatarPopup.js';
import {AddPlacePopup} from './AddPlacePopup.js';
import ProtectedRouteElement from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import { getEmail, authorize, register,logout } from '../utils/auth.js';


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [status, setStatus] = useState(false);

  const navigate = useNavigate();

  function tokenCheck() {
    getEmail()
    .then((res) => {
      if (res){
        setLoggedIn(true);
        navigate("/", {replace: true});
      }
    })
    .catch(err => console.log(`Ошибка.....: ${err}`))
  };

  useEffect(() => {
    tokenCheck();
    if (loggedIn){
      api.getUserInfo()
        .then(userData => {
          setCurrentUser(userData);
        })
        .catch(err => console.log(`Ошибка.....: ${err}`))
    }},[loggedIn]);

  useEffect(() => {
    if (loggedIn){
      api.getCards()
      .then(cards => {
        setCards(cards);
      })
      .catch(err => console.log(`Ошибка.....: ${err}`))
    }},[loggedIn]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleInfoTooltipClick(res) {
    if(res.data) {
      setStatus(true);
    }
    setIsInfoTooltipOpen(true);
  };

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsSubmitPopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipOpen(false);
  };

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch(err => console.log(`Ошибка.....: ${err}`))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
    })
    .catch(err => console.log(`Ошибка.....: ${err}`))
  }

  function handleUpdateUser(userData) {
    api.setUserInfo(userData)
    .then(() => {
      setCurrentUser({...currentUser, name: userData.name, about: userData.about});
      closeAllPopups();
    })
    .catch(err => console.log(`Ошибка.....: ${err}`))
  }

  function handleUpdateAvatar(avatar) {
    api.setUserAvatar(avatar)
    .then(() => {
      setCurrentUser({...currentUser, avatar});
      closeAllPopups();
    })
    .catch(err => console.log(`Ошибка.....: ${err}`))
  }

  function handleAddPlaceSubmit(place) {
    api.addNewCard(place)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch(err => console.log(`Ошибка.....: ${err}`))
  }

  function handleLogin(password, email) {
    authorize(password, email)
      .then(() => {
          setUserData(email);
          setLoggedIn(true);
          navigate('/', {replace: true});
      })
      .catch(err => {
        setStatus(false);
        handleInfoTooltipClick(err);
      });
  }

  function handleRegister(password, email) {
    register(password, email)
    .then((res) => {
        handleInfoTooltipClick(res);
        navigate('/sign-in', {replace: true});
    })
    .catch(err => {
      setStatus(false);
      handleInfoTooltipClick(err);
    });
  }

  function signOut(){
    logout()
    .then((res) => {
      setLoggedIn(false);
      navigate('/sign-in', {replace: true});
    })
    .catch(err => {
      setStatus(false);
      handleInfoTooltipClick(err);
    });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route path="/" element={<ProtectedRouteElement
          element={Main} onEditProfile = {handleEditProfileClick}
            onAddPlace = {handleAddPlaceClick}
            onEditAvatar = {handleEditAvatarClick}
            onCardClick = {handleCardClick}
            onCardLike = {handleCardLike}
            cards = {cards}
            onCardDelete = {handleCardDelete}
            userData = {userData}
            signOut = {signOut}
          loggedIn={loggedIn}/>} />
          <Route path="/sign-up" element={
            <div className="registerContainer">
              <Register onRegister={handleRegister} />
            </div>} />
          <Route path="/sign-in" element={
            <div className="loginContainer">
              <Login handleLogin={handleLogin}/>
            </div>} />
          <Route path="/" element={loggedIn ? <Navigate to="/" replace /> : <Navigate to="/sign-in" replace />} />
        </Routes>

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} status={status}/>

        <PopupWithForm
          name='submit'
          title='Вы уверены?'
          isOpen={isSubmitPopupOpen}
          onClose={closeAllPopups}
          buttonText='Да'
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
