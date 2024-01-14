import { useState, useRef } from "react";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";

type EditorProps = {
  currentFile: any;
  setCurrentFile: (file: any) => void;
  files: any[];
  workingDirectory: string;
  isEditorOpen: boolean;
  setIsEditorOpen: (isOpen: boolean) => void;
};

export default function Editor({
  currentFile,
  setCurrentFile,
  files,
  workingDirectory,
  isEditorOpen,
  setIsEditorOpen,
}: EditorProps) {
  const [fileContent, setFileContent] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  if (
    currentFile !== null &&
    currentFile.path !== undefined &&
    currentFile.path !== null &&
    currentFile.path !== "" &&
    currentFile.path !== fileContent &&
    currentFile.children === undefined
  ) {
    readTextFile(currentFile.path)
      .then((content) => {
        setFileContent(content);
      })
      .catch((err) => console.error(err));
  }

  const saveFile = () => {
    writeTextFile(currentFile.path, fileContent)
      .then(() => {
        console.log("File saved");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex w-full h-full bg-primaryBg text-secondaryText ">
      {isEditorOpen ? (
        <div className="flex flex-col w-full h-full">
          <div className="px-4 py-1 font-medium bg-secondaryBg">
            {currentFile.path}
          </div>
          <textarea
            ref={textAreaRef}
            className="w-full h-full resize bg-primaryBg text-secondaryText p-4 font-code outline-none"
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      ) : (
        <div className="">Closed</div>
      )}
    </div>
  );
}