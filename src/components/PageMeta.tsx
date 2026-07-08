import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://www.lindalueswellnessandspa.com'
const SITE_NAME = "Linda Lue's Massage"

type PageMetaProps = {
  title: string
  description: string
  path: string
}

export default function PageMeta({ title, description, path }: PageMetaProps) {
  const pageTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
