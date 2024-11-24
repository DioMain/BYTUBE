import PropsBase from "@type/PropsBase";
import "./style.scss";
import { MouseEventHandler } from "react";

interface ButtonProps extends PropsBase {
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;

  onClick?: MouseEventHandler<HTMLDivElement>;

  text: string;

  selected?: boolean;
}

const HeaderDrawerButton: React.FC<ButtonProps> = ({ prefix, postfix, text, style, className, onClick, selected }) => {
  return (
    <div className={`${className} ahbutton0 ${selected ? "ahbutton0-selected" : ""}`} style={style} onClick={onClick}>
      <div className="ahbutton0-start">
        <div className="ahbutton0__prefix">{prefix}</div>
        <div className="ahbutton0__text">{text}</div>
      </div>
      <div className="ahbutton0__postfix">{postfix}</div>
    </div>
  );
};

export default HeaderDrawerButton;
