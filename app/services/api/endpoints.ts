import { HN_API_CONFIG } from '../../config/env';


export const HN_API_BASE_URL = HN_API_CONFIG.BASE_URL;

export const HN_ENDPOINTS = {

  TOP_STORIES: `${HN_API_BASE_URL}/topstories.json`,
  NEW_STORIES: `${HN_API_BASE_URL}/newstories.json`,
  BEST_STORIES: `${HN_API_BASE_URL}/beststories.json`,
  ASK_STORIES: `${HN_API_BASE_URL}/askstories.json`,
  SHOW_STORIES: `${HN_API_BASE_URL}/showstories.json`,
  JOB_STORIES: `${HN_API_BASE_URL}/jobstories.json`,


  ITEM: (id: number) => `${HN_API_BASE_URL}/item/${id}.json`,


  USER: (username: string) => `${HN_API_BASE_URL}/user/${username}.json`,


  MAX_ITEM: `${HN_API_BASE_URL}/maxitem.json`,


  UPDATES: `${HN_API_BASE_URL}/updates.json`,
} as const;
