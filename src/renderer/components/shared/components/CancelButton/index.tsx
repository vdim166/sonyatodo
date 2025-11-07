import './styles.css';

export const CancelButton = ({
  className,
  ...args
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button className={`cancel_btn ${className ?? ''}`} {...args}></button>
  );
};
