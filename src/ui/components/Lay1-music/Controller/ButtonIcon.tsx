import DisplayIcon from "../DisplayIcon";
import style from "./buttonicon.module.css";

interface ButtonIconProps {
  onClick?: () => void;
  icon: string;
}

export default function ButtonIcon({ onClick, icon }: ButtonIconProps) {
  const React = Spicetify.React;
  return (
    <button
      onClick={(e) => {
        onClick?.();
        e.stopPropagation();
        e.preventDefault();
      }}
      className={style.button}
    >
      <DisplayIcon icon={icon} size={20} />
    </button>
  );
}
