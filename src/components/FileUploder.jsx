import { useRef } from "react";
import { Paperclip, X } from "lucide-react";

const FileUploder = ({ selectedFile, onFileSelect, onRemoveFile }) => {
  const fileInputRef = useRef(null);

  // Trigger hidden file input
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect?.(file);
    }
  };

  const handleRemoveFile = () => {
    fileInputRef.current.value = "";
    onRemoveFile?.();
  };

  return (
    <div className="relative flex justify-start items-center group gap-2 w-7">
      {/* Paperclip Icon (acts as upload trigger) */}
      <div onClick={handleIconClick} className="mt-2 p-2 w-8 h-8 bg-gray-700 text-gray-300 rounded-full 
                   hover:bg-blue-600 cursor-pointer flex items-center justify-center 
                   transition-colors duration-300"
      >
        <Paperclip className="w-4 h-4" />
      </div>

      {/* File Name Display */}
      {selectedFile && (
        <div className="flex items-center gap-2 bg-[#2A2D36] px-3 py-1 mt-2 rounded-md border border-gray-600 text-sm text-gray-300">
          <span className="truncate max-w-[150px]">{selectedFile.name}</span>
          <X onClick={handleRemoveFile} size={16} className="text-gray-400 hover:text-red-500 cursor-pointer"/>
        </div>
      )}

      {/* Tooltip */}
      <span
        className="
          absolute bottom-full left-5 transform -translate-x-1/2 mb-2
          px-3 py-1 text-xs text-white whitespace-nowrap
          bg-gray-800 rounded opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none
        "
      >
        Add File
      </span>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden"/>
    </div>
  );
};

export default FileUploder;
