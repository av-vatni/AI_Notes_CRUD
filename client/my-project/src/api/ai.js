import axios from 'axios';

const BASE = 'http://localhost:5000/api/ai';

function cfg() { return {}; }

export const summarizeNote = (noteId) =>
  axios.post(`${BASE}/summary/${noteId}`, {}, cfg());

export const expandNote = (noteId, expansionType = 'detailed') =>
  axios.post(`${BASE}/expand/${noteId}`, { expansionType }, cfg());

export const generateTags = (noteId) =>
  axios.post(`${BASE}/generate-tags/${noteId}`, {}, cfg());


