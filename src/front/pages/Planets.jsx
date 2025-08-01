import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const Planets = () => {
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanets = async () => {
            try {
                setLoading(true);
                
                // Verificar si hay planetas en localStorage
                const cachedPlanets = localStorage.getItem('planets');
                
                if (cachedPlanets) {
                    dispatch({ type: "set_planets", payload: JSON.parse(cachedPlanets) });
                } else {
                    const response = await fetch("https://www.swapi.tech/api/planets");
                    const data = await response.json();
                    dispatch({ type: "set_planets", payload: data.results });
                    // Guardar en localStorage
                    localStorage.setItem('planets', JSON.stringify(data.results));
                }
            } catch (error) {
                console.error("Error fetching planets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlanets();
    }, []);

    const handleFavorite = (planet) => {
        const isFavorite = store.favorites.some(fav => fav.uid === planet.uid);
        const action = {
            type: isFavorite ? "remove_favorite" : "add_favorite",
            payload: { ...planet, type: 'planet' }
        };
        dispatch(action);
        
        // Actualizar localStorage con los favoritos
        const updatedFavorites = isFavorite
            ? store.favorites.filter(fav => fav.uid !== planet.uid)
            : [...store.favorites, { ...planet, type: 'planet' }];
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
            <h1 className="my-4" style={{ color: '#333' }}>Planets</h1>
            
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {store.planets?.map((planet) => {
                    const isFavorite = store.favorites.some(fav => fav.uid === planet.uid);
                    return (
                        <div key={planet.uid} className="col">
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
                                        src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/planets/${planet.uid}.jpg`}
                                        className="w-100 h-100"
                                        alt={planet.name}
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
                                        {planet.name}
                                    </h5>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <Link 
                                            to={`/planets/${planet.uid}`} 
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
                                            onClick={() => handleFavorite(planet)}
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

export default Planets;