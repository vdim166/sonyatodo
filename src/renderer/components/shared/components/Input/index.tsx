import './styles.css';

export const Input = ({
  className,
  ...args
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return <input className={`active_input ${className ?? ''}`} {...args} />;
};
