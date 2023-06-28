import axios from 'axios';

// const usersUrl = 'http://localhost:3003/users';
const meetingUrl = 'http://localhost:3000';

export const getMeeting = async (id) => {
    id = id || '';
    return await axios.get(`${meetingUrl}/${id}`);
}

export const addMeeting = async (meeting) => {
    return await axios.post(`${meetingUrl}/addMeeting`, meeting);
}

export const deleteMeeting = async (id) => {
    return await axios.delete(`${meetingUrl}/${id}`);
}

export const updateMeeting = async (id, meeting) => {
    return await axios.put(`${meetingUrl}/${id}`, meeting)
}