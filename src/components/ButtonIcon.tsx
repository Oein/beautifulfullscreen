import DisplayIcon from "./DisplayIcon";
import style from "./buttonicon.module.css";

export default function ButtonIcon(props: {
  onClick?: () => void;
  icon: string;
}) {
  const { React } = Spicetify;
  return (
    <button
      onClick={(e) => {
        if (props.onClick) {
          props.onClick();
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      className={style.button}
    >
      <DisplayIcon icon={props.icon} size={20} />
    </button>
  );
}
