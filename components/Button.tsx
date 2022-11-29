import type { MouseEventHandler } from "react";

interface Props {
  loading?:boolean;
  secondary?:boolean;
  type?:"submit"|"button";
  children: React.ReactNode;
  onClick?:MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<Props> = ({ loading=false, secondary=false, type="button", children, onClick }) => {
  return <button disabled={loading} type={type} onClick={onClick} className={secondary ? "button-secondary" : "button-primary"}>
    {loading ? <LoadingAnimation /> : children}
  </button>
};

const LoadingAnimation: React.FC = () => {
  return <div className="buttonLoadingAnimation">
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </div>
};

export default Button;