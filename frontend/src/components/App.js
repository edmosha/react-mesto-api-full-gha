import {useEffect, useState} from "react";
import {CurrentUserContext} from './contexts/CurrentUserContext';
import api from "../utils/api";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeleteCardPopup from "./ConfirmDeleteCardPopup";
import InfoTooltip from "./InfoTooltip";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import okIcon from "../images/status-ok.svg"
import errorIcon from "../images/status-error.svg"
import {login, register} from "../utils/Auth";

function App() {

  const [ isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [ isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [ isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [ isConfirmCardDeletePopupOpen, setIsConfirmCardDeletePopupOpen] = useState(false);

  const [ isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [ isOkPopupOpen, setIsOkPopupOpen] = useState(false);
  const [ error, setError ] = useState('')

  const [ selectedCard, setSelectedCard ] = useState({ id: '', title: '', src: '' });
  const [ isLoading, setIsLoading ] = useState(false);

  const [ currentUser, setCurrentUser ] = useState({});
  const [ cards, setCards ] = useState([]);
  const [ cardForDelete, setCardForDelete ] = useState({});

  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ isPageLoading, setIsPageLoading ] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userId');
    if(token) {

      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
          setLoggedIn(true);
          navigate('/main', {replace: true});
          setIsPageLoading(false);
        })
        .catch((err) => {
          console.log(err)
        });
    } else {
      navigate('/sign-in', {replace: true});
      setIsPageLoading(false);
    }

  }, [loggedIn])


  const handleRegister = (email, password) => {
    return register(email, password)
      .then((res) => {
        handleOk();
        navigate('/sign-in', {replace: true});
        return res;
      })
      .catch((err) => {
        err === 400 ? handleError('Пользователь с таким email уже зарегистрирован') : handleError();
      })
  }

  const handleLoggedIn = (value) => {
    setLoggedIn(value);
  }

  const handleLogin = (email, password) => {
    return login(email, password)
      .then((res) => {
        handleLoggedIn(true);
        return res;
      })
      .catch((err) => {
        err === 401 ? handleError('Неверный логин или пароль') : handleError();
      })
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmCardDeletePopupOpen(false);
    setIsErrorPopupOpen(false);
    setIsOkPopupOpen(false);

    setSelectedCard({ id: '', title: '', src: '' })
  }

  function handleError(error= 'Что-то пошло не так! Попробуйте ещё раз.') {
    closeAllPopups();
    setIsErrorPopupOpen(true);
    setError(error);
  }

  function handleOk() {
    closeAllPopups();
    setIsOkPopupOpen(true);
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked)

      .then((newCard) => {
        setCards(state => state.map(c => c._id === card._id ? newCard : c));
      })
      .catch(() => handleError());
  }

  const handleCardDelete = (card) => {
    setCardForDelete(card);
    setIsConfirmCardDeletePopupOpen(true);
  }

  const handleConfirmCardDelete = () => {
    setIsLoading(true);

    api.deleteCard(cardForDelete._id)

      .then(() => {
        setCards(state => state.filter(c => c._id !== cardForDelete._id));
        setCardForDelete({});
        closeAllPopups();
      })
      .catch(() => handleError())
      .finally(() => setIsLoading(false));
  }

  const handleCardClick = (card) => {
    setSelectedCard({
      id: card._id,
      title: card.name,
      src: card.link
    })
  }

  const handleUpdateUser = ({ name, about }) => {
    setIsLoading(true);

    api.setUserInfo(name, about)

      .then(newUserData => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch(() => handleError())
      .finally(() => setIsLoading(false));
  }

  const handleUpdateAvatar = ({ avatar }) => {
    setIsLoading(true);

    api.updateAvatar(avatar)

      .then(newUserData => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch(() => handleError())
      .finally(() => setIsLoading(false));
  }

  const handleAddPlaceSubmit = ({ title, image }) => {
    setIsLoading(true);

    api.postNewCard(title, image)

      .then(newCard => {
        setCards([ newCard, ...cards ])
        closeAllPopups();
      })
      .catch(() => handleError())
      .finally(() => setIsLoading(false));
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        {!isPageLoading
          ? (<>
            <section className="content">
              <Header loggedIn={loggedIn} handleLoggedIn={handleLoggedIn} />

              <main>
                <Routes>

                  <Route path="/" element={
                    loggedIn
                      ? <Navigate to="/main" replace />
                      : <Navigate to="/sign-in" replace />
                  } />

                  <Route path="/main" element={
                    <ProtectedRoute
                      element={Main}
                      loggedIn={loggedIn}
                      cards={cards}
                      onEditProfile={ () => setIsEditProfilePopupOpen(true) }
                      onAddPlace={ () => setIsAddPlacePopupOpen(true) }
                      onEditAvatar={ () => setIsEditAvatarPopupOpen(true) }
                      onCardClick={ handleCardClick }
                      onCardLike={ handleCardLike }
                      onCardDelete={ handleCardDelete }
                    />
                  }/>

                  <Route path="/sign-in" element={<Login handleLogin={handleLogin} />} />
                  <Route path="/sign-up" element={<Register handleRegister={handleRegister} />} />

                </Routes>
              </main>
            </section>

            <Footer />

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              isLoading={isLoading}
              onClose={ closeAllPopups }
              onUpdateUser={ handleUpdateUser }
            />

            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              isLoading={isLoading}
              onClose={ closeAllPopups }
              onUpdateAvatar={ handleUpdateAvatar }
            />

            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              isLoading={isLoading}
              onClose={ closeAllPopups }
              onAddPlace={ handleAddPlaceSubmit }
            />

            <ConfirmDeleteCardPopup
              isOpen={isConfirmCardDeletePopupOpen}
              isLoading={isLoading}
              onClose={ closeAllPopups }
              onCardDelete={ handleConfirmCardDelete }
            />

            <InfoTooltip
              title="Вы успешно зарегистрировались!"
              image={okIcon}
              isOpen={isOkPopupOpen}
              onClose={ closeAllPopups }
            />

            <InfoTooltip
              title={error}
              image={errorIcon}
              isOpen={isErrorPopupOpen}
              onClose={ closeAllPopups }
            />

            <ImagePopup card={selectedCard} onClose={ closeAllPopups } />

          </>)
          :  (
            <svg className="spinner" viewBox="0 0 50 50">
              <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
            </svg>
          )
        }
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

