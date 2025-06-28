import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addContact, getContact, updateContact } from "../services/contacts";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AddContact = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { store, dispatch } = useGlobalReducer();

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
      const contact = store.contacts.find(c => String(c.id) === id);
      if (contact) {
        setForm({
          name: contact.name || "",
          email: contact.email || "",
          phone: contact.phone || "",
          address: contact.address || "",
        });
        setLoading(false);
      } else {
        getContact(id)
          .then((contact) => {
            setForm({
              name: contact.name || "",
              email: contact.email || "",
              phone: contact.phone || "",
              address: contact.address || "",
            });
            setLoading(false);
          })
          .catch(() => {
            setError("Contacto no encontrado");
            setLoading(false);
          });
      }
    }
  }, [id, store.contacts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        const updated = await updateContact(id, form);
        dispatch({ type: "update_contact", payload: updated });
      } else {
        const added = await addContact({ ...form, agenda_slug: "aiadburo" });
        dispatch({ type: "add_contact", payload: added });
      }
      navigate("/contact");
    } catch {
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
