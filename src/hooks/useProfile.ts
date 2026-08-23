import { useState } from 'react';
import axios from 'axios';
import { api } from '@/constants/api';

export interface Profile {
  user_id: string;
  display_name: string;
  style_preferences: Record<string, any>;
  comfort_preferences: Record<string, any>;
  body_preferences: Record<string, any>;
  cultural_preferences: Record<string, any>;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProfile = async (data: Profile) => {
    setLoading(true);
    try {
      const res = await axios.post(api.profile, data);
      setProfile(res.data.profile);
      return res.data.profile;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (user_id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${api.profile}/${user_id}`);
      setProfile(res.data.profile);
      return res.data.profile;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, saveProfile, fetchProfile };
};