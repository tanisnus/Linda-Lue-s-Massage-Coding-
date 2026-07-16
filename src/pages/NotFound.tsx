import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', padding: '120px 20px', textAlign: 'center' }}>
      <PageMeta title="Page Not Found" description="The page you requested could not be found." path="/404" />
      <h1 style={{ fontFamily: 'Georgia, serif', marginBottom: '12px' }}>Page Not Found</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        This page is not available yet or the link may be outdated.
      </p>
      <Link to="/" style={{ color: '#2d5a3d', fontWeight: 600 }}>Return to Homepage</Link>
    </div>
  )
}
