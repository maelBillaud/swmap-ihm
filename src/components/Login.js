import React, { useState } from "react";
import { useForm, isEmail, hasLength } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  PasswordInput,
  Box,
  Alert,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import {
  signupApi,
  loginApi,
  getUserByUsername,
} from "../services/auth/authApi";
import { IconAlertCircle } from "@tabler/icons";

function Login() {
  const navigate = useNavigate();
  const [isConnection, setIsConnection] = useState(false);
  const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false);
  const [showSignupErrorAlert, setShowSignupErrorAlert] = useState(false);
  const [signupMessage, setSignupMessage] = useState(
    "Veuillez saisir un nom d'utilisateur et une adresse mail valide."
  );
  const [showSignupSuccessAlert, setShowSignupSuccessAlert] = useState(false);

  const form = useForm({
    initialValues: {
      userName: "",
      email: "",
      password: "secret",
      confirmPassword: "Secret",
    },

    validate: {
      userName: hasLength(
        { min: 2, max: 20 },
        "Le nom d'utilisateur doit comprendre 2 à 20 caractères"
      ),
      email: isConnection ? true : isEmail("Invalid email"),
      confirmPassword: isConnection
        ? true
        : (value, values) =>
            value !== values.password
              ? "Les mots de passe ne correspondent pas"
              : null,
    },
  });

  /**
   * Fonction de création d'un compte utilisateur
   * @param {*} values valeurs remplies dans le formulaire
   */
  async function accountCreation(values) {
    const userData = {
      username: values.userName,
      email: values.email,
      password: values.password,
      role: ["ROLE_USER"],
    };
    //On va utiliser data pour afficher à l'utilisateur le statut de l'opération
    let res;

    try {
      res = await signupApi(userData);
      setIsConnection(true);
    } catch (e) {
      let status = e.response.status;
      setSignupMessage(e.response.data.message);

      if (status === 400) {
        setShowSignupErrorAlert(true);
      }
    }
    setSignupMessage(res.data.message);
    setShowSignupSuccessAlert(true);
  }

  /**
   * Fonction de connexion à un compte utilisateur
   * @param {*} values valeurs remplies dans le formulaire
   */
  async function accountLogin(values) {
    const userData = {
      username: values.userName,
      password: values.password,
    };

    let res;

    try {
      res = await loginApi(userData);
    } catch (e) {
      let status = e.response.data.status;
      if (status === 401) {
        setShowLoginErrorAlert(true);
      }
    }

    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("role", res.data.roles);

    res = await getUserByUsername(userData.username, res.data.token);
    sessionStorage.setItem("userInfo", JSON.stringify(res.data));

    navigate("/", { replace: true });
  }

  return (
    <div className="login-container">
      {showLoginErrorAlert && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Identifiants erronés"
          color="red"
          withCloseButton
          variant="filled"
          onClose={() => setShowLoginErrorAlert(false)}
          className="alert"
        >
          Veuillez saisir un nom d'utilisateur et un mot de passe valide.
        </Alert>
      )}

      {showSignupErrorAlert && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Identifiants erronés"
          color="red"
          withCloseButton
          variant="filled"
          onClose={() => setShowSignupErrorAlert(false)}
          className="alert"
        >
          {signupMessage}
        </Alert>
      )}

      {showSignupSuccessAlert && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Inscription réussie"
          color="lime"
          withCloseButton
          variant="filled"
          onClose={() => setShowSignupSuccessAlert(false)}
          className="alert"
        >
          {signupMessage}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={form.onSubmit((values) => {
          if (isConnection) {
            accountLogin(values);
          } else {
            accountCreation(values);
          }
        })}
        className="login-box"
      >
        <div className="login-type-button">
          <Button
            color="gray"
            variant={!isConnection ? "default" : "light"}
            onClick={() => setIsConnection(false)}
          >
            Créer un compte
          </Button>
          <Button
            color="gray"
            variant={isConnection ? "default" : "light"}
            onClick={() => setIsConnection(true)}
          >
            S'identifier
          </Button>
        </div>

        <TextInput
          label="Nom d'utilisateur"
          placeholder="Nom d'utilisateur"
          className="login-input"
          withAsterisk
          {...form.getInputProps("userName")}
        />
        {!isConnection && (
          <TextInput
            label="email"
            placeholder="email"
            className="login-input"
            withAsterisk
            disabled={isConnection}
            {...form.getInputProps("email")}
          />
        )}
        <PasswordInput
          label="Mot de passe"
          placeholder="Mot de passe"
          className="login-input"
          withAsterisk
          {...form.getInputProps("password")}
        />

        {!isConnection && (
          <PasswordInput
            mt="sm"
            label="Confirmer le mot de passe"
            placeholder="Confirmer le mot de passe"
            className="login-input"
            withAsterisk
            disabled={isConnection}
            {...form.getInputProps("confirmPassword")}
          />
        )}

        <Group position="right" mt="md">
          <Button type="submit">
            {isConnection ? "Se connecter" : "S'enregistrer"}
          </Button>
        </Group>
      </Box>
    </div>
  );
}

export default Login;
