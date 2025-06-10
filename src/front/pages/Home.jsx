import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { fetchContacts, deleteContact } from "../services/contacts";
import ContactCard from "../components/ContactCard";
import { Link } from "react-router-dom";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();

    const loadContacts = async () => {
        const data = await fetchContacts();
        dispatch({ type: "set_contacts", payload: data.contacts });
    };

    const handleDelete = async (id) => {
        await deleteContact(id);
        loadContacts();
    };

    useEffect(() => {
        loadContacts();
    }, []);

    return (
        <div className="container">
            <h1 className="my-4">Contactos</h1>
            <Link to="/add" className="btn btn-primary mb-3">Agregar Contacto</Link>
            <div>
                {store.contacts.map(contact => (
                    <ContactCard key={contact.id} contact={contact} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    );
};
