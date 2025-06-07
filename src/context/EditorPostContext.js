// context/EditorPostContext.js
'use client';

import { createContext, useContext, useState } from 'react';

const EditorPostContext = createContext();

export const EditorPostProvider = ({ children }) => {
  const [quotedPost, setQuotedPost] = useState(null);
  const [editablePost, setEditablePost] = useState(null);

  const clearEditorState = () => {
    setQuotedPost(null);
    setEditablePost(null);
  };

  return (
    <EditorPostContext.Provider
      value={{ quotedPost, setQuotedPost, editablePost, setEditablePost, clearEditorState }}
    >
      {children}
    </EditorPostContext.Provider>
  );
};

export const useEditorPost = () => useContext(EditorPostContext);