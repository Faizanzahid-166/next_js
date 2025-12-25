import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socketService from "@/services/socketService";
import { addSocketMessage } from "@/redux/uiSliceTunk/messageSlice";

export default function useInitSocketListeners() {
  const dispatch = useDispatch();

  useEffect(() => {
    socketService.on("newMessage", (message) => {
      dispatch(addSocketMessage(message));
    });

    return () => {
      socketService.off("newMessage");
    };
  }, []);
}
