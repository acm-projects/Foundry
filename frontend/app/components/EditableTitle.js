"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '@/globalStates/projectName';

export default function EditableTitle() {
  const { projectName, setProjectName } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(projectName);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(projectName);
  }, [projectName]);

  const handleSave = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && trimmedValue !== projectName) {
      setProjectName(trimmedValue);
      
      // 2. TODO: call backend api to save change
      console.log(`Title saved to global state and should be saved to backend: ${trimmedValue}`);
    } else {
      setInputValue(projectName);
    }
    setIsEditing(false);
  }, [inputValue, projectName, setProjectName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        className="text-2xl font-semibold p-1 border-b-2 border-orange-500 bg-transparent outline-none w-48 min-w-[120px]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave} 
        onKeyDown={handleKeyDown}
        maxLength={20}
      />
    );
  }

  return (
    <h1
      className="text-2xl font-semibold cursor-pointer p-1 rounded hover:bg-gray-200 transition-colors truncate max-w-xs"
      onClick={() => setIsEditing(true)}
      title="Click to rename"
    >
      {projectName || "untitled"}
    </h1>
  );
}