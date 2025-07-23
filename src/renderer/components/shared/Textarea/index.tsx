import './styles.css';

export const Textarea = ({
  className,
  ...args
}: React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>) => {
  return (
    <textarea className={`active_textarea ${className ?? ''}`} {...args} />
  );
};
