// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_WqjuhQLIk",
  client_id: "6uaaq3d4tb4oduptof01ju1vgg",
  redirect_uri: "https://main.d2020pxyuhilwo.amplifyapp.com/",
  response_type: "code",
  scope: "email openid phone",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);