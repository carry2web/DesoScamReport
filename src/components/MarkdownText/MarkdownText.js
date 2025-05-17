import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MarkdownText = ({ text }) => {
  if (!text) return null;

    const preprocessMarkdown = (text) => {
        return text
            // Turn @brootle → [@brootle](/brootle)
            .replace(/(^|\s)@([a-zA-Z0-9_]{1,30})(?![.\w])/g, '$1[@$2]/$2)')
            // Turn $brootle → [$brootle](/brootle)
            .replace(/(^|\s)\$([a-zA-Z0-9_]{1,30})(?![.\w])/g, '$1[$$$2](/$2)')
            // Preserve line breaks in markdown
            .replace(/\n/g, '  \n');
    };

  return (
    <ReactMarkdown
      children={preprocessMarkdown(text)}
      remarkPlugins={[remarkGfm]}
      disallowedElements={['script', 'iframe']}
      skipHtml
      components={{
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
      }}
    />
  );
};
