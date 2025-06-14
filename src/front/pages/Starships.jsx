import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const Starships = () => {
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStarships = async () => {
            try {
                setLoading(true);
                
                const cachedStarships = localStorage.getItem('starships');
                
                if (cachedStarships) {
                    dispatch({ type: "set_starships", payload: JSON.parse(cachedStarships) });
                } else {
                    const response = await fetch("https://www.swapi.tech/api/starships");
                    const data = await response.json();
                    dispatch({ type: "set_starships", payload: data.results });

                    localStorage.setItem('starships', JSON.stringify(data.results));
                }
            } catch (error) {
                console.error("Error fetching starships:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStarships();
    }, []);

    const handleFavorite = (starship) => {
        const isFavorite = store.favorites.some(fav => fav.uid === starship.uid);
        const action = {
            type: isFavorite ? "remove_favorite" : "add_favorite",
            payload: { ...starship, type: 'starship' }
        };
        dispatch(action);
        
        const updatedFavorites = isFavorite
            ? store.favorites.filter(fav => fav.uid !== starship.uid)
            : [...store.favorites, { ...starship, type: 'starship' }];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const handleImageError = (e) => {
        e.target.src = "https://autismoaraba.org/wp-content/themes/consultix/images/no-image-found-360x260.png";
        e.target.style.objectFit = "cover";
        e.target.style.backgroundColor = "#f8f9fa";
    };

    if (loading) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="my-4" style={{ color: '#333' }}>Starships</h1>
            
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {store.starships?.map((starship) => {
                    const isFavorite = store.favorites.some(fav => fav.uid === starship.uid);
                    return (
                        <div key={starship.uid} className="col">
                            <div className="card h-100" style={{ 
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px'
                            }}>
                                <div style={{ 
                                    height: "300px",
                                    overflow: "hidden",
                                    position: "relative",
                                    backgroundColor: "#f8f9fa",
                                    borderTopLeftRadius: "8px",
                                    borderTopRightRadius: "8px"
                                }}>
                                    <img
                                        src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/starships/${starship.uid}.jpg`}
                                        className="w-100 h-100"
                                        alt={starship.name}
                                        style={{ 
                                            objectFit: "cover",
                                            position: "absolute"
                                        }}
                                        onError={handleImageError}
                                    />
                                </div>
                                <div className="card-body d-flex flex-column" style={{ padding: '1.25rem' }}>
                                    <h5 className="card-title text-center" style={{ 
                                        color: '#333',
                                        marginBottom: '1rem'
                                    }}>
                                        {starship.name}
                                    </h5>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <Link 
                                            to={`/starships/${starship.uid}`} 
                                            className="btn btn-outline-primary"
                                            style={{
                                                borderColor: '#007bff',
                                                color: '#007bff',
                                                padding: '0.375rem 0.75rem'
                                            }}
                                        >
                                            Details
                                        </Link>
                                        <button
                                            onClick={() => handleFavorite(starship)}
                                            className="btn btn-outline-warning"
                                            style={{
                                                borderColor: '#ffc107',
                                                color: '#ffc107',
                                                padding: '0.375rem 0.75rem'
                                            }}
                                        >
                                            {isFavorite ? <FaStar /> : <FaRegStar />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Starships;