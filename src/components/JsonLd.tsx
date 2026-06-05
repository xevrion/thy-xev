import { siteConfig } from '@/lib/site'

type SchemaProps =
  | { type: 'person' }
  | { type: 'website' }
  | { type: 'webpage'; title: string; description: string; canonicalUrl: string }
  | {
      type: 'article'
      title: string
      description: string
      canonicalUrl: string
      publishedAt?: string
      tags?: string[]
    }
  | { type: 'breadcrumb'; items: { name: string; url: string }[] }

const profileImageUrl = `${siteConfig.baseUrl}/android-chrome-512x512.png`
const schemaAuthor = {
  '@type': 'Person' as const,
  name: siteConfig.name,
  url: siteConfig.baseUrl,
}

function buildSchema(props: SchemaProps): object {
  const ctx = 'https://schema.org'

  if (props.type === 'person') {
    return {
      '@context': ctx,
      ...schemaAuthor,
      alternateName: siteConfig.handle,
      image: profileImageUrl,
      jobTitle: siteConfig.role,
      description: siteConfig.description,
      sameAs: [...siteConfig.sameAs],
    }
  }

  if (props.type === 'website') {
    return {
      '@context': ctx,
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.baseUrl,
      description: siteConfig.description,
      author: schemaAuthor,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteConfig.baseUrl}/blogs?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }
  }

  if (props.type === 'webpage') {
    return {
      '@context': ctx,
      '@type': 'WebPage',
      name: props.title,
      description: props.description,
      url: props.canonicalUrl,
      isPartOf: { '@type': 'WebSite', url: siteConfig.baseUrl },
      author: schemaAuthor,
    }
  }

  if (props.type === 'article') {
    return {
      '@context': ctx,
      '@type': 'BlogPosting',
      headline: props.title,
      description: props.description,
      url: props.canonicalUrl,
      image: profileImageUrl,
      ...(props.publishedAt && { datePublished: props.publishedAt }),
      ...(props.tags && { keywords: props.tags.join(', ') }),
      author: { ...schemaAuthor, image: profileImageUrl },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.baseUrl,
        logo: { '@type': 'ImageObject', url: profileImageUrl },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': props.canonicalUrl },
    }
  }

  // breadcrumb
  return {
    '@context': ctx,
    '@type': 'BreadcrumbList',
    itemListElement: props.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function JsonLd(props: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema(props)) }}
    />
  )
}
