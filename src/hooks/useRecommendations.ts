import { useState } from 'react';
import axios from 'axios';
import { api } from '@/constants/api';

export type RecommendationMode =
  | 'wardrobe'
  | 'scratch'
  | 'blend';

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

  /*
   * For blend/scratch modes, Gemini may suggest
   * pieces that aren't currently in the wardrobe.
   */
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

  weather: {
    condition: string;
    temperature: number;
  };

  anchor_item_id?: string;

  additional_notes?: string;
}

export const useRecommendations = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const getRecommendations = async (
    context: ContextInput
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        api.recommendations,
        context
      );

      const generatedOutfits =
        res.data?.outfits || [];

      setOutfits(generatedOutfits);

      return generatedOutfits;
    } catch (err: any) {
      console.error(
        'Recommendation request failed:',
        err?.response?.data || err
      );

      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Could not generate recommendations.';

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTED VERSION: Only sends why_this_works to match the backend!
  const saveOutfit = async (
    outfit_id: string,
    outfitData: Partial<Outfit> = {}
  ) => {
    try {
      await axios.patch(
        `${api.recommendations}/${outfit_id}/save`,
        { 
          // Only send what the database supports
          why_this_works: outfitData.why_this_works 
        }
      );
    } catch (err: any) {
      console.error(
        'Save outfit failed:',
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.error ||
          err?.message ||
          'Could not save outfit.'
      );
    }
  };

  return {
    outfits,
    loading,
    error,
    getRecommendations,
    saveOutfit,
  };
};