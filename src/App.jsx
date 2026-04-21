import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Stack, Button, 
  IconButton, TextField, Paper, Collapse 
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import shapesImage from "./assets/1.png"; 

const API_BASE = "http://localhost:8080/pastoral/songs";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ title: "", artist: "", url: "" });

  const fetchSongs = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setSongs(data);
      if (data.length > 0 && !currentSong) setCurrentSong(data[0]);
    } catch (err) { console.error("Database connection failed."); }
  };

  useEffect(() => { fetchSongs(); }, []);

  const handleSave = async () => {
    if (!formData.url || !formData.title) return;
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;

    await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    setFormData({ title: "", artist: "", url: "" });
    setEditingId(null);
    fetchSongs();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (currentSong?.id === id) setCurrentSong(null);
    fetchSongs();
  };

  const handleEditClick = (song) => {
    setEditingId(song.id);
    setFormData({ title: song.title, artist: song.artist, url: song.url });
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <Box sx={{ minHeight: "100vh", display: 'flex', flexDirection: 'column', bgcolor: '#0B1011' }}>
      
      {/* BACKGROUND TEXTURE */}
      <Box sx={{ 
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', 
        opacity: 0.10, backgroundImage: `url(${shapesImage})`, backgroundSize: 'cover' 
      }} />

      <Box sx={{ flexGrow: 1, display: 'flex', position: 'relative', zIndex: 1 }}>
        
        {/* LEFT SIDE: LIBRARY (DARK) */}
        <Box sx={{ 
          flex: 1.2, p: 6, color: 'white', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 8, letterSpacing: 2 }}>
            VINYL<span style={{ color: '#FF5F1F' }}>IST</span>
          </Typography>

          <Typography variant="h2" sx={{ fontWeight: 900, mb: 4, letterSpacing: -3 }}>A side</Typography>

          <Stack spacing={1} sx={{ flexGrow: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 0 } }}>
            {songs.map((song, index) => (
              <Box 
                key={song.id} 
                onClick={() => setCurrentSong(song)}
                sx={{ 
                  p: 2, display: 'flex', alignItems: 'center', cursor: 'pointer',
                  borderLeft: currentSong?.id === song.id ? '3px solid #FF5F1F' : '3px solid transparent',
                  bgcolor: currentSong?.id === song.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  transition: '0.3s', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                }}
              >
                <Typography sx={{ minWidth: 40, opacity: 0.3, fontWeight: 900 }}>
                  {(index + 1).toString().padStart(2, '0')}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{song.title}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>{song.artist}</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditClick(song); }}>
                    <EditIcon sx={{ color: '#FF5F1F', fontSize: 18 }} />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(song.id); }}>
                    <DeleteOutlinedIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* RIGHT SIDE: PLAYER & EDITOR (LIGHT) */}
        <Box sx={{ flex: 1.8, bgcolor: '#E7E2D8', p: 6, display: 'flex', flexDirection: 'column' }}>
          
        

          {/* PLAYER */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper sx={{ width: '100%', maxWidth: '750px', aspectRatio: '16/9', bgcolor: 'black', borderRadius: 1, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              {currentSong && (
                <iframe
                  style={{ width: '100%', height: '100%' }}
                  src={`https://www.youtube.com/embed/${getYouTubeId(currentSong.url)}?autoplay=1`}
                  frameBorder="0" allow="autoplay"
                />
              )}
            </Paper>
          </Box>

          {/* TEXT VISIBILITY FIX HERE */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', color: '#0B1011', letterSpacing: -1 }}>
              {currentSong?.title || "Select Track"}
            </Typography>
            <Typography variant="h5" sx={{ color: '#FF5F1F', fontWeight: 600, mt: 1 }}>
              {currentSong?.artist || "Unknown Artist"}
            </Typography>
          </Box>
          <br>______________</br>

            {/* EDITOR FORM */}
          <Paper elevation={0} sx={{ p: 3, mb: 6, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: 2, border: editingId ? '1px solid #FF5F1F' : '1px solid transparent' }}>
            <Typography variant="caption" sx={{ fontWeight: 900, color: '#FF5F1F', mb: 2, display: 'block' }}>
              {editingId ? "MODIFYING RECORD" : "QUICK ADD URL"}
            </Typography>
            
            <Stack spacing={2}>
              <TextField 
                placeholder="YouTube URL" variant="standard" fullWidth 
                value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})}
                InputProps={{ sx: { color: '#111', fontWeight: 500 } }}
              />
              
              <Collapse in={editingId !== null || formData.url.length > 10}>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <TextField 
                    placeholder="Song Title" variant="standard" fullWidth 
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                    InputProps={{ sx: { color: '#111' } }}
                  />
                  <TextField 
                    placeholder="Artist" variant="standard" fullWidth 
                    value={formData.artist} onChange={(e) => setFormData({...formData, artist: e.target.value})}
                    InputProps={{ sx: { color: '#111' } }}
                  />
                </Stack>
              </Collapse>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
                {editingId && <Button onClick={() => {setEditingId(null); setFormData({title:"", artist:"", url:""})}} sx={{ color: '#666' }}>Cancel</Button>}
                <Button 
                  variant="contained" onClick={handleSave}
                  sx={{ bgcolor: '#111', color: 'white', borderRadius: 0, fontWeight: 900, px: 4, '&:hover': { bgcolor: '#333' } }}
                >
                  {editingId ? "UPDATE TITLE" : "SAVE TRACK"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}