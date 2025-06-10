import React, { useContext } from "react";
import { ContactContext } from "../services/contacts";
import ContactCard from "../components/ContactCard";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const {
    contacts,
    loading,
    error,
    deleteContact,
    setContactToEdit,
  } = useContext(ContactContext);

  const navigate = useNavigate();

  if (loading) return <p>Cargando contactos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Contactos</h1>
      <button onClick={() => navigate("/add")}>Agregar Contacto</button>
      {contacts.length === 0 && <p>No hay contactos.</p>}
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={() => {
            setContactToEdit(contact);
            navigate("/add");
          }}
          onDelete={() => {
            if (
              window.confirm(
                `¿Está seguro que quiere eliminar a ${contact.name}?`
              )
            ) {
              deleteContact(contact.id);
            }
          }}
        />
      ))}
    </div>
  );
};

export default Contact;
