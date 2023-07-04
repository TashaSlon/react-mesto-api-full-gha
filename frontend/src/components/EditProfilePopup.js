import PopupWithForm from './PopupWithForm.js';
import { useContext, useState, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
    const currentUser = useContext(CurrentUserContext);
    const [name, setName] = useState(currentUser.name);
    const [description, setDescription] = useState(currentUser.about);

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
      }, [currentUser, isOpen]);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();
      
        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
          name,
          about: description
        });
    }

    return (
        <>
            <PopupWithForm 
            name='profile' 
            title='Редактировать профиль' 
            isOpen={isOpen} 
            onClose={onClose}
            buttonText='Сохранить'
            onSubmit={handleSubmit}>
                <label>
                    <input className="form__input form__input_type_name" type="text" id="name-input" required minLength="2" maxLength="40" placeholder="Имя" name="name" value={name ?? ''} onChange={handleNameChange}/>
                    <span className="form__input-error name-input-error"></span>
                </label>
                <label>
                    <input className="form__input form__input_type_activity" type="text" id="activity-input" required minLength="2" maxLength="200" placeholder="О себе" name="about" value={description ?? ''} onChange={handleDescriptionChange}/>
                    <span className="form__input-error activity-input-error"></span>
                </label>
            </PopupWithForm>
        </>
    );
}