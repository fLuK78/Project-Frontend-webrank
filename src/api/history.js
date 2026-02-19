import api from "./axios";

export const fetchHistory = (playerId) => {
  return api.get(`/players/${playerId}/history`);
};

export const cancelHistory = (historyId) => {
  return api.delete(`/history/${historyId}`);
};
