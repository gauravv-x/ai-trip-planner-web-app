"use client"

import React, { JSX, useState } from "react"

type FormState = {
  name: string
  email: string
  subject: string
  message: string
  website?: string // honeypot
}

export default function Page(): JSX.Element {
  const ORANGE = "#f5411d"
  const ORANGE_LIGHT = "#fff4eb"
  const WHITE = "#ffffff"
  const MAX_MESSAGE = 1000

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const validate = (values: FormState) => {
    const e: typeof errors = {}
    if (!values.name.trim() || values.name.trim().length < 2) e.name = "Please enter your full name."
    if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = "Please enter a valid email."
    if (!values.subject.trim()) e.subject = "Please add a short subject."
    if (values.message.trim().length < 10) e.message = "Message must be at least 10 characters."
    if (values.website && values.website.trim().length > 0) e.website = "Bad input." // honeypot filled
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
    setStatusMsg(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMsg(null)
    const validation = validate(form)
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setForm({ name: "", email: "", subject: "", message: "", website: "" })
      setStatusMsg({ type: "success", text: "Thanks — your message has been sent. We'll reply within 1–2 business days." })
    } catch (err) {
      setStatusMsg({ type: "error", text: "Something went wrong. Please try again later." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section style={{ maxWidth: 900, margin: "2rem auto", padding: "1.25rem", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div
        style={{
          background: WHITE,
          borderRadius: 12,
          boxShadow: "0 6px 18px rgba(17,17,17,0.08)",
          overflow: "hidden",
          border: `1px solid ${ORANGE}22`,
        }}
      >
        <header style={{ background: ORANGE, color: WHITE, padding: "1.25rem 1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Contact Us</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.95, fontSize: "0.95rem" }}>Questions? We're here to help — send us a message.</p>
        </header>

        <main style={{ padding: "1.25rem 1.5rem" }}>
          <p style={{ marginTop: 0, color: "#333", lineHeight: 1.4 }}>
            Fill out the form and we'll respond within 1–2 business days. Preferred contact method is email.
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ marginTop: 12 }}>
            <div className="gridTwo" style={{ display: "grid", gap: 12 }}>
              <label className="field">
                <span className="labelRow">
                  Name <span className="required">*</span>
                </span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={!!errors.name}
                  placeholder="Your full name"
                  className={`input ${errors.name ? "invalid" : ""}`}
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </label>

              <label className="field">
                <span className="labelRow">
                  Email <span className="required">*</span>
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  placeholder="you@example.com"
                  className={`input ${errors.email ? "invalid" : ""}`}
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </label>
            </div>

            <label className="field" style={{ marginTop: 12 }}>
              <span className="labelRow">
                Subject <span className="required">*</span>
              </span>
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                aria-invalid={!!errors.subject}
                placeholder="Short summary"
                className={`input ${errors.subject ? "invalid" : ""}`}
              />
              {errors.subject && <div className="error">{errors.subject}</div>}
            </label>

            <label className="field" style={{ marginTop: 12 }}>
              <span className="labelRow">
                Message <span className="required">*</span>
              </span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                maxLength={MAX_MESSAGE}
                aria-invalid={!!errors.message}
                placeholder="Describe your issue or question"
                className={`textarea ${errors.message ? "invalid" : ""}`}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                {errors.message ? <div className="error">{errors.message}</div> : <div className="helper">Minimum 10 characters</div>}
                <div className="charCount">{form.message.length}/{MAX_MESSAGE}</div>
              </div>
            </label>

            {/* Honeypot */}
            <input name="website" value={form.website} onChange={handleChange} type="text" autoComplete="off" tabIndex={-1} style={{ display: "none" }} />

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: ORANGE,
                  color: WHITE,
                  border: "none",
                  padding: "0.65rem 1rem",
                  borderRadius: 8,
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  boxShadow: `0 6px 18px ${ORANGE}33`,
                }}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>

              <div style={{ color: "#666", fontSize: 14 }}>Or email <a href="mailto:support@example.com" style={{ color: ORANGE, textDecoration: "underline" }}>support@example.com</a></div>
            </div>

            {statusMsg && (
              <div
                role="status"
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 8,
                  background: statusMsg.type === "success" ? ORANGE_LIGHT : "#ffe8e2",
                  color: statusMsg.type === "success" ? "#663f1f" : "#801b00",
                  border: `1px solid ${statusMsg.type === "success" ? ORANGE + "33" : "#f5a38f"}`,
                }}
              >
                {statusMsg.text}
              </div>
            )}
          </form>

          <aside style={{ marginTop: 18, padding: 12, borderRadius: 8, background: "#fffaf6", border: `1px solid ${ORANGE}11` }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Other ways to reach us</h3>
            <p style={{ margin: "6px 0" }}>Phone: <strong>+91 70434 03193</strong></p>
            <p style={{ margin: "6px 0" }}>Support hours: Mon–Fri, 9am–6pm (local time)</p>
          </aside>
        </main>
      </div>

      <style jsx>{`
        .gridTwo {
          grid-template-columns: 1fr;
        }
        @media (min-width: 700px) {
          .gridTwo {
            grid-template-columns: 1fr 1fr;
          }
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .labelRow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        .required {
          color: ${ORANGE};
          font-size: 0.85rem;
          font-weight: 700;
        }
        .input, .textarea {
          background: ${WHITE};
          border: 1px solid #ddd;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.95rem;
          outline: none;
          transition: box-shadow 0.12s ease, border-color 0.12s ease;
        }
        .input:focus, .textarea:focus {
          border-color: ${ORANGE};
          box-shadow: 0 6px 18px ${ORANGE}22;
        }
        .invalid {
          border-color: #f46b42;
          box-shadow: 0 4px 12px rgba(244,107,66,0.12);
        }
        .error {
          color: #b93a1c;
          font-size: 0.9rem;
          margin-top: 8px;
        }
        .helper {
          color: #666;
          font-size: 0.9rem;
        }
        .charCount {
          color: #666;
          font-size: 0.85rem;
        }
      `}</style>
    </section>
  )
}