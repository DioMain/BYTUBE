import PropsBase from "@type/PropsBase";
import "./styles.scss";
import { Stack } from "@mui/material";

const Logo: React.FC<PropsBase> = ({ style, className }) => {
  return (
    <Stack
      justifyContent={"center"}
      onClick={() => window.location.assign("/App/Main")}
      className={`logo ${className}`}
      style={style}
    >
      <h2>
        <span style={{ color: "red" }}>B</span>
        <span style={{ color: "green", marginRight: "4px" }}>Y</span>
        TUBE
      </h2>
    </Stack>
  );
};

export default Logo;
