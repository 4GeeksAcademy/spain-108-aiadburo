export const initialStore = () => {

    const savedFavorites = localStorage.getItem('swapi-favorites');
  return {
    contacts: [],
    characters: [],
    planets: [],
    starships: [],
    favorites: savedFavorites ? JSON.parse(savedFavorites) : [],
    message: null
  };
};

export default function storeReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case "set_contacts":
      newState = {
        ...state,
        contacts: Array.isArray(action.payload) ? action.payload : []
      };
      break;

    case "add_contact":
      newState = {
        ...state,
        contacts: [...state.contacts, action.payload]
      };
      break;

    case "update_contact":
      newState = {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        )
      };
      break;

    case "delete_contact":
      newState = {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload)
      };
      break;

    case "set_characters":
      newState = {
        ...state,
        characters: action.payload
      };
      break;

    case "set_planets":
      newState = {
        ...state,
        planets: action.payload
      };
      break;

    case "set_starships":
      newState = {
        ...state,
        starships: action.payload
      };
      break;

    case "add_favorite":

    if (state.favorites.some(fav => fav.uid === action.payload.uid)) {
        return state;
      }
      newState = {
        ...state,
        favorites: [...state.favorites, action.payload]
      };
      break;

    case "remove_favorite":
      newState = {
        ...state,
        favorites: state.favorites.filter(fav => fav.uid !== action.payload.uid)
      };
      break;

    case "set_hello":
      newState = {
        ...state,
        message: action.payload
      };
      break;

    default:
      throw new Error("Unknown action.");
  }

  if (action.type === "add_favorite" || action.type === "remove_favorite") {
    localStorage.setItem('swapi-favorites', JSON.stringify(newState.favorites));
  }

  return newState;
}