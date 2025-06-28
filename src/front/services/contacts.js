const API_BASE = "https://playground.4geeks.com/contact";
const AGENDA_SLUG = "aiadburo";

export const createAgendaIfNotExists = async () => {
  try {
    const testRes = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}`);
    if (testRes.status === 404) {
      const createRes = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!createRes.ok) throw new Error("Failed to create agenda");
      return await createRes.json();
    }
    return await testRes.json();
  } catch (error) {
    throw error;
  }
};

export const fetchContacts = async () => {
  await createAgendaIfNotExists();
  const res = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts`);
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return await res.json();
};

export const addContact = async (contact) => {
  const res = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add contact");
  }
  return await res.json();
};

export const updateContact = async (id, contact) => {
  const res = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  if (!res.ok) throw new Error("Failed to update contact");
  return await res.json();
};

export const deleteContact = async (id) => {
  const res = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete contact");
  return res.ok;
};

export const getContact = async (id) => {
  const res = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch contact");
  return await res.json();
};