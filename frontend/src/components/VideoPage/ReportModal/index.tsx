import { Box, Modal, Stack, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import { useRef, useState } from "react";
import "./style.scss";
import { ReportType } from "@type/models/ReportModel";
import axios from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useStores } from "appStoreContext";

interface RM_Props {
  opened: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<RM_Props> = ({ opened, onClose }) => {
  const reportTypes = [
    "Сексуальный контент",
    "Насилие",
    "Шокирующий контент",
    "Издевательство или абьюз",
    "Ложь в важной информации",
    "Насилие над детьми",
    "Терроризм",
    "Спам или ложь",
    "Нарушение закона",
    "Другое",
  ];

  const { video } = useStores();

  const otherField = useRef<HTMLInputElement>(null);

  const [radioValue, setRadioValue] = useState(0);

  const submitHandle = () => {
    let other = "";
    if (otherField.current) {
      other = otherField.current.value;
    }

    let reportType = radioValue > 8 ? ReportType.Other : (radioValue as ReportType);

    axios
      .post(QueriesUrls.REPORT_COMMON, {
        description: other,
        type: reportType,
        videoId: video.value?.id,
      })
      .then(() => onClose());
  };

  return (
    <Modal open={opened} onClose={onClose} className="addtoplaylist">
      <Box
        sx={{
          top: "50%",
          left: "50%",
          position: "absolute",
          backgroundColor: "#404040",
          padding: "12px",
          borderRadius: "8px",
          transform: "translate(-50%, -50%)",
          width: "300px",
        }}
      >
        <Stack spacing={2} className="reportmodal">
          <h3 className="reportmodal-title">Укажите причину жалобы</h3>
          <RadioGroup value={radioValue} onChange={(evt, val) => setRadioValue(Number.parseInt(val))}>
            {reportTypes.map((item, index) => {
              return <FormControlLabel label={item} value={index} key={`rm-rg-i-${index}`} control={<Radio />} />;
            })}
          </RadioGroup>
          {radioValue === reportTypes.length - 1 && (
            <input ref={otherField} type="text" className="reportmodal__other" />
          )}
          <Button variant="contained" color="success" onClick={submitHandle}>
            Подтвердить
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ReportModal;
