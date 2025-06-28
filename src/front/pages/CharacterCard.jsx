import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";

const CharacterCard = () => {
    const { uid } = useParams();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                setLoading(true);
                
                const cachedCharacter = localStorage.getItem(`character_${uid}`);
                
                if (cachedCharacter) {
                    const parsedCharacter = JSON.parse(cachedCharacter);
                    setCharacter(parsedCharacter);
                } else {
                    const response = await fetch(`https://www.swapi.tech/api/people/${uid}`);
                    const data = await response.json();
                    const characterData = data.result.properties;
                    setCharacter(characterData);
                    
                    localStorage.setItem(`character_${uid}`, JSON.stringify(characterData));
                }
                
                setImageUrl(
                    `https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/characters/${uid}.jpg`
                );
            } catch (error) {
                console.error("Error loading character:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
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

    if (!character) {
        return (
            <div className="text-center my-5">
                <h3>Character not found</h3>
                <Link to="/characters" className="btn btn-primary mt-3">
                    Back to Characters
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
                                alt={character.name}
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
                            {character.name}
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Gender:</strong> {character.gender || "N/A"}</p>
                            <p><strong>Birth Year:</strong> {character.birth_year || "N/A"}</p>
                            <p><strong>Height:</strong> {character.height || "N/A"} cm</p>
                            <p><strong>Mass:</strong> {character.mass || "N/A"} kg</p>
                            <p><strong>Hair Color:</strong> {character.hair_color || "N/A"}</p>
                            <p><strong>Eye Color:</strong> {character.eye_color || "N/A"}</p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/characters" className="btn btn-primary">
                                Back to Characters
                            </Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CharacterCard;