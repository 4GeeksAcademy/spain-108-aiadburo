import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";

const PlanetCard = () => {
    const { uid } = useParams();
    const [planet, setPlanet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const fetchPlanet = async () => {
            try {
                setLoading(true);
                
                const cachedPlanet = localStorage.getItem(`planet_${uid}`);
                
                if (cachedPlanet) {
                    const parsedPlanet = JSON.parse(cachedPlanet);
                    setPlanet(parsedPlanet);
                } else {
                    const response = await fetch(`https://www.swapi.tech/api/planets/${uid}`);
                    const data = await response.json();
                    const planetData = data.result.properties;
                    setPlanet(planetData);
                    
                    localStorage.setItem(`planet_${uid}`, JSON.stringify(planetData));
                }
                
                setImageUrl(
                    `https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/planets/${uid}.jpg`
                );
            } catch (error) {
                console.error("Error loading planet:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlanet();
    }, [uid]);

    const handleImageError = (e) => {
        e.target.src = "https://autismoaraba.org/wp-content/themes/consultix/images/no-image-found-360x260.png";
        e.target.style.objectFit = "cover";
        e.target.style.backgroundColor = "#f8f9fa";
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (!planet) {
        return (
            <div className="text-center my-5">
                <h3>Planet not found</h3>
                <Link to="/planets" className="btn btn-primary mt-3">
                    Back to Planets
                </Link>
            </div>
        );
    }

    return (
        <Container className="my-4">
            <Row>
                <Col md={4} className="mb-4">
                    <Card>
                        <div style={{ 
                            height: "500px",
                            overflow: "hidden",
                            position: "relative",
                            backgroundColor: "#f8f9fa"
                        }}>
                            <img
                                src={imageUrl}
                                className="w-100 h-100"
                                alt={planet.name}
                                style={{ 
                                    objectFit: "cover",
                                    position: "absolute"
                                }}
                                onError={handleImageError}
                            />
                        </div>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card>
                        <Card.Header as="h2" className="bg-dark text-white">
                            {planet.name}
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Climate:</strong> {planet.climate || "N/A"}</p>
                            <p><strong>Terrain:</strong> {planet.terrain || "N/A"}</p>
                            <p><strong>Population:</strong> {planet.population || "N/A"}</p>
                            <p><strong>Diameter:</strong> {planet.diameter || "N/A"} km</p>
                            <p><strong>Gravity:</strong> {planet.gravity || "N/A"}</p>
                            <p><strong>Rotation Period:</strong> {planet.rotation_period || "N/A"} hours</p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/planets" className="btn btn-primary">
                                Back to Planets
                            </Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PlanetCard;