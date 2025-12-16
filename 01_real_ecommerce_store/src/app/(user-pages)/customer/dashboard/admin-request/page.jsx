"use client";
import { useDispatch, useSelector } from "react-redux";
import { sendAdminRequest } from "@/redux/adminSliceTunk/adminRequestSlice";

export default function AdminRequestPage() {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector(
    (state) => state.adminRequest
  );

  return (
    <div>
      <h1>Become Admin</h1>

      {loading && <p>Sending...</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => dispatch(sendAdminRequest())}>
        Send Request
      </button>
    </div>
  );
}
