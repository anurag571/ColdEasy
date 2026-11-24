import React, { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { INDIAN_STATES_AND_UTS } from '../data/mock';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { track } from '../lib/track';
import { Mail, Phone, MessageCircle, MapPin, ExternalLink, CheckCircle2, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    userRole: 'Farmer',
    state: 'Maharashtra',
    pincode: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Please enter your name.';
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile starting with 6, 7, 8, or 9.';
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'PIN code must be exactly 6 digits.';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    // Log to console only as required
    console.log('[ColdEasy Contact Form Submission]:', formData);
    track('generate_lead', {
      form_type: 'contact',
      state: formData.state,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-cream py-10 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <SectionHeading
            title="GET IN TOUCH"
            subtitle="Connect directly with our engineering and deployment support desks."
          />
        </div>

        {/* 1. Four Large Tappable Contact Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {/* Tile 1: Email */}
          <a
            href="mailto:info@coldeasy.in"
            className="p-6 rounded-[24px] bg-white border border-ink/10 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-light flex items-center justify-center mb-4 text-ink group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-leaf" />
              </div>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-60 block">
                Email
              </span>
              <h3 className="font-heading font-bold text-base text-ink mt-1 truncate">
                info@coldeasy.in
              </h3>
            </div>
            <span className="mt-4 text-xs font-semibold text-leaf inline-flex items-center gap-1">
              Send Email →
            </span>
          </a>

          {/* Tile 2: Call */}
          <a
            href="tel:+919182968542"
            className="p-6 rounded-[24px] bg-white border border-ink/10 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-leaf-light flex items-center justify-center mb-4 text-leaf group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-leaf" />
              </div>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-60 block">
                Call Us
              </span>
              <h3 className="font-heading font-bold text-base text-ink mt-1">+91 91829 68542</h3>
              <p className="text-[11px] text-ink-60 mt-1 font-body">Mon–Fri, 8am–8pm</p>
            </div>
            <span className="mt-4 text-xs font-semibold text-leaf inline-flex items-center gap-1">
              Call Now →
            </span>
          </a>

          {/* Tile 3: WhatsApp */}
          <a
            href="https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-[24px] bg-white border border-ink/10 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-marigold-light flex items-center justify-center mb-4 text-ink group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6 text-ink" />
              </div>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-60 block">
                WhatsApp
              </span>
              <h3 className="font-heading font-bold text-base text-ink mt-1">Chat Directly</h3>
              <p className="text-[11px] text-ink-60 mt-1 font-body">
                Quick replies for product questions
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-leaf inline-flex items-center gap-1">
              Open WhatsApp →
            </span>
          </a>

          {/* Tile 4: Address */}
          <div className="p-6 rounded-[24px] bg-white border border-ink/10 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sand flex items-center justify-center mb-4 text-ink">
                <MapPin className="w-6 h-6 text-leaf" />
              </div>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-60 block">
                Office & Lab
              </span>
              <h3 className="font-heading font-bold text-xs text-ink mt-1 leading-snug">
                Temperate Technologies
              </h3>
              <p className="text-[11px] text-ink-60 mt-1">Bangalore & Hyderabad, India</p>
            </div>

            <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between">
              <a
                href="https://share.google/LrIPpJB1AfAGYPMW0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-leaf hover:underline inline-flex items-center gap-1"
              >
                Open in Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Map Image Placeholder */}
        <div className="mb-14 rounded-[24px] bg-white p-4 border border-ink/10 shadow-xs overflow-hidden">
          <ImagePlaceholder
            label="MAP: ColdEasy Headquarters & Thermal Testing Centre"
            sublabel="Bangalore & Hyderabad Technology Hubs"
            aspectRatio="aspect-[21/9] sm:aspect-[32/9]"
            className="bg-sand/70"
          />
        </div>

        {/* 2. Contact Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-[28px] p-6 sm:p-10 border border-ink/10 shadow-md">
          <h3 className="font-heading font-bold text-xl uppercase tracking-wider text-ink mb-2">
            Send an Enquiry
          </h3>
          <p className="text-xs sm:text-sm text-ink-60 font-body mb-8">
            Tell us about your produce and requirements. Our agri-cooling specialists will get back
            to you shortly.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-chilli font-medium">{errors.name}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-1.5">
                  Mobile Number (+91) *
                </label>
                <div className="flex rounded-full border border-ink-40/60 overflow-hidden bg-white">
                  <span className="px-3.5 py-3 bg-sand text-ink-60 text-xs sm:text-sm font-semibold border-r border-ink-40/40 select-none flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="98765 43210"
                    className="flex-1 px-4 py-3 text-xs sm:text-sm text-ink outline-hidden font-medium"
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1 text-xs text-chilli font-medium">{errors.mobile}</p>
                )}
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                />
              </div>

              {/* I am a */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-1.5">
                  I am a
                </label>
                <select
                  value={formData.userRole}
                  onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                  className="w-full px-4 py-3 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden bg-white"
                >
                  <option value="Farmer">Farmer</option>
                  <option value="Vendor or retailer">Vendor or retailer</option>
                  <option value="FPO or cooperative">FPO or cooperative</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* State & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-1.5">
                    State / Union Territory
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden bg-white"
                  >
                    {INDIAN_STATES_AND_UTS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-1.5">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 560001"
                    className="w-full px-4 py-3 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-chilli font-medium">{errors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the crops you store, volumes, or distribution interests..."
                  className="w-full p-4 rounded-2xl border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </form>
          ) : (
            <div className="p-8 text-center bg-leaf-light/50 rounded-[24px] border border-leaf/20 space-y-4">
              <div className="w-14 h-14 rounded-full bg-leaf text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-xl uppercase tracking-wider text-ink">
                Thank you!
              </h4>
              <p className="text-sm text-ink-60 font-body max-w-md mx-auto">
                Your message has been recorded. Our regional field operations team will connect with
                you on WhatsApp within 1 working day.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    mobile: '',
                    email: '',
                    userRole: 'Farmer',
                    state: 'Maharashtra',
                    pincode: '',
                    message: '',
                  });
                }}
                className="py-2.5 px-6 rounded-full bg-sand text-ink text-xs font-heading font-semibold uppercase tracking-wider hover:bg-sand/80"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
