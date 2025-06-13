import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDeSoApi } from '@/api/useDeSoApi';
import { queryKeys } from '@/queries';
import { useFloating, offset, flip, shift, size as applySize, autoUpdate } from "@floating-ui/react";
import { useClickOutside } from "@/hooks/useClickOutside";

// Helper function to get cursor position in pixels
const getCursorCoordinates = (textarea, cursorPosition) => {
  const mirror = document.createElement('div');
  const computedStyle = window.getComputedStyle(textarea);
  
  // Copy textarea styles to mirror
  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';
  mirror.style.width = textarea.offsetWidth + 'px';
  mirror.style.font = computedStyle.font;
  mirror.style.padding = computedStyle.padding;
  mirror.style.border = computedStyle.border;
  mirror.style.lineHeight = computedStyle.lineHeight;
  mirror.style.letterSpacing = computedStyle.letterSpacing;
  
  document.body.appendChild(mirror);
  
  // Get text up to cursor position
  const textBeforeCursor = textarea.value.substring(0, cursorPosition);
  mirror.textContent = textBeforeCursor;
  
  // Create a span for the cursor position
  const cursorSpan = document.createElement('span');
  cursorSpan.textContent = '|';
  mirror.appendChild(cursorSpan);
  
  const coordinates = {
    top: cursorSpan.offsetTop,
    left: cursorSpan.offsetLeft,
  };
  
  document.body.removeChild(mirror);
  return coordinates;
};

export const useMentions = (textareaRef) => {
  const [mentionState, setMentionState] = useState({
    isOpen: false,
    query: '',
    startIndex: -1,
    endIndex: -1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Current mention state ref for virtual element (to avoid stale closure)
  const currentMentionStateRef = useRef(mentionState);  

  // Update ref whenever mentionState changes
  useEffect(() => {
    currentMentionStateRef.current = mentionState;
  }, [mentionState]);
  
  // Stable virtual element for @ symbol position
  const virtualAtElementRef = useRef({
    getBoundingClientRect: () => {
      const currentState = currentMentionStateRef.current;
      
      // Calculate coordinates in real-time during each call
      if (!textareaRef.current || !currentState.isOpen || currentState.startIndex === -1) {
        console.log('Virtual element: returning zeros', { 
          hasTextarea: !!textareaRef.current, 
          isOpen: currentState.isOpen, 
          startIndex: currentState.startIndex 
        });
        return {
          width: 0, height: 0, x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0,
        };
      }

      const textarea = textareaRef.current;
      const textareaRect = textarea.getBoundingClientRect();
      const atSymbolCoords = getCursorCoordinates(textarea, currentState.startIndex);
      
      const result = {
        width: 0,
        height: 20,
        x: textareaRect.left + atSymbolCoords.left,
        y: textareaRect.top + atSymbolCoords.top,
        top: textareaRect.top + atSymbolCoords.top,
        left: textareaRect.left + atSymbolCoords.left,
        right: textareaRect.left + atSymbolCoords.left,
        bottom: textareaRect.top + atSymbolCoords.top + 20,
      };
      
      return result;
    },
  });
  
  const { getProfiles } = useDeSoApi();

  // Close mentions
  const closeMentions = useCallback(() => {
    setMentionState({
      isOpen: false,
      query: '',
      startIndex: -1,
      endIndex: -1,
    });
  }, []);

  // Floating UI for positioning dropdown
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(({ rects, middlewareData, placement }) => {
        
        if (!textareaRef.current || !mentionState.isOpen || mentionState.startIndex === -1) {
          return 4; // Default offset
        }

        const textarea = textareaRef.current;
        const textareaRect = textarea.getBoundingClientRect();
        const atSymbolCoords = getCursorCoordinates(textarea, mentionState.startIndex);
        
        // Calculate where cursor is (document coordinates)
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const cursorX = textareaRect.left + atSymbolCoords.left + scrollLeft;
        const cursorY = textareaRect.top + atSymbolCoords.top + scrollTop;
        
        // Where we want dropdown (20px below cursor)
        const targetX = cursorX;
        const targetY = cursorY + 20;
        
        // Where virtual element is (viewport coordinates)
        const virtualX = textareaRect.left + atSymbolCoords.left;
        const virtualY = textareaRect.top + atSymbolCoords.top;
        
        // Calculate offset needed
        const offsetX = targetX - virtualX; // This is essentially scrollLeft
        const offsetY = targetY - virtualY; // This is essentially scrollTop + 20
        
        return {
          mainAxis: offsetY, // Y offset
          crossAxis: offsetX, // X offset
        };
      }),     
      flip({
        mainAxis: true, // flip vertically
        padding: 8,     // flip before reaching edge (tweak as needed)
    }),
      shift(),
        applySize({
            apply: ({ elements }) => {
                Object.assign(elements.floating.style, {
                    maxHeight: `200px`,
                    minWidth: '250px',
                    overflowY: 'auto',
                });
            },
        }),    
    ],
    whileElementsMounted: autoUpdate,
  });

  // Close mentions when clicking outside
  useClickOutside([refs.floating], () => {
    if (mentionState.isOpen) {
        closeMentions();
    }
  });

  // Debounce mention query
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedQuery(mentionState.query);
    }, 300);
    return () => clearTimeout(delay);
  }, [mentionState.query]);

  // Search for profiles by username
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: queryKeys.searchProfilesByUsernamePrefix(debouncedQuery),
    queryFn: async () => {
      const response = await getProfiles({ 
        UsernamePrefix: debouncedQuery,
        AddGlobalFeedBoolean: false,
        FetchUsersThatHODL: false,
        NumToFetch: 8
      });
      if (!response.success) throw new Error(response.error);
      return response.data?.ProfilesFound || [];
    },
    enabled: !!debouncedQuery && mentionState.isOpen,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Reset selected index when profiles change
  useEffect(() => {
    setSelectedIndex(0);
  }, [profiles]);

  // Parse text to find mention
  const parseMention = useCallback((text, cursorPosition) => {
    const beforeCursor = text.slice(0, cursorPosition);
    const mentionMatch = beforeCursor.match(/@([a-zA-Z0-9_]*)$/);
    
    if (mentionMatch) {
      const startIndex = beforeCursor.lastIndexOf('@');
      return {
        isOpen: true,
        query: mentionMatch[1],
        startIndex,
        endIndex: cursorPosition,
      };
    }
    
    return {
      isOpen: false,
      query: '',
      startIndex: -1,
      endIndex: -1,
    };
  }, []);

  // Handle text change and cursor position
  const handleTextChange = useCallback((text, cursorPosition) => {
    const newMentionState = parseMention(text, cursorPosition);
    setMentionState(newMentionState);
    
    // Set virtual element reference when mentions are active
    if (newMentionState.isOpen) {
      refs.setReference(virtualAtElementRef.current);
    }
  }, [parseMention, refs]);

  // Insert selected mention
  const insertMention = useCallback((profile, currentText, onTextChange) => {
    if (!profile || mentionState.startIndex === -1) return;

    const beforeMention = currentText.slice(0, mentionState.startIndex);
    const afterMention = currentText.slice(mentionState.endIndex);
    const newText = `${beforeMention}@${profile.Username} ${afterMention}`;
    
    onTextChange(newText);
    
    // Close mention dropdown
    closeMentions();

    // Focus textarea and set cursor position after mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeMention.length + profile.Username.length + 2; // +2 for @ and space
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [mentionState, textareaRef, closeMentions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event, currentText, onTextChange) => {
    if (!mentionState.isOpen || profiles.length === 0) return false;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, profiles.length - 1));
        return true;
        
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        return true;
        
      case 'Enter':
      case 'Tab':
        event.preventDefault();
        if (profiles[selectedIndex]) {
          insertMention(profiles[selectedIndex], currentText, onTextChange);
        }
        return true;
        
      case 'Escape':
        event.preventDefault();
        closeMentions();
        return true;
        
      default:
        return false;
    }
  }, [mentionState.isOpen, profiles, selectedIndex, insertMention, closeMentions]);

  return {
    mentionState,
    profiles,
    isLoading,
    selectedIndex,
    setSelectedIndex,
    handleTextChange,
    handleKeyDown,
    insertMention,
    closeMentions,
    floatingStyles,
    refs,
  };
};