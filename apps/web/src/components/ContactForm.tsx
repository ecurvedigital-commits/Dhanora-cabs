'use client';

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Outstation Cab');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
      <h2 className="font-display font-black text-xl text-[#14263D]">Send an Online Enquiry</h2>
      <p className="text-xs text-[#62758F]">
        Have a custom travel requirement or large group booking? Fill out the form below.
      </p>

      {isSent ? (
        <div className="p-6 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] text-center space-y-3">
          <CheckCircle className="w-10 h-10 text-[#15803D] mx-auto" />
          <h3 className="font-bold text-base text-[#14263D]">Enquiry Submitted Successfully!</h3>
          <p className="text-xs text-[#4B5E76] leading-relaxed">
            Thank you, <strong>{name}</strong>. Our travel coordinator has received your message and will call you on{' '}
            <strong>{phone}</strong> shortly.
          </p>
          <button
            onClick={() => {
              setIsSent(false);
              setMessage('');
            }}
            className="px-4 py-2 rounded-xl bg-[#14263D] text-white font-bold text-xs"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#14263D] block">Your Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Rahul Rawat"
              className="w-full px-3 py-2 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1] text-[#14263D] focus:outline-none focus:bg-white focus:border-[#F5BE19]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#14263D] block">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1] text-[#14263D] focus:outline-none focus:bg-white focus:border-[#F5BE19]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#14263D] block">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-3 py-2 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1] text-[#14263D] focus:outline-none focus:bg-white focus:border-[#F5BE19]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#14263D] block">Service Required</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1] text-[#14263D] focus:outline-none focus:bg-white focus:border-[#F5BE19]"
            >
              <option value="Outstation Cab">Outstation Cab (One-Way or Return)</option>
              <option value="Local Dehradun Taxi">Local Dehradun Taxi (Hourly Package)</option>
              <option value="Jolly Grant Airport Transfer">Jolly Grant Airport Transfer</option>
              <option value="Chardham Yatra Tour">Chardham Yatra Tour Package</option>
              <option value="Tempo Traveller Hire">Tempo Traveller (Group Hire)</option>
              <option value="Corporate / Wedding Transportation">Corporate / Wedding Transportation</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#14263D] block">Travel Details / Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Enter pickup date, number of passengers, and destination..."
              className="w-full px-3 py-2 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1] text-[#14263D] focus:outline-none focus:bg-white focus:border-[#F5BE19]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-black uppercase tracking-wider shadow-button-yellow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Sending Enquiry...' : 'Submit Travel Enquiry'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
