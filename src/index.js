// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_nZkuL9M2E",
  client_id: "3ngqnactjir2urgdko48aojudi",
  redirect_uri: "https://stage.d2020pxyuhilwo.amplifyapp.com/",
  response_type: "code",
  scope: "phone openid email",
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