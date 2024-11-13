import PropsBase from "@type/PropsBase";
import { Stack } from "@mui/material";
import { ReactNode, useCallback } from "react";
import "./style.scss";

interface B0Props extends PropsBase {
  text?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

const Button0: React.FC<B0Props> = ({ onClick, className, icon, text }) => {
  const onClickHandler = useCallback(() => {
    if (onClick !== undefined) onClick();
  }, [onClick]);

  return (
    <Stack className={`button0 ${className}`} onClick={onClickHandler}>
      <Stack direction={"row"} spacing={1} justifyContent={"space-between"}>
        <Stack justifyContent={"center"}>{text}</Stack>
        {icon}
      </Stack>
    </Stack>
  );
};

export default Button0;
