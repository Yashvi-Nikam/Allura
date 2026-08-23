import { useState } from 'react';
import axios from 'axios';
import { api } from '@/constants/api';

export interface Outfit {
  id: string;
  title: string;
  priority: string;
  item_ids: string[];
  item_names: string[];
  color_story: string;
  why_this_works: string;
  comfort_note: string;
  style_tags: string[];
}

export interface ContextInput {
  user_id: string;
  occasion: string;
  location_type: string;
  companions: string;
  activity: string;
  vibe: string;
  comfort_level: string;
  weather: { condition: string; temperature: number };
  anchor_item_id?: string;
  additional_notes?: string;
}

export const useRecommendations = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (context: ContextInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(api.recommendations, context);
      setOutfits(res.data.outfits);
      return res.data.outfits;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async (outfit_id: string) => {
    try {
      await axios.patch(`${api.recommendations}/${outfit_id}/save`, {});
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { outfits, loading, error, getRecommendations, saveOutfit };
};