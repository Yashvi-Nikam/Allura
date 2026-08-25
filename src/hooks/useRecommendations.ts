import { useState } from 'react';
import axios from 'axios';
import { api } from '@/constants/api';
import { supabase } from '@/lib/supabase'; // Import Supabase

export type RecommendationMode = 'wardrobe' | 'scratch' | 'blend';

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
  suggested_items?: string[];
  mode?: RecommendationMode;
}

export interface ContextInput {
  user_id: string;
  recommendation_mode: RecommendationMode;
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
      const generatedOutfits = res.data?.outfits || [];
      setOutfits(generatedOutfits);
      return generatedOutfits;
    } catch (err: any) {
      console.error('Recommendation request failed:', err?.response?.data || err);
      const message = err?.response?.data?.error || err?.message || 'Could not generate recommendations.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async (outfit_id: string) => {
    try {
      await axios.patch(`${api.recommendations}/${outfit_id}/save`, {});
    } catch (err: any) {
      console.error('Save outfit failed:', err?.response?.data || err);
      setError(err?.response?.data?.error || err?.message || 'Could not save outfit.');
    }
  };

  // 🚨 NEW: Add Feedback to Supabase directly!
  const addFeedback = async (outfit_id: string, action: 'liked' | 'skipped', reason?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('feedback').insert({
        user_id: user.id,
        outfit_id: outfit_id,
        action,
        reason: reason || null,
      });
    } catch (e) {
      console.error("Failed to save feedback:", e);
    }
  };

  return {
    outfits,
    loading,
    error,
    getRecommendations,
    saveOutfit,
    addFeedback, // Return the new function
  };
};