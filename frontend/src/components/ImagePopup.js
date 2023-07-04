export default function ImagePopup({card, onClose}) {
  const popupClass = card._id ? ('popup popup_overlay popup_opened'): 'popup popup_overlay';

  return (
      <section className={popupClass} id="full-card">
          <div className="popup__card-container">
              <button className="btn btn_type_close" type="reset" onClick={onClose}></button>
              <div className="popup__image" style={{ backgroundImage: `url(${card.link})`}}/>
              <h3 className="popup__title-small">{card.name}</h3>
          </div>
      </section>
  );
}
