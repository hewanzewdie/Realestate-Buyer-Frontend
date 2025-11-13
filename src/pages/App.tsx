import Landing from "./public/landing/Landing";
import {Toaster} from "react-hot-toast"

export default function App() {
  return (
    <div className="w-full">
      <Toaster/>
      <Landing />
    </div>
  );
}