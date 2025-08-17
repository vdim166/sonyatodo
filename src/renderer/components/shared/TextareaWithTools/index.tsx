import { useRef } from 'react';
import { Link } from '../../../icons/Link';
import { Textarea } from '../Textarea';
import './styles.css';

type TextareaWithTools = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setValue: (value: string) => void;
};

export const TextareaWithTools = ({
  onChange,
  value,
  setValue,
}: TextareaWithTools) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  function hasSelection() {
    if (!textAreaRef || !textAreaRef.current) return false;

    return (
      textAreaRef.current.selectionStart !== textAreaRef.current.selectionEnd
    );
  }

  function getSelectionRange() {
    if (!textAreaRef || !textAreaRef.current) return null;

    const textarea = textAreaRef.current;
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      text: textarea.value.substring(
        textarea.selectionStart,
        textarea.selectionEnd,
      ),
    };
  }

  const linkHandle = () => {
    if (hasSelection()) {
      const selection = getSelectionRange();

      if (!selection) return;

      let result = '';

      if (selection.start === selection.end - 1) {
        for (let i = 0; i < value.length; ++i) {
          if (selection.start === i) {
            result += `<a>${value[i]}</a>`;
          } else {
            result += value[i];
          }
        }
      } else {
        for (let i = 0; i < value.length; ++i) {
          if (selection.start === i) {
            result += `<a>${value[i]}`;
          } else if (selection.end - 1 === i) {
            result += `${value[i]}</a>`;
          } else {
            result += value[i];
          }
        }
      }

      setValue(result);
    }
  };

  return (
    <div className="textarea_container">
      <div className="textarea_tools">
        <div className="textarea_tool_link" onClick={linkHandle}>
          <Link />
        </div>
      </div>
      <Textarea value={value} onChange={onChange} ref={textAreaRef} />
    </div>
  );
};
