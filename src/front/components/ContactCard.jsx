import React from "react";
import { Link } from "react-router-dom";

const ContactCard = ({ contact, onDelete }) => {
    return (
        <div className="card mb-2 p-3">
            <h5>{contact.name}</h5>
            <p>Email: {contact.email}</p>
            <p>Phone: {contact.phone}</p>
            <p>Address: {contact.address}</p>
            <div>
                <Link to={`/edit/${contact.id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
                <button onClick={() => onDelete(contact.id)} className="btn btn-sm btn-danger">Eliminar</button>
            </div>
        </div>
    );
};

export default ContactCard;
