import fs from 'fs'
import path from 'path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'

const postsDir = path.join(process.cwd(), 'content')

export interface Post {
  slug: string
  title: string
  summary: string
  content: string
  date: string
  displayDate: string
  tags: string[]
  readingTime: string
}

export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

function parsePost(fileName: string): Post {
  const slug = fileName.replace('.md', '')
  const raw = fs.readFileSync(path.join(postsDir, fileName), 'utf-8')
  const lines = raw.split('\n')

  const title = lines[0].replace(/^# /, '') || slug
  const summary = lines.slice(4, 6).join(' ').slice(0, 150) + '...'

  const rawDate = lines[1]?.replace(/^Date:\s*/, '').trim() || ''
  const rawTags = lines[2]?.replace(/^Tags:\s*/, '').trim() || ''
  const tags = rawTags ? rawTags.split(',').map((t) => t.trim()).filter(Boolean) : []

  let sortDate = rawDate
  if (rawDate.includes('-')) {
    const [dd, mm, yyyy] = rawDate.split('-')
    sortDate = `${yyyy}-${mm}-${dd}`
  }

  return {
    slug,
    title,
    summary,
    content: raw,
    date: sortDate,
    displayDate: rawDate,
    tags,
    readingTime: readingTime(raw),
  }
}

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))
  return files
    .map(parsePost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  return parsePost(`${slug}.md`)
}

export function getAllSlugs(): string[] {
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''))
}

// Strip the first 3 lines (title, date, tags) before rendering
function stripFrontmatter(raw: string): string {
  const lines = raw.split('\n')
  return [lines[0], ...lines.slice(3)].join('\n')
}

export async function renderPostHTML(post: Post): Promise<string> {
  const content = stripFrontmatter(post.content)

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeShiki, {
      themes: {
        dark: 'github-dark',
        light: 'github-light',
      },
    })
    .use(rehypeStringify)
    .process(content)

  return String(file)
}
