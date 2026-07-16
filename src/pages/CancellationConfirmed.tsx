import { Link, useLocation } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import type { CancelPreview } from '../services/cancelBookingService'
import './CancellationConfirmed.css'

type LocationState = {
  booking?: CancelPreview
}

export default function CancellationConfirmed() {
  const location = useLocation()
  const booking = (location.state as LocationState | null)?.booking

  return (
    <div className="cancellation-confirmed-page">
      <PageMeta
        title="Cancellation Confirmed"
        description="Your massage appointment at Linda Lue's Massage has been cancelled."
        path="/cancellation-confirmed"
      />

      <section className="cancellation-confirmed-hero">
        <div className="cancellation-confirmed-icon" aria-hidden="true">✓</div>
        <h1>Cancellation Confirmed</h1>
        <p>Your appointment has been successfully cancelled on our website.</p>
      </section>

      <section className="cancellation-confirmed-card">
        <div className="cancellation-confirmed-status success">
          <h2>You're all set</h2>
          <p>
            We've removed your appointment from our schedule and sent a confirmation email.
            {booking ? ' The details below reflect your cancelled booking.' : ''}
          </p>
        </div>

        {booking && (
          <div className="cancellation-confirmed-summary">
            <h3>Cancelled Appointment</h3>
            <p><strong>Name:</strong> {booking.client_name}</p>
            <p><strong>Service:</strong> {booking.service_type}</p>
            <p><strong>Date:</strong> {booking.appointment_date}</p>
            <p><strong>Time:</strong> {booking.appointment_time}</p>
            <p><strong>Therapist:</strong> {booking.therapist_name}</p>
          </div>
        )}

        <div className="cancellation-confirmed-help">
          <p>Need to book again or have questions?</p>
          <p>Call us at <a href="tel:+18183797079">(818) 379-7079</a></p>
        </div>

        <div className="cancellation-confirmed-actions">
          <Link to="/booking" className="cancellation-confirmed-primary">Book a New Appointment</Link>
          <Link to="/" className="cancellation-confirmed-secondary">Return to Homepage</Link>
        </div>
      </section>
    </div>
  )
}
