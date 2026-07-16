import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { cancelBooking, fetchCancelPreview, type CancelPreview } from '../services/cancelBookingService'
import './CancelBooking.css'

export default function CancelBooking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [booking, setBooking] = useState<CancelPreview | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('This cancellation link is invalid or missing.')
      setLoading(false)
      return
    }

    fetchCancelPreview(token)
      .then((result) => {
        if (result.success && result.booking) {
          setBooking(result.booking)
          setError('')
        } else {
          setError(result.error || 'This cancellation link is invalid.')
        }
      })
      .catch(() => {
        setError('Could not load appointment details. Please try again.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  const handleCancel = async () => {
    if (!token || cancelling) return

    setCancelling(true)
    setError('')

    const result = await cancelBooking(token)
    if (result.success) {
      navigate('/cancellation-confirmed', {
        replace: true,
        state: { booking: result.booking ?? booking },
      })
      return
    }

    setError(result.error || 'Could not cancel appointment.')
    setCancelling(false)
  }

  return (
    <div className="cancel-booking-page">
      <PageMeta
        title="Confirm Cancellation"
        description="Review and confirm cancellation of your massage appointment at Linda Lue's Massage."
        path="/cancel-booking"
      />

      <section className="cancel-booking-hero">
        <p className="cancel-booking-eyebrow">Appointment Cancellation</p>
        <h1>Confirm Your Cancellation</h1>
        <p>
          You opened this page from your confirmation email.
          Review your appointment below, then confirm if you want to cancel.
        </p>
      </section>

      <section className="cancel-booking-card">
        {loading && (
          <div className="cancel-booking-loading">
            <div className="cancel-booking-spinner" aria-hidden="true" />
            <p>Loading your appointment...</p>
          </div>
        )}

        {!loading && error && (
          <div className="cancel-booking-status error">
            <h2>Unable to Load Cancellation</h2>
            <p>{error}</p>
            <p className="cancel-booking-help">
              If you need help, call us at <a href="tel:+18183797079">(818) 379-7079</a>.
            </p>
            <Link to="/booking" className="cancel-booking-link-button">Book a New Appointment</Link>
          </div>
        )}

        {!loading && !error && booking && (
          <>
            <div className="cancel-booking-step">
              <span className="cancel-booking-step-number">1</span>
              <span>Review appointment</span>
            </div>

            <h2>Appointment Details</h2>
            <div className="cancel-booking-summary">
              <p><strong>Name:</strong> {booking.client_name}</p>
              <p><strong>Service:</strong> {booking.service_type}</p>
              <p><strong>Date:</strong> {booking.appointment_date}</p>
              <p><strong>Time:</strong> {booking.appointment_time}</p>
              <p><strong>Therapist:</strong> {booking.therapist_name}</p>
            </div>

            <div className="cancel-booking-step">
              <span className="cancel-booking-step-number">2</span>
              <span>Confirm cancellation</span>
            </div>

            <div className="cancel-booking-notice">
              <p>
                Cancelling will remove this appointment from our schedule, free up the time slot,
                and send you a cancellation confirmation email.
              </p>
            </div>

            <div className="cancel-booking-actions">
              <button
                type="button"
                className="cancel-booking-button"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling Appointment...' : 'Yes, Cancel My Appointment'}
              </button>
              <Link to="/booking" className="cancel-booking-secondary">No, Keep My Appointment</Link>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
