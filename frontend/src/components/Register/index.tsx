import React, { useState } from "react";
import defaultIcon from "@assets/images/UnknownUser.jpg";
import UploadIcon from "@mui/icons-material/Upload";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./style.scss";

const Register: React.FC = () => {
  const [curIcon, setCurIcon] = useState(defaultIcon);
  const [curIconFile, setIconFile] = useState<null | File | undefined>(undefined);
  const [error, setError] = useState("");

  const handleFileInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setCurIcon(URL.createObjectURL(evt.target.files?.item(0) as Blob));
    setIconFile(evt.target.files?.item(0));
  };

  const openFileDialog = () => {
    let fileInput = document.getElementById("registerInputIcon") as HTMLInputElement;
    fileInput.click();
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
              <UploadIcon className="register-icon-upload-icon" sx={{ fontSize: "32px" }} />
              <input id="registerInputIcon" type="file" onChange={handleFileInput} accept=".png" />
            </div>
          </div>
          <TextField id="nicknameField" label="Никнейм" />
          <TextField id="emailField" label="Почта" type="email" />
          <TextField id="passwordField" label="Пароль" type="password" />
          <TextField id="cpasswordField" label="Подтвердить пароль" type="password" />
          <Button variant="contained" color="success">
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