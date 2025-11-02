import { useRef } from 'react';
import { Link } from '../../../icons/Link';
import { Textarea } from '../Textarea';
import './styles.css';
import { Image } from '../../../icons/Image';
import { generateRandomId } from '../../../../main/utils/generateRandomId';

type TextareaWithTools = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setValue: (value: string) => void;

  addFile: (fileObj: { name: string; buffer: Uint8Array<ArrayBuffer> }) => void;
};

export const TextareaWithTools = ({
  onChange,
  value,
  setValue,
  addFile,
}: TextareaWithTools) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddFile = async (file: File) => {
    const id = generateRandomId(7);

    const arrayBuffer = await file.arrayBuffer();

    const uint8Array = new Uint8Array(arrayBuffer);

    addFile({ name: id, buffer: uint8Array });

    setValue(`${value}${value !== '' ? '\n' : ''}${`<img>${id}</img>`}`);
  };

  return (
    <div className="textarea_container">
      <div className="textarea_tools">
        <div className="textarea_tool" onClick={linkHandle}>
          <Link />
        </div>
        <div
          className="textarea_tool"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          <Image />

          <input
            ref={fileInputRef}
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const files = event.target.files;
              if (files && files.length > 0) {
                const file = files[0];

                if (!file) return;

                await handleAddFile(file);

                if (fileInputRef.current) {
                  fileInputRef.current.value = ''; // сбрасывает выбранный файл
                }
              }
            }}
          />
        </div>
      </div>
      <Textarea value={value} onChange={onChange} ref={textAreaRef} />
    </div>
  );
};
