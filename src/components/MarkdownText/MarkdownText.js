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
  .replace(/\\n/g, '  \n')  // replace '\\\n' with '  \n' - see @kitty4D
  .replace(/\n/g, '  \n')   // replacing '\n\n' with '  \n' so it becomes a line break

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