import styles from "./Checkbox.module.css";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
}

function Checkbox({ checked, onChange, label, className }: any) {
  const React = Spicetify.React;
  return (
    <div className={`${styles.checkboxContainer} ${className || ""}`}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={styles.checkboxInput}
        />
        <span className={styles.checkmark}></span>
      </label>
    </div>
  );
}

export default Checkbox;
