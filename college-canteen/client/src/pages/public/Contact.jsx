import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend, FiCheckCircle } from 'react-icons/fi';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-warm py-16 border-b border-orange-100">
        <div className="page-container text-center max-w-2xl mx-auto space-y-3">
          <span className="badge bg-primary-100 text-primary-800 font-bold uppercase text-xs">
            Get in Touch
          </span>
          <h1 className="text-4xl font-display font-extrabold text-charcoal-900">
            Contact Canteen Support
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600">
            Have questions about catering, special diet requirements, or lost items? We're here to help.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card p-6 border border-charcoal-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-xl">
                <FiMapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-charcoal-900 mb-1">Canteen Location</h3>
                <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">
                  Ground Floor, Student Activities Center (SAC Building), Campus Main Avenue, College Campus
                </p>
              </div>
            </div>

            <div className="card p-6 border border-charcoal-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xl">
                <FiPhone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-charcoal-900 mb-1">Phone Enquiries</h3>
                <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">
                  Direct Line: +91 (0) 98765-43210 <br />
                  Intercom Ext: 4421
                </p>
              </div>
            </div>

            <div className="card p-6 border border-charcoal-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-xl">
                <FiMail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-charcoal-900 mb-1">Email Support</h3>
                <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">
                  canteen@college.edu <br />
                  dining-helpdesk@college.edu
                </p>
              </div>
            </div>

            {/* Canteen Photo Card */}
            <div className="card p-0 border border-charcoal-100 overflow-hidden rounded-2xl">
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=700&h=400&fit=crop"
                  alt="Campus canteen interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="flex items-center gap-2 text-white">
                    <FiMapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <span className="text-xs font-semibold">Student Center Ground Floor (Near Central Library)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="card p-8 border border-charcoal-100 shadow-md">
              <h2 className="text-2xl font-display font-bold text-charcoal-900 mb-2">
                Send us a Message
              </h2>
              <p className="text-sm text-charcoal-500 mb-6">
                Fill out the form below and the canteen management team will respond shortly.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
                  <FiCheckCircle className="w-10 h-10 text-green-600 mx-auto" />
                  <h3 className="font-display font-bold text-lg text-green-800">Message Received!</h3>
                  <p className="text-sm text-green-700">
                    Thank you for reaching out. We will address your query as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-outline btn-sm border-green-600 text-green-700 hover:bg-green-100 mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="label">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Your Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@college.edu"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Feedback regarding morning service"
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your suggestions, questions, or concerns here..."
                      className="input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
