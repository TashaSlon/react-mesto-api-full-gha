import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function Card({card, onCardClick, onCardLike, onCardDelete}) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some(i => i === currentUser._id);
  const cardLikeButtonClassName = (
    `btn btn_type_like ${isLiked && 'btn_type_like_active'}`
  );;

  function handleClick() {
    onCardClick(card);
  }

  function handleLike() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="card__block">
      {isOwn && <button className="btn btn_type_delete" type="button" onClick={handleDeleteClick}></button>}
      <div className="card">
        <div className="card__image" style={{ backgroundImage: `url(${card.link})`}} onClick={handleClick}></div>
        <div className="card__description">
          <p className="card__name">{card.name}</p>
          <div>
            <button className={cardLikeButtonClassName} type="button" onClick={handleLike}></button>
            <p className="card__likes">{card.likes.length}</p>
          </div>
        </div>
      </div>
    </li>
  );
}