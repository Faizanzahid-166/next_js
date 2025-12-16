"use client";
import { useDispatch, useSelector } from "react-redux";
import { respondAdminRequest } from "@/redux/adminSliceTunk/adminResponseSlice";

export default function AdminRequestsPage() {
  const dispatch = useDispatch();
  const { loading, error, result } = useSelector(
    (state) => state.adminRespond
  );

  const handleRespond = (id, accept) => {
    dispatch(respondAdminRequest({ requestId: id, accept }));
  };

  return (
    <div>
      <h1>Admin Requests</h1>

      {loading && <p>Processing...</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => handleRespond("REQUEST_ID", true)}>Accept</button>
      <button onClick={() => handleRespond("REQUEST_ID", false)}>Reject</button>
    </div>
  );
}
