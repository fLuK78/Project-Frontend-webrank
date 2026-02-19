import api from "./axios";

export const processPayment = (data) =>
  api.post("/payments", data);

export const getPaymentDetail = (id) =>
  api.get(`/payments/${id}`);
