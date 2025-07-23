import './styles.css';

type UniversalWrapperProps = {
  children: React.ReactNode;
};

export const UniversalWrapper = ({ children }: UniversalWrapperProps) => {
  return (
    <div className="universal_wrapper">
      <div className="universal_wrapper_window">{children}</div>
    </div>
  );
};
