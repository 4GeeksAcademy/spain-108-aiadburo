"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Followers, Posts, Comments, Media, Characters, CharacterFavorites, Planets, PlanetFavorites


api = Blueprint('api', __name__)
CORS(api) # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {"message": "Hello! I'm a message that came from the backend"}
    return response_body, 200

@api.route('/users', methods=['GET', 'POST'])
def users():
    response_body = {}

    if request.method == 'GET':
        response_body['message'] = 'Respuesta del GET'
        rows = db.session.execute(db.select(Users)).scalars()
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200

    if request.method == 'POST':
        data = request.json
        print(data)
        user = Users()
        user.email = data.get('email', 'user@mail.com')
        user.password = data.get('password', '1')
        user.is_active = True
        user.is_admin = data.get('is_admin', False)
        user.first_name = data.get('first_name', None)
        user.last_name = data.get('last_name', None)
        db.session.add(user)
        db.session.commit()
        response_body['results'] = user.serialize()
        response_body['message'] = 'Respuesta del POST de Users'
        return response_body, 201

@api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def user(id):
    response_body = {}
    user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()

    if not user:
        response_body['message'] = f'Usuario {id} no encontrado'
        response_body['results'] = {}
        return response_body, 404

    if request.method == 'GET':
        response_body['message'] = f'Usuario {id} encontrado'
        response_body['results'] = user.serialize()
        return response_body, 200

    if request.method == 'PUT':
        data = request.json
        user.email = data.get('email', user.email)
        user.password = data.get('password', user.password)
        user.is_admin = data.get('is_admin', user.is_admin)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        db.session.commit()
        response_body['message'] = f'Usuario {id} modificado'
        response_body['results'] = user.serialize()
        return response_body, 200

    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        response_body['message'] = f'Usuario {id} eliminado'
        response_body['results'] = {}
        return response_body, 200
    
@api.route('/followers', methods=['POST'])
def follower():
    follower_id = 1
    data = request.json
    following_id = data.get('following_id', None)
    response_body = {}

    if not following_id:
        response_body['message'] = 'ID del usuario a seguir no proporcionado'
        response_body['results'] = None
        return response_body, 400

    existing_follow = db.session.execute(
        db.select(Followers).where(
            (Followers.follower_id == follower_id) & 
            (Followers.following_id == following_id)
        )
    ).scalar()

    if existing_follow:
        response_body['message'] = f'El usuario {follower_id} ya es seguidor del usuario {following_id}'
        response_body['results'] = None
        return response_body, 403

    follow = Followers()
    follow.follower_id = follower_id
    follow.following_id = following_id
    db.session.add(follow)
    db.session.commit()

    response_body['message'] = f'El usuario {follower_id} ahora sigue al usuario {following_id}'
    response_body['results'] = {}
    return response_body, 200