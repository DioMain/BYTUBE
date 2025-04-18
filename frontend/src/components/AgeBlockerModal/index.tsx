import { Button, Modal, Stack } from "@mui/material";
import styles from "./styled";
import { BoxStyled } from "@styles/Common";
import AgeBanned from "@mui/icons-material/ReportGmailerrorred";

interface AgeBlockerModal {
  isOpen: boolean;
  onClose: () => void;
}

const AgeBlockerModal: React.FC<AgeBlockerModal> = ({ isOpen, onClose }) => {
  const returnClickHandle = () => {
    window.location.assign("/App/Main");
  };

  return (
    <Modal onClose={undefined} open={isOpen} disableAutoFocus>
      <BoxStyled sx={{ width: "600px" }}>
        <Stack spacing={2}>
          <styles.title>Данное видео не преднозначено для лиц не достигших 18 лет!</styles.title>
          <Stack justifyContent={"center"} direction={"row"}>
            <AgeBanned sx={{ fontSize: "168px" }} />
          </Stack>
          <Stack direction={"row"} spacing={1} justifyContent={"end"}>
            <Button color={"success"} type="button" variant="contained" onClick={returnClickHandle}>
              Вернуться
            </Button>
            <Button color={"warning"} type="button" variant="contained" onClick={onClose}>
              Продолжить
            </Button>
          </Stack>
        </Stack>
      </BoxStyled>
    </Modal>
  );
};

export default AgeBlockerModal;
