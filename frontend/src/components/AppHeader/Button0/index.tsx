import PropsBase from "@type/PropsBase";
import "./style.scss";

interface ButtonProps extends PropsBase {
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;

  text: string;
}

const Button0: React.FC<ButtonProps> = ({ prefix, postfix, text, style, className }) => {
  return (
    <div className={`${className} button0`} style={style}>
      <div className="button0-start">
        <div className="button0__prefix">{prefix}</div>
        <div className="button0__text">{text}</div>
      </div>
      <div className="button0__postfix">{postfix}</div>
    </div>
  );
};

export default Button0;
