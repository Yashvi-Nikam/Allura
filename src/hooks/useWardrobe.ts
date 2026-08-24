import { useState } from 'react';
import axios from 'axios';
import { api } from '@/constants/api';
import { supabase } from '@/lib/supabase';

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

  /**
   * Get the currently authenticated Supabase user.
   *
   * IMPORTANT:
   * We intentionally do NOT use a hardcoded user ID.
   */
  const getCurrentUserId = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!session?.user?.id) {
      throw new Error(
        'No authenticated user found. Please sign in again.'
      );
    }

    return session.user.id;
  };

  /**
   * Fetch the current user's wardrobe.
   */
  const fetchWardrobe = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = await getCurrentUserId();

      const res = await axios.get(
        `${api.wardrobe}/${userId}`
      );

      setItems(res.data.items || []);

      return res.data.items || [];
    } catch (err: any) {
      console.error(
        'Failed to fetch wardrobe:',
        err
      );

      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to fetch wardrobe';

      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add an item to the current user's wardrobe.
   */
  const addItem = async (
    data: Omit<
      Partial<WardrobeItem>,
      'user_id'
    > & {
      image_base64?: string;
      image_mime_type?: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const userId = await getCurrentUserId();

      const payload = {
        ...data,
        user_id: userId,
      };

      const res = await axios.post(
        api.wardrobe,
        payload,
        {
          timeout: 120000,
        }
      );

      if (res.data?.item) {
        setItems(prev => [
          res.data.item,
          ...prev,
        ]);
      }

      return res.data.item;
    } catch (err: any) {
      console.error(
        'Failed to add wardrobe item:',
        err
      );

      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to add wardrobe item';

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    fetchWardrobe,
    addItem,
  };
};