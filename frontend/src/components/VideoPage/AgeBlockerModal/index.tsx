import { Button, Modal, Stack } from "@mui/material";
import styles from "./styled";
import { BoxStyled } from "@styles/Common";
import AgeBanned from "@mui/icons-material/ReportGmailerrorred";

interface AgeBlockerModal {
  isOpen: boolean;
}

const AgeBlockerModal: React.FC<AgeBlockerModal> = ({ isOpen }) => {
  const returnClickHandle = () => {
    window.location.assign("/App/Main");
  };

  return (
    <Modal onClose={undefined} open={isOpen} disableAutoFocus>
      <BoxStyled sx={{ width: "600px" }}>
        <Stack spacing={2}>
          <styles.title>Данное видео не доступно по возрастному ограничению!</styles.title>
          <Stack justifyContent={"center"} direction={"row"}>
            <AgeBanned sx={{ fontSize: "168px" }} />
          </Stack>
          <Button color={"primary"} type="button" variant="contained" onClick={returnClickHandle}>
            Вернуться на главную страницу
          </Button>
        </Stack>
      </BoxStyled>
    </Modal>
  );
};

export default AgeBlockerModal;
