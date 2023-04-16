import { useState, useEffect } from "react";
import axios from "axios";

type Card = {
  id: string;
  name: string;
  imageUrl: string;
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [favorites, setFavorites] = useState<Card[]>([]);

  useEffect(() => {
    axios
      .get(`https://api.scryfall.com/cards/search?q=${searchTerm}`)
      .then((response) => setCards(response.data.data))
      .catch((error) => console.error(error));
  }, [searchTerm]);

  function handleAddToFavorites(card: Card) {
    if (!favorites.find((favorite) => favorite.id === card.id)) {
      const newFavorites = [...favorites, card];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    }
  }

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  function getImageUrl(card: any): string {
    if (card.image_uris?.normal) {
      return card.image_uris.normal;
    } else if (card.image_uris?.png) {
      return card.image_uris.png;
    } else if (card.image_uris?.large) {
      return card.image_uris.large;
    } else if (card.image_uris?.small) {
      return card.image_uris.small;
    } else if (card.image_uris?.art_crop) {
      return card.image_uris.art_crop;
    } else if (card.image_uris?.border_crop) {
      return card.image_uris.border_crop;
    } else {
      return "";
    }
  }

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <div className="card-list">
        {cards.map((card) => (
          <div className="card" key={card.id}>
            <img src={getImageUrl(card)} alt={card.name} />
            <h3>{card.name}</h3>
            {favorites.find((favorite) => favorite.id === card.id) ? (
              <button disabled>Agregado a favoritos</button>
            ) : (
              <button onClick={() => handleAddToFavorites(card)}>
                Agregar a favoritos
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="favorites">
        <h2>Cartas favoritas</h2>
        <ul>
          {favorites.map((card) => (
            <li key={card.id}>
              <img src={getImageUrl(card)} alt={card.name} />
              <span>{card.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
