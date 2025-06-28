import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addContact, fetchContacts, updateContact } from "../services/contacts";

export const AddContact = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchContacts()
        .then((data) => {
          const contact = data.contacts.find((c) => String(c.id) === id);
          if (!contact) {
            setError("Contacto no encontrado");
          } else {
            setForm({
              name: contact.name || "",
              email: contact.email || "",
              phone: contact.phone || "",
              address: contact.address || "",
            });
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Error al cargar contactos");
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateContact(id, form);
      } else {
        await addContact({ ...form, agenda_slug: "aiadburo" });
      }
      navigate("/contact");
    } catch (error) {
      alert("Hubo un error al guardar el contacto.");
    }
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="container">
      <h2 className="my-4">{id ? "Editar" : "Agregar"} Contacto</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <input
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <input
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <button className="btn btn-success" type="submit">
          {id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
};
