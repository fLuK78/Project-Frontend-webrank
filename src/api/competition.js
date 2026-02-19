import api from "./axios";

export const getCompetitions = () => api.get("/competitions");
export const getCompetitionById = (id) => api.get(`/competitions/${id}`);
export const getSlots = (id) => api.get(`/competitions/${id}/slots`);
export const joinCompetition = (competitionId) =>
  api.post("/registrations", { competitionId });

export const getMyHistory = (playerId) =>
  api.get(`/players/${playerId}/history`);
