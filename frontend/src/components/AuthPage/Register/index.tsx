import React, { useRef, useState } from "react";
import { Input } from "@mui/material";
import axios, { AxiosError } from "axios";
import defaultIcon from "@assets/images/UnknownUser.jpg";
import UploadIcon from "@mui/icons-material/Upload";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ServerError from "@type/ServerError";
import QueriesUrls from "@helpers/QeuriesUrls";
import GetFileUrl from "@helpers/GetFileUrl";
import IsRightImageFormat from "@helpers/IsRightImageFormat";
import styles from "./styled";
import "./style.scss";

const Register: React.FC = () => {
  const [curIcon, setCurIcon] = useState(defaultIcon);
  const [error, setError] = useState("");
  const [date, setDate] = useState<string>("");

  const iconFileRef = useRef<HTMLInputElement | null>(null);

  const handleFileInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setCurIcon(GetFileUrl(evt.target));
  };

  const openFileDialog = () => {
    let fileInput = document.getElementById("registerInputIcon") as HTMLInputElement;
    fileInput.click();
  };

  const registerUser = () => {
    const usernameField = document.getElementById("nicknameField") as HTMLInputElement;
    const emailField = document.getElementById("emailField") as HTMLInputElement;
    const passwordField = document.getElementById("passwordField") as HTMLInputElement;
    const cpasswordField = document.getElementById("cpasswordField") as HTMLInputElement;

    const formData = new FormData();

    formData.append("UserName", usernameField.value);
    formData.append("Email", emailField.value);
    formData.append("Password", passwordField.value);
    formData.append("ConfirmPassword", cpasswordField.value);
    formData.append("BirthDay", date);

    if (iconFileRef.current?.files?.item(0) !== null) {
      if (!IsRightImageFormat(iconFileRef.current)) {
        setError("Фаил имеет не верный формат!");
        return;
      }

      formData.append("ImageFile", iconFileRef.current?.files?.item(0)!);
    }

    axios
      .post(QueriesUrls.REGISTER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        window.location.assign("/Auth/Signin");
      })
      .catch((err: AxiosError) => {
        let data = new ServerError(err.response?.data);

        setError(data.getFirstError());
      });
  };

  return (
    <div className="register">
      <div className="register-col">
        <h1 className="register-h1">Регистрация</h1>
        <div className="register-content">
          <div className="register-icon-upload">
            <div
              className="register-icon-upload-img"
              style={{ backgroundImage: `url(${curIcon})` }}
              onClick={openFileDialog}
            >
              <UploadIcon className="register-icon-upload-icon" sx={{ fontSize: "32px", color: "white" }} />
              <input
                ref={iconFileRef}
                id="registerInputIcon"
                type="file"
                onChange={handleFileInput}
                accept="image/png, image/jpeg"
              />
            </div>
          </div>
          <TextField id="nicknameField" label="Никнейм" />
          <TextField id="emailField" label="Почта" type="email" />
          <TextField id="passwordField" label="Пароль" type="password" />
          <TextField id="cpasswordField" label="Подтвердить пароль" type="password" />
          <styles.DateInput type="date" onChange={(evt) => setDate(evt.target.value)} />
          <Button variant="contained" color="success" onClick={registerUser}>
            Подтвердить
          </Button>
          <a href="/Auth/Signin" className="register-signinlink">
            Вход
          </a>
        </div>
        <div className="register-error">{error}</div>
      </div>
    </div>
  );
};

export default Register;
