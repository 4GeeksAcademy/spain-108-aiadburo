from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False)
    first_name = db.Column(db.String, nullable=True)
    last_name = db.Column(db.String, nullable=True)

    posts = db.relationship('Posts', backref='author', lazy=True)
    comments = db.relationship('Comments', backref='user', lazy=True)
    character_favorites = db.relationship('CharacterFavorites', backref='user', lazy=True)
    planet_favorites = db.relationship('PlanetFavorites', backref='user', lazy=True)

    followers = db.relationship('Followers',
                                foreign_keys='Followers.followed_id',
                                backref='followed', lazy='dynamic')
    following = db.relationship('Followers',
                                foreign_keys='Followers.follower_id',
                                backref='follower', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
            "first_name": self.first_name,
            "last_name": self.last_name
        }


class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    body = db.Column(db.String)
    date = db.Column(db.Date, nullable=False)
    image_url = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    comments = db.relationship('Comments', backref='post', lazy=True)
    media = db.relationship('Media', backref='post', lazy=True)


class Media(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    media_type = db.Column(db.Enum('image', 'video', 'audio', name='media_type'), nullable=False)
    url = db.Column(db.String, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)


class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


class Followers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


class CharacterFavorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    character_name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


class PlanetFavorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    planet_name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
