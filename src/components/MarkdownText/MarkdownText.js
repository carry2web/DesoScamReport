import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LinkifyIt from 'linkify-it';

const linkify = new LinkifyIt();
linkify.set({ fuzzyEmail: false }); // ✅ Prevents emails from being matched

export const preprocessMarkdown = (text) => {
  if (!text) return '';

  let processed = text;

  // 1. Auto-link valid URLs (https://...)
  const matches = linkify.match(processed);
  if (matches) {
    for (let i = matches.length - 1; i >= 0; i--) {
      const { index, lastIndex, text: match, schema } = matches[i];

      // Skip if already markdown-linked
      const before = processed.slice(Math.max(0, index - 1), index);
      const isInsideLink = before === ']';
      if (isInsideLink) continue;

      const safe = schema ? match : `https://${match}`;
      const markdownLink = `[${match}](${safe})`;

      processed =
        processed.slice(0, index) + markdownLink + processed.slice(lastIndex);
    }
  }

  // 2. @mentions → [@user](/user)
  processed = processed.replace(
    /(^|\s)@([a-zA-Z0-9_]{1,30})(?![.\w])/g,
    '$1[@$2](/$2)'
  );

  // 3. $COIN → [$COIN](/COIN)
  processed = processed.replace(
    /(^|\s)\$([a-zA-Z0-9_]{1,30})(?![.\w])/g,
    '$1[$$$2](/$2)'
  );

  // 4. Preserve line breaks for markdown hard breaks
  processed = processed.replace(/\n/g, '  \n');

  return processed;
};

export const MarkdownText = ({ text }) => {
  const processed = preprocessMarkdown(text);

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