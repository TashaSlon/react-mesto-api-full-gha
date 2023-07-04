import { useContext } from "react";
import { Card } from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from './Header.js';
import Footer from './Footer.js';

const Main = (props) => {
  const currentUser = useContext(CurrentUserContext);
  const page = 'main';
  
  return (
    <>
    <Header page={page} email={props.userData.email} signOut={props.signOut}/>
    <main className="content">
      <section className="profile">
        <div className="profile__info">
          <div className="avatar" onClick={props.onEditAvatar}>
            <div className="avatar__image" style={{ backgroundImage: `url(${currentUser.avatar})` }}></div>
            <button className="btn btn_type_avatar-edit" type="button"></button>
          </div>
          <div className="profile__text">
            <button className="btn btn_type_edit" type="button" onClick={props.onEditProfile}></button>
            <div>
              <h1 className="profile__name">{currentUser.name}</h1>
              <p className="profile__activity">{currentUser.about}</p>
            </div>
          </div>
        </div>
        <button className="btn btn_type_add" type="button" onClick={props.onAddPlace}></button>
      </section>
      <section className="gallery">
        <ul className="cards">
            {props.cards.map(card => {
                return (<Card key={card._id} card={card} onCardClick={props.onCardClick} onCardLike={props.onCardLike} onCardDelete={props.onCardDelete}/>)
            })}
        </ul>
      </section>
    </main>
    <Footer/>
    </>
  );
};

export {Main};