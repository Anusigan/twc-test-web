import { z } from 'zod';

const API_URL = 'http://localhost:5000/api';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters')
});

export type ContactData = z.infer<typeof contactSchema>;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getContacts = async () => {
  const response = await fetch(`${API_URL}/contacts`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }

  return response.json();
};

export const createContact = async (data: ContactData) => {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create contact');
  }

  return response.json();
};

export const updateContact = async (id: string, data: ContactData) => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update contact');
  }

  return response.json();
};

export const deleteContact = async (id: string) => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete contact');
  }
};