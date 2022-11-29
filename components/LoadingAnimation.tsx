interface LoadingAnimationProps {
  opposite?:boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({opposite=false}) => {
  return <div className={"buttonLoadingAnimation" + (opposite ? " opposite" : "")}>
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </div>
}

export default LoadingAnimation;