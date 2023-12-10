import axios from "axios";
import backendUrl from "../../config";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: `${backendUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});

const getMessagesByTicket = async (ticketId) => {
    try {
        const response = await api.get(`/messages/${ticketId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error fetching messages");
    }
};

const sendMessage = async (message) => {
    try {
        const response = await api.post("/messages/send", message, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error sending message");
    }
};

const MessagesAPI = {
    getMessagesByTicket,
    sendMessage,
};

export default MessagesAPI;
