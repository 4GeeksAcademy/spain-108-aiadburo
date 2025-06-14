import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { addContact, getContact, updateContact } from "../services/contacts";

export const AddContact = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

    useEffect(() => {
        if (id) {
            getContact(id).then(setForm).catch(console.error);
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
            navigate("/contact"); // ✅ Redirige correctamente
        } catch (error) {
            console.error("Error al guardar contacto:", error);
            alert("Hubo un error al guardar el contacto.");
        }
    };

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
