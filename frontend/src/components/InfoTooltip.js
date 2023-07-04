import fail from '../images/Cross.png';
import success from '../images/Union.png';

export default function InfoTooltip({isOpen, onClose, status}) {
    const popupClass = isOpen ? ('popup popup_overlay popup_opened'): 'popup popup_overlay';
    let name = 'fail';
    let link = fail;
    let title ='Что-то пошло не так! Попробуйте ещё раз.';

    if(status) {
        name = 'success';
        link = success;
        title ='Вы успешно зарегистрировались!';
    }
  
    return (
      <section className={popupClass} id={name}>
        <div className="popup__container popup__status-block">
          <button className="btn btn_type_close" type="reset" onClick={onClose}></button>
          <img src={link} alt="статус" className='popup__status'/>
          <h2 className="popup__title">{title}</h2>
        </div>
      </section>
    );
  }