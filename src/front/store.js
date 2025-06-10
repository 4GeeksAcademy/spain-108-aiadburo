export const initialStore = () => ({
    contacts: [],
    message: null
});

export default function storeReducer(state, action) {
    switch (action.type) {
        case "set_contacts":
            return {
                ...state,
                contacts: Array.isArray(action.payload) ? action.payload : []
            };

        case "add_contact":
            return {
                ...state,
                contacts: [...state.contacts, action.payload]
            };

        case "update_contact":
            return {
                ...state,
                contacts: state.contacts.map(contact =>
                    contact.id === action.payload.id ? action.payload : contact
                )
            };

        case "delete_contact":
            return {
                ...state,
                contacts: state.contacts.filter(contact => contact.id !== action.payload)
            };

        case "set_hello":
            return {
                ...state,
                message: action.payload
            };

        default:
            throw new Error("Unknown action.");
    }
}
