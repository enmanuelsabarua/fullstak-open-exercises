import axios from "axios";
const baseUrl = '/api/blogs';

const getAll = async () => {
    const response = await axios.get(`${baseUrl}/comments`);
    return response.data;
}

const create = async (newComment) => {
    const response = await axios.post(`${baseUrl}/${newComment[0]}/comments`, newComment[1]);
    return response.data;
}

export default { getAll, create }