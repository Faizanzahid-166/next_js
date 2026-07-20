"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Github, Linkedin, Youtube, MessageSquare, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    // Simulate submission (no API call — UI only as per design constraints)
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message received! We'll get back to you within 24 hours.");
    }, 1200);
  };

  const contactItems = [
    {
      icon: <Mail className="w-4 h-4 stroke-[1.5]" />,
      label: "Email Us",
      value: "faizanzahid150@gmail.com",
      href: "mailto:faizanzahid150@gmail.com",
    },
    {
      icon: <Phone className="w-4 h-4 stroke-[1.5]" />,
      label: "EasyPaisa / WhatsApp",
      value: "+92 349-5526117",
      href: "tel:+923495526117",
    },
    {
      icon: <MapPin className="w-4 h-4 stroke-[1.5]" />,
      label: "Serving From",
      value: "Pakistan — Nationwide Delivery",
      href: null,
    },
  ];

  const socials = [
    {
      icon: <Github className="w-4 h-4" />,
      label: "GitHub",
      href: "https://github.com/Faizanzahid-166",
    },
    {
      icon: <Linkedin className="w-4 h-4" />,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/faizan-zahid-9671942a6/",
    },
    {
      icon: <Youtube className="w-4 h-4" />,
      label: "YouTube",
      href: "https://www.youtube.com/@ProgrammingHub-7107/playlists",
    },
  ];

  const faqs = [
    {
      q: "How do I pay for my order?",
      a: "We accept Cash on Delivery (COD) with a small upfront delivery deposit sent via EasyPaisa. You pay the rest when your order arrives.",
    },
    {
      q: "How long does delivery take?",
      a: "Orders are typically dispatched within 24 hours and delivered within 3–5 business days depending on your city.",
    },
    {
      q: "Can I return or exchange a product?",
      a: "Yes — we offer hassle-free exchanges within 30 days of delivery. Contact us at the email or number above to initiate a return.",
    },
    {
      q: "I submitted my EasyPaisa transaction but my order is still pending.",
      a: "Our admin team manually verifies all payment deposits within a few hours. If it's been over 12 hours, please reach out directly.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* PAGE HEADER */}
      <section className="border-b border-border/40 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
              Contact Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-neutral-900 leading-tight">
              We're here to help.
            </h1>
            <p className="text-base text-neutral-500 leading-relaxed">
              Questions about an order? Need help with EasyPaisa payment? Want to give us feedback?
              We respond to every message within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* LEFT COLUMN: Contact Info */}
          <div className="lg:col-span-2 space-y-10">

            {/* Contact Methods */}
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-neutral-900">
                Get in Touch
              </h2>
              <div className="space-y-4">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="mt-0.5 w-8 h-8 bg-secondary border border-border/40 rounded-md flex items-center justify-center text-neutral-600 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="text-sm font-semibold text-neutral-900 hover:underline mt-0.5 block"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-neutral-900 mt-0.5">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                Follow Along
              </h3>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 border border-border rounded-md flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-secondary transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* COD / EasyPaisa Support Card */}
            <div className="bg-neutral-950 text-white rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-semibold">COD & EasyPaisa Support</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Having trouble completing your EasyPaisa deposit or tracking a COD delivery? Send us your Order ID and
                we'll investigate immediately.
              </p>
              <div className="pt-1">
                <Link
                  href="/customer/dashboard/orders"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline"
                >
                  <span>View My Orders</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-border/40 rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-neutral-900 mb-6 border-b border-border/40 pb-4">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Your Name"
                      className="w-full border border-border p-2.5 rounded-md focus:outline-none focus:border-neutral-500 text-sm bg-white text-foreground transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full border border-border p-2.5 rounded-md focus:outline-none focus:border-neutral-500 text-sm bg-white text-foreground transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Order issue, product question, feedback..."
                    className="w-full border border-border p-2.5 rounded-md focus:outline-none focus:border-neutral-500 text-sm bg-white text-foreground transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={6}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your question or issue in detail. If related to an order, include your Order ID."
                    className="w-full border border-border p-2.5 rounded-md focus:outline-none focus:border-neutral-500 text-sm bg-white text-foreground resize-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <p className="text-[11px] text-neutral-400 text-center">
                  We typically respond within 24 hours on business days.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-neutral-50 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-12">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mt-3 leading-tight">
              Common Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white border border-border/40 rounded-xl p-6 space-y-3 hover:shadow-sm transition-shadow"
              >
                <h3 className="font-semibold text-neutral-900 text-sm leading-snug">{faq.q}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
