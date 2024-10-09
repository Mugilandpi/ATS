import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Bounce, ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />
  </>,
  // </React.StrictMode>,
);
