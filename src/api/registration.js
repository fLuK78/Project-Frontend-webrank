import api from "./axios";

export const registerCompetition = (data) =>
  api.post("/registrations", data);

export const getMyHistory = (playerId) =>
  api.get(`/players/${playerId}/history`);

export const cancelRegistration = (id) =>
  api.put(`/registrations/${id}/cancel`);

export const approveRegistration = (id) =>
  api.put(`/registrations/${id}/approve`);

export const rejectRegistration = (id) =>
  api.put(`/registrations/${id}/reject`);
