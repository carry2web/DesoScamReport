import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MarkdownText = ({ text }) => {
    if (!text) return null;

    const preprocessMarkdown = (text) => {
        return text
            // Convert @username → Markdown link [@username](/username)
            // - Matches @ followed by 1–30 alphanumeric or underscore characters
            // - Ignores @ inside emails or domains (e.g. @gmail.com)
            .replace(/(^|\s)@([a-zA-Z0-9_]{1,30})(?![.\w])/g, '$1[@$2](/$2)')

            // Convert $TOKEN → Markdown link [$TOKEN](/TOKEN)
            // - Same length rule as mentions
            // - Links to same /username route
            .replace(/(^|\s)\$([a-zA-Z0-9_]{1,30})(?![.\w])/g, '$1[$$$2](/$2)')

            // Convert plain newlines to Markdown hard breaks (␣␣\n → <br/>)
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
