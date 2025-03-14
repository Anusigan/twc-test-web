import express from 'express';
import { z } from 'zod';
import Contact from '../models/Contact.js';

const router = express.Router();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10)
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.userId });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create contact
router.post('/', async (req, res) => {
  try {
    const contactData = contactSchema.parse(req.body);
    const contact = new Contact({
      ...contactData,
      userId: req.user.userId
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact
router.put('/:id', async (req, res) => {
  try {
    const contactData = contactSchema.parse(req.body);
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      contactData,
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;