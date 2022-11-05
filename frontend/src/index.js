import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
import ErrorPage from "./error-page";
import Login from "./Login";
import MainPage from "./MainPage";
import store from './slices/store.js';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserContext from "./userContext";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
        errorElement: <ErrorPage/>
    },
    {
        path: "/login",
        element: <Login/>
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
