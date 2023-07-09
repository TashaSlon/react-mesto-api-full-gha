import PopupWithForm from './PopupWithForm.js';
import { useState, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function AddPlacePopup({isOpen, onClose, onAddPlace}) {
    const currentUser = useContext(CurrentUserContext);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleLinkChange(e) {
        setLink(e.target.value);
    }

    function handleClose() {
      onClose();
      setName('');
      setLink('');
  }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onAddPlace({
          name,
          link,
          _id: currentUser._id
        });
    }

    return (
        <>
            <PopupWithForm
          name='add' title='Новое место'
          isOpen={isOpen}
          onClose={handleClose}
          buttonText='Сохранить'
          onSubmit={handleSubmit}>
          <label>
            <input className="form__input form__input_type_title" type="text" id="title-input" required minLength="2" maxLength="30" placeholder="Название" name="name" onChange={handleNameChange} value={name}/>
            <span className="form__input-error title-input-error"></span>
          </label>
          <label>
            <input className="form__input form__input_type_link" type="url" id="link-input" required placeholder="Ссылка на картинку" name="link" onChange={handleLinkChange} value={link}/>
            <span className="form__input-error link-input-error"></span>
          </label>
        </PopupWithForm>

        </>
    );
}