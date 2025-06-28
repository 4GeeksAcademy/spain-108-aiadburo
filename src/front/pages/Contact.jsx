import React, { useEffect, useState } from "react";
import { deleteContact, fetchContacts } from "../services/contacts";
import ContactCard from "../components/ContactCard";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Contact = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContacts();
      dispatch({ type: "set_contacts", payload: data.contacts || [] });
    } catch (err) {
      setError(err.message || "Error al cargar contactos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Está seguro que quiere eliminar a ${name}?`)) {
      try {
        await deleteContact(id);
        dispatch({ type: "delete_contact", payload: id });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container alert alert-danger mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Contactos</h1>
        <button
          onClick={() => navigate("/add")}
          className="btn btn-primary"
        >
          Agregar Contacto
        </button>
      </div>

      {store.contacts.length === 0 ? (
        <div className="alert alert-info">
          No hay contactos.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {store.contacts.map((contact) => (
            <div key={contact.id} className="col">
              <ContactCard
                contact={contact}
                onDelete={() => handleDelete(contact.id, contact.name)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contact;
