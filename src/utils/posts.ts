// src/utils/posts.ts
export const posts = import.meta.glob('../posts/*.md', { eager: true, as: 'raw' }) as Record<string, string>;

// Transform into usable array
export const parsedPosts = Object.entries(posts).map(([path, content], idx) => {
  const fileName = path.split('/').pop() || `post-${idx}`;
  const slug = fileName.replace('.md', '');

  // First line = title, next few lines = summary
  const lines = content.split('\n');
  const title = lines[0].replace(/^# /, '') || slug;
  const summary = lines.slice(3, 5).join(' ').slice(0, 150) + '...';
  const date = lines[1].replace(/^Date: /, '') || 'Unknown Date';

  return {
    slug,
    title,
    summary,
    content,
    date,
  };
});
