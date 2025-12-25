import { useSelector } from "react-redux";

export default function DebugProducts() {
  const productsState = useSelector((state) => state.products);

  console.log("Redux Products State:", productsState);

  return null; // Just for debugging
}
