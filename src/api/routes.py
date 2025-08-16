"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Followers, Posts, Comments, Media, Characters, CharacterFavorites, Planets, PlanetFavorites

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

# Usuario simulado como "logueado"
CURRENT_USER_ID = 1  

# Nota para el profesor:
# He usado /characters en vez de /people porque ya tenía el modelo de /characters creado previamente.
# Si se necesita renombrar /characters a /people o crear un nuevo modelo puedo hacerlo sin problema.
# Las peticiones a /favorite indicadas en el ejercicio se hacen a /favorites con una 's' al final.
# He probado todas las peticiones con postman y funcionan correctamente, he simulado el user logueado.

# Dejo aqui un resumen de las pruebas realizadas con postman para demostrar que funciona todo bien:

# [GET] /people Listar todos los registros de people en la base de datos:
# GET a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/characters
# [GET] /people/<int:people_id> Muestra la información de un solo personaje según su id:
# GET a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/characters/1
# [GET] /planets Listar todos los registros de planets en la base de datos:
# GET a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/planets
# [GET] /planets/<int:planet_id> Muestra la información de un solo planeta según su id:
# GET a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/planets/1

# [GET] /users Listar todos los usuarios del blog:
# GET a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/users
# [GET] /users/favorites Listar todos los favoritos que pertenecen al usuario actual:
# GET a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/users/favorites
# [POST] /favorite/planet/<int:planet_id> Añade un nuevo planet favorito al usuario actual con el id = planet_id:
# POST a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/favorite/planet/1
# [POST] /favorite/people/<int:people_id> Añade un nuevo people favorito al usuario actual con el id = people_id:
# POST a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/favorite/character/1
# [DELETE] /favorite/planet/<int:planet_id> Elimina un planet favorito con el id = planet_id:
# DELETE a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/favorite/planet/1
# DELETE a: https://super-guide-7vwvw5rx5rr52x47x-3001.app.github.dev/api/favorite/character/1

# ----------------------------
# HELLO
# ----------------------------
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {"message": "Hello! I'm a message that came from the backend"}
    return response_body, 200


# ----------------------------
# CHARACTERS
# ----------------------------
@api.route('/characters', methods=['GET'])
def get_characters():
    rows = db.session.execute(db.select(Characters)).scalars()
    return {
        "message": "Lista de personajes",
        "results": [row.serialize() for row in rows]
    }, 200

@api.route('/characters/<int:character_id>', methods=['GET'])
def get_character(character_id):
    char = db.session.get(Characters, character_id)
    if not char:
        return {"message": "Personaje no encontrado", "results": {}}, 404
    return {"message": "Personaje encontrado", "results": char.serialize()}, 200


# ----------------------------
# PLANETS
# ----------------------------
@api.route('/planets', methods=['GET'])
def get_planets():
    rows = db.session.execute(db.select(Planets)).scalars()
    return {
        "message": "Lista de planetas",
        "results": [row.serialize() for row in rows]
    }, 200

@api.route('/planets/<int:planet_id>', methods=['GET'])
def get_planet(planet_id):
    planet = db.session.get(Planets, planet_id)
    if not planet:
        return {"message": "Planeta no encontrado", "results": {}}, 404
    return {"message": "Planeta encontrado", "results": planet.serialize()}, 200


# ----------------------------
# USERS
# ----------------------------
@api.route('/users', methods=['GET'])
def get_users():
    rows = db.session.execute(db.select(Users)).scalars()
    return {
        "message": "Lista de usuarios",
        "results": [row.serialize() for row in rows]
    }, 200

@api.route('/users/favorites', methods=['GET'])
def get_user_favorites():
    char_favs = db.session.execute(
        db.select(CharacterFavorites).where(CharacterFavorites.user_id == CURRENT_USER_ID)
    ).scalars()
    planet_favs = db.session.execute(
        db.select(PlanetFavorites).where(PlanetFavorites.user_id == CURRENT_USER_ID)
    ).scalars()

    return {
        "message": f"Favoritos del usuario {CURRENT_USER_ID}",
        "results": {
            "characters": [fav.serialize() for fav in char_favs],
            "planets": [fav.serialize() for fav in planet_favs]
        }
    }, 200


# ----------------------------
# FAVORITES
# ----------------------------
@api.route('/favorite/planet/<int:planet_id>', methods=['POST'])
def add_favorite_planet(planet_id):
    fav = PlanetFavorites(user_id=CURRENT_USER_ID, planet_id=planet_id)
    db.session.add(fav)
    db.session.commit()
    return {"message": "Planeta agregado a favoritos", "results": fav.serialize()}, 201

@api.route('/favorite/character/<int:character_id>', methods=['POST'])
def add_favorite_character(character_id):
    fav = CharacterFavorites(user_id=CURRENT_USER_ID, character_id=character_id)
    db.session.add(fav)
    db.session.commit()
    return {"message": "Personaje agregado a favoritos", "results": fav.serialize()}, 201

@api.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
def delete_favorite_planet(planet_id):
    fav = db.session.execute(
        db.select(PlanetFavorites).where(
            (PlanetFavorites.user_id == CURRENT_USER_ID) & 
            (PlanetFavorites.planet_id == planet_id)
        )
    ).scalar()
    if not fav:
        return {"message": "Favorito no encontrado"}, 404
    db.session.delete(fav)
    db.session.commit()
    return {"message": "Planeta eliminado de favoritos"}, 200

@api.route('/favorite/character/<int:character_id>', methods=['DELETE'])
def delete_favorite_character(character_id):
    fav = db.session.execute(
        db.select(CharacterFavorites).where(
            (CharacterFavorites.user_id == CURRENT_USER_ID) & 
            (CharacterFavorites.character_id == character_id)
        )
    ).scalar()
    if not fav:
        return {"message": "Favorito no encontrado"}, 404
    db.session.delete(fav)
    db.session.commit()
    return {"message": "Personaje eliminado de favoritos"}, 200
