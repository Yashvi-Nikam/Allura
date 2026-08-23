import { useState } from 'react';
import axios from 'axios';
import { api } from '@/constants/api';

export interface WardrobeItem {
  id: string;
  user_id: string;
  image_url?: string;
  category: string;
  subcategory: string;
  color: string;
  style: string;
  formality: string;
  season: string;
  status: string;
  ai_tags: Record<string, any>;
  user_notes?: string;
}

export const useWardrobe = () => {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWardrobe = async (user_id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${api.wardrobe}/${user_id}`);
      setItems(res.data.items);
      return res.data.items;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (data: Partial<WardrobeItem>) => {
    setLoading(true);
    try {
      const res = await axios.post(api.wardrobe, data);
      setItems(prev => [res.data.item, ...prev]);
      return res.data.item;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error, fetchWardrobe, addItem };
};