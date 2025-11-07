import './styles.css';

export const Button = ({
  className,
  ...args
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button className={`active_btn ${className ?? ''}`} {...args}></button>
  );
};
