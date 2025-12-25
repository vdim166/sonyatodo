import { useRef } from 'react';
import './styles.css';
import { generateRandomId } from '../../../../../main/utils/generateRandomId';
import { Link } from '../../../../icons/Link';
import { Textarea } from '../Textarea';
import { Image } from '../../../../icons/Image';
import { Video } from '../../../../icons/Video';
import { FILE_TYPES } from '../../../EditTodoModal';
import { FileIcon } from '../../../../icons/FileIcon';

type TextareaWithTools = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setValue: (value: string) => void;

  addFile: (
    fileObj: { name: string; buffer: Uint8Array<ArrayBuffer> },
    type: keyof typeof FILE_TYPES,
  ) => void;
};

export const TextareaWithTools = ({
  onChange,
  value,
  setValue,
  addFile,
}: TextareaWithTools) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageFile = async (file: File) => {
    const id = generateRandomId(7);

    const arrayBuffer = await file.arrayBuffer();

    const uint8Array = new Uint8Array(arrayBuffer);

    addFile({ name: id, buffer: uint8Array }, FILE_TYPES.IMAGE);

    setValue(`${value}${value !== '' ? '\n' : ''}${`<img>${id}</img>`}`);
  };

  const handleVideoFile = async (file: File) => {
    const id = generateRandomId(7);

    const arrayBuffer = await file.arrayBuffer();

    const uint8Array = new Uint8Array(arrayBuffer);

    addFile({ name: id, buffer: uint8Array }, FILE_TYPES.VIDEO);

    setValue(`${value}${value !== '' ? '\n' : ''}${`<video>${id}</video>`}`);
  };

  const handleFile = async (file: File) => {
    const id = generateRandomId(7);

    let ext = 'txt';

    const splitted = file.name.split('.');
    if (splitted.length > 1) {
      ext = splitted[splitted.length - 1];
    }

    const arrayBuffer = await file.arrayBuffer();

    const uint8Array = new Uint8Array(arrayBuffer);

    addFile({ name: `${id}.${ext}`, buffer: uint8Array }, FILE_TYPES.FILE);

    setValue(
      `${value}${value !== '' ? '\n' : ''}${`<file>${`${id}.${ext}`}</file>`}`,
    );
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
            imageInputRef.current?.click();
          }}
        >
          <Image />

          <input
            ref={imageInputRef}
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const files = event.target.files;
              if (files && files.length > 0) {
                const file = files[0];

                if (!file) return;

                await handleImageFile(file);

                if (imageInputRef.current) {
                  imageInputRef.current.value = ''; // сбрасывает выбранный файл
                }
              }
            }}
          />
        </div>
        <div
          className="textarea_tool"
          onClick={() => {
            videoInputRef.current?.click();
          }}
        >
          <Video />

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            aria-label="Video file input"
            onChange={async (event) => {
              const files = event.target.files;
              if (files && files.length > 0) {
                const file = files[0];

                if (!file) return;

                await handleVideoFile(file);

                if (videoInputRef.current) {
                  videoInputRef.current.value = ''; // сбрасывает выбранный файл
                }
              }
            }}
          />
        </div>
        <div
          className="textarea_tool"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          <FileIcon />

          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={async (event) => {
              const files = event.target.files;
              if (files && files.length > 0) {
                const file = files[0];

                if (!file) return;

                await handleFile(file);

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
