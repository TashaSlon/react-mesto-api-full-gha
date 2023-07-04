export default function PopupWithForm({children, name, title, isOpen, onClose, buttonText, onSubmit}) {
  const popupClass = isOpen ? ('popup popup_overlay popup_opened'): 'popup popup_overlay';

  return (
    <section className={popupClass} id={name}>
      <div className="popup__container">
        <button className="btn btn_type_close" type="reset" onClick={onClose}></button>
        <h2 className="popup__title">{title}</h2>
        <form className={`form form-${name}`} name={name} noValidate onSubmit={onSubmit}>
          {children}
          <button className="form__submit btn btn_type_save" type="submit">{buttonText}</button>
        </form>
      </div>
    </section>
  );
}
