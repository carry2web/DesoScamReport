import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const formatMentionsAndCoins = (text) => {
  if (!text) return '';

  return text
    // @username → [@username](/username)
    .replace(/(^|\s)@([a-zA-Z0-9_]{1,30})(?![.\w])/g, '$1[@$2](/$2)')
    // $COIN → [$COIN](/COIN)
    .replace(/(^|\s)\$([a-zA-Z0-9_]{1,30})(?![.\w])/g, '$1[$$$2](/$2)');
};

export const MarkdownText = ({ text }) => {

  const normalized = text
    // Step 1: removes lone backslashes before real \n, fixing \\\n
    .replace(/\\(?=\n)/g, '')
    // Step 2: turns escaped \n into a proper line break
    .replace(/\\n/g, '  \n')
    // Step 3: Replace all *single* real newlines (not \n\n) with a line break
    // matches single newlines, not double ones
    // (uses negative lookahead and capture group to preserve the preceding char)    
    .replace(/([^\n])\n(?!\n)/g, '$1  \n');  
 

  const processed = formatMentionsAndCoins(normalized);

  return (
    <ReactMarkdown
      children={processed}
      remarkPlugins={[remarkGfm]}
      skipHtml
      disallowedElements={['script', 'iframe']}
      components={{
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
      }}
    />
  );
};