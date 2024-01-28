import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./router";
import { Provider } from "react-redux";
import store from "./store";
import "../src/assets/fonts/Font.css";
import "./css/NotifyList.css";
import "./css/Header.css";
import "./css/ChatList.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/reset.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={Router} />
  </Provider>
);
