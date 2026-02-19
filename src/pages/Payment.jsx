import { useParams } from "react-router-dom";
import { processPayment } from "../api/payment";

export default function Payment() {
  const { registrationId } = useParams();

  const handlePay = () => {
    processPayment({
      registrationId,
      amount: 500,
      method: "promptpay"
    }).then(() => alert("ชำระเงินสำเร็จ"));
  };

  return (
    <div className="p-6">
      <button
        onClick={handlePay}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        ชำระเงิน
      </button>
    </div>
  );
}
