import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { FaTrash } from "react-icons/fa";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();

    const handleRemoveFavorite = (uid, e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "remove_favorite", payload: { uid } });
    };

    return (
        <nav className="navbar navbar-light bg-dark">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">
                        <img src="https://lumiere-a.akamaihd.net/v1/images/sw_logo_stacked_2x-52b4f6d33087_7ef430af.png" height="40" />
                    </span>
                </Link>
                
                <Link to="/characters" className="nav-link text-white">
                    <span className="navbar-item">Characters</span>
                </Link>
                
                <Link to="/planets" className="nav-link text-white">
                    <span className="navbar-item">Planets</span>
                </Link>
                
                <Link to="/starships" className="nav-link text-white">
                    <span className="navbar-item">Starships</span>
                </Link>
                
                <Link to="/contact" className="nav-link text-white">
                    <span className="navbar-item">Contacts</span>
                </Link>
                
                <div className="dropdown">
                    <button
                        className="btn btn-primary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Favorites ({store.favorites.length})
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                        {store.favorites.length === 0 ? (
                            <li><span className="dropdown-item">No favorites yet</span></li>
                        ) : (
                            store.favorites.map((fav) => (
                                <li key={fav.uid}>
                                    <div className="dropdown-item d-flex justify-content-between align-items-center">
                                        <Link 
                                            to={`/${fav.type === 'character' ? 'characters' : fav.type}s/${fav.uid}`}
                                            className="text-decoration-none text-dark flex-grow-1 pe-2"
                                        >
                                            {fav.name}
                                        </Link>
                                        <button 
                                            onClick={(e) => handleRemoveFavorite(fav.uid, e)}
                                            className="btn btn-sm text-danger p-0 border-0 bg-transparent ms-2"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};