// controllers/contactController.js
import Contact from '../models/contact.js';
import nodemailer from 'nodemailer';

export async function sendEmail(contact) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', // Replace with your SMTP host
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"Your Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECIPIENT,
    subject: 'New Contact Form Submission',
    text: `You have a new contact form submission from:
Name: ${contact.name}
Email: ${contact.email}
Subject: ${contact.subject}
Message: ${contact.message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export const createContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    console.error('Validation Error: Missing required fields');
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const contact = new Contact({ name, email, subject, message });

  try {
    const savedContact = await contact.save();
    // await sendEmail(savedContact); // Uncomment if you want to send email
    res.status(201).json(savedContact);
  } catch (err) {
    console.error('Error saving contact or sending email:', err);
    res.status(500).json({ message: 'Failed to process request' });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
