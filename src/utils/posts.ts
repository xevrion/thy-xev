export const posts = import.meta.glob('../posts/*.md', { eager: true, as: 'raw' }) as Record<string, string>;

export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// Transform into usable array
export const parsedPosts = Object.entries(posts).map(([path, content], idx) => {
  const fileName = path.split('/').pop() || `post-${idx}`;
  const slug = fileName.replace('.md', '');

  // Split markdown lines
  const lines = content.split('\n');

  // Extract title & summary like before
  const title = lines[0].replace(/^# /, '') || slug;
  const summary = lines.slice(4, 6).join(' ').slice(0, 150) + '...';

  // Extract date from "Date:" line
  const rawDate = lines[1]?.replace(/^Date:\s*/, '').trim() || '';

  // Extract tags from "Tags:" line
  const rawTags = lines[2]?.replace(/^Tags:\s*/, '').trim() || '';
  const tags = rawTags ? rawTags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  // Convert DD-MM-YYYY → YYYY-MM-DD for JS sorting
  let sortDate = rawDate;
  if (rawDate.includes('-')) {
    const [dd, mm, yyyy] = rawDate.split('-');
    sortDate = `${yyyy}-${mm}-${dd}`;
  }

  return {
    slug,
    title,
    summary,
    content,
    date: sortDate,
    displayDate: rawDate,
    tags,
  };
});