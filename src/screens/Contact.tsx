import { useState } from 'react';
import { Button } from "../components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-[url(/contact-hero.jpg)] bg-cover bg-center h-64 md:h-80">
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Get in touch with our team for appointments, inquiries, and feedback
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-gray-800 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 rounded-full bg-[#fbb034]/10 flex items-center justify-center mb-4">
              <MapPin size={28} className="text-[#fbb034]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
            <p className="text-gray-400">
              123 Salon Street<br />
              Beauty District<br />
              City, 10001
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 rounded-full bg-[#fbb034]/10 flex items-center justify-center mb-4">
              <Phone size={28} className="text-[#fbb034]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-gray-400">
              Main: (123) 456-7890<br />
              Booking: (123) 456-7891
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 rounded-full bg-[#fbb034]/10 flex items-center justify-center mb-4">
              <Mail size={28} className="text-[#fbb034]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-gray-400">
              info@choppers.com<br />
              bookings@choppers.com
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 rounded-full bg-[#fbb034]/10 flex items-center justify-center mb-4">
              <Clock size={28} className="text-[#fbb034]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Opening Hours</h3>
            <p className="text-gray-400">
              Mon-Fri: 9:00 AM - 8:00 PM<br />
              Sat-Sun: 10:00 AM - 6:00 PM
            </p>
          </div>
        </div>

        {/* Map and Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map (placeholder) */}
          <div className="h-96 bg-gray-800 overflow-hidden">
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
              <p className="text-center p-4">
                Map Embed Would Go Here<br />
                (Add Google Maps or other map service embed code here)
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 p-8">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            {formSubmitted ? (
              <div className="bg-green-500/20 border border-green-500 p-4 text-center">
                <p className="text-white font-medium">Thank you! Your message has been sent successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="appointment">Appointment Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="services">Services Information</option>
                      <option value="careers">Careers/Jobs</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    type="submit"
                    className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold px-8 py-3 rounded-none"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-bold mb-2">Do I need to make an appointment?</h3>
              <p className="text-gray-400">
                While we do accept walk-ins when possible, we highly recommend booking appointments in advance to ensure availability with your preferred stylist and to minimize wait times.
              </p>
            </div>
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-bold mb-2">What happens if I need to cancel?</h3>
              <p className="text-gray-400">
                We understand that plans change. We appreciate at least 24 hours notice for cancellations. Last-minute cancellations or no-shows may incur a fee for future bookings.
              </p>
            </div>
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-bold mb-2">Do you offer gift cards?</h3>
              <p className="text-gray-400">
                Yes! Gift cards are available for purchase in-store or through our website. They can be used for any service or product we offer.
              </p>
            </div>
            <div className="pb-6">
              <h3 className="text-xl font-bold mb-2">What brands do you use?</h3>
              <p className="text-gray-400">
                We use premium professional brands including Kerastase, Oribe, Wella, and Kevin Murphy. All products used in our services are available for purchase in our salon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};