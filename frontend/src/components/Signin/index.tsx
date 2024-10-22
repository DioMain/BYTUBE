import { Button, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import "./style.scss";

const Signin: React.FC = () => {
  const [state, setState] = useState(0);
  const [userImgUrl, setUserImgUrl] = useState("/users/template/icon.png");
  const [loading, setLoading] = useState(false);
  const [error, SetError] = useState("");

  const nextState = useCallback(() => {
    let authE = document.getElementById("authEmail") as HTMLInputElement;
    let authP = document.getElementById("authPassword") as HTMLInputElement;

    SetError("");

    switch (state) {
      case 0:
        if (authE.checkValidity() && authE.value !== "") {
          authE.value = "";
          setState(1);
          setUserImgUrl("/users/0/icon.png");
        } else SetError("Не верная почта!");
        break;
      case 1:
        break;
    }
  }, [state, setState]);

  return (
    <div className="signin">
      <div className="signin-col">
        <h1 className="signin-h1">Вход</h1>
        <div className="signin-content">
          <div className="signin-usericon">
            <img src={userImgUrl} />
          </div>
          {state === 0 ? (
            <TextField id="authEmail" label="Почта" type="email" />
          ) : (
            <TextField id="authPassword" label="Пароль" type="password" />
          )}
          <Button variant="contained" color="success" className="signin-button" onClick={nextState}>
            Продолжить
          </Button>
          <a href="/Auth/Register" className="signin-reglink">
            Регистрация
          </a>
        </div>
        <div className="signin-error">{error}</div>
      </div>
    </div>
  );
};

export default Signin;
