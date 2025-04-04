import { Button, Stack, TextField } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import ServerError from "@type/ServerError";
import QueriesUrls from "@helpers/QeuriesUrls";
import UnknownUserImage from "@assets/images/UnknownUser.jpg";
import "./style.scss";

const Signin: React.FC = () => {
  const [state, setState] = useState(0);
  const [userImgUrl, setUserImgUrl] = useState(UnknownUserImage);
  const [error, SetError] = useState("");

  const email = useRef("");

  const nextState = useCallback(() => {
    let authE = document.getElementById("authEmail") as HTMLInputElement;
    let authP = document.getElementById("authPassword") as HTMLInputElement;

    SetError("");

    switch (state) {
      case 0:
        if (authE.checkValidity() && authE.value !== "") {
          axios
            .get(QueriesUrls.GET_USERICON, {
              params: {
                email: authE.value,
              },
            })
            .then((ax: AxiosResponse) => {
              setState(1);
              setUserImgUrl(ax.data);
              email.current = authE.value;
              authE.value = "";
            })
            .catch((err: AxiosError) => {
              let data = new ServerError(err.response?.data);
              SetError(data.getFirstError());
            });
        } else SetError("Не верная почта");
        break;
      case 1:
        if (authP.value !== "") {
          axios
            .post(QueriesUrls.SIGNIN, {
              Email: email.current,
              Password: authP.value,
            })
            .then((ax: AxiosResponse) => {
              window.location.assign("/App/Main");
            })
            .catch((err: AxiosError) => {
              let data = new ServerError(err.response?.data);
              SetError(data.getFirstError());
            });
        } else SetError("Не верный пароль");
        break;
    }
  }, [state, setState]);

  return (
    <div className="signin">
      <div className="signin-col">
        <h1 className="signin-h1">Вход</h1>
        <div className="signin-content">
          <Stack className="signin-usericon" direction={"row"} justifyContent={"center"}>
            <div style={{ backgroundImage: `url("${userImgUrl}")` }}></div>
          </Stack>
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
