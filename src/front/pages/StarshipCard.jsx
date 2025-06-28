import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";

const StarshipCard = () => {
    const { uid } = useParams();
    const [starship, setStarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const fetchStarship = async () => {
            try {
                setLoading(true);
                
                const cachedStarship = localStorage.getItem(`starship_${uid}`);
                
                if (cachedStarship) {
                    const parsedStarship = JSON.parse(cachedStarship);
                    setStarship(parsedStarship);
                } else {
                    const response = await fetch(`https://www.swapi.tech/api/starships/${uid}`);
                    const data = await response.json();
                    const starshipData = data.result.properties;
                    setStarship(starshipData);
                    
                    localStorage.setItem(`starship_${uid}`, JSON.stringify(starshipData));
                }
                
                setImageUrl(
                    `https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/starships/${uid}.jpg`
                );
            } catch (error) {
                console.error("Error loading starship:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStarship();
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

    if (!starship) {
        return (
            <div className="text-center my-5">
                <h3>Starship not found</h3>
                <Link to="/starships" className="btn btn-primary mt-3">
                    Back to Starships
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
                                alt={starship.name}
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
                            {starship.name}
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Model:</strong> {starship.model || "N/A"}</p>
                            <p><strong>Manufacturer:</strong> {starship.manufacturer || "N/A"}</p>
                            <p><strong>Cost:</strong> {starship.cost_in_credits || "N/A"} credits</p>
                            <p><strong>Length:</strong> {starship.length || "N/A"} meters</p>
                            <p><strong>Crew:</strong> {starship.crew || "N/A"}</p>
                            <p><strong>Passengers:</strong> {starship.passengers || "N/A"}</p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/starships" className="btn btn-primary">
                                Back to Starships
                            </Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StarshipCard;