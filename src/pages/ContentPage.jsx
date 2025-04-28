import React, { useState, useEffect, useContext } from 'react';
import { fetchContentAssets } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import {
  Box, Typography, TextField, MenuItem, Paper,
  Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Pagination, CircularProgress,
  Snackbar, Alert, Button
} from '@mui/material';
import API from '../api/api'; // Ensure this is the correct path to your API module
import EditContentModal from '../components/EditContentModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import BulkTagModal from '../components/BulkTagModal';

const contentTypes = ['social', 'email', 'ad'];
const tones = ['Neutral', 'Friendly', 'Professional', 'Urgent'];
const intents = ['educate', 'inform', 'sell', 'engage', 'convert'];
const sentiments = ['positive', 'neutral', 'urgent', 'negative'];
const categories = ['awareness', 'conversion', 'engagement', 'retention'];

export default function ContentDashboard() {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [toneFilter, setToneFilter] = useState('');
  const [intentFilter, setIntentFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  const fetchData = async () => {
    setLoading(true);
    setSnack({ open: false, message: '', severity: 'success' });
    try {
      const filters = {
        search,
        type: typeFilter,
        tone: toneFilter,
        aiIntent: intentFilter,
        aiSentiment: sentimentFilter,
        aiCategory: categoryFilter,
        page,
        limit: 10
      };
      const result = await fetchContentAssets(filters, user?.token);
      setData(result.items || []);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error('❌ Failed to fetch content:', err);
      setError('Failed to load content');
      setSnack({ open: true, message: 'Failed to load content', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchData();
  }, [user?.token, search, typeFilter, toneFilter, intentFilter, sentimentFilter, categoryFilter, page]);  

  const handleSelectAll = () => {
    setSelectedIds(allSelected ? [] : data.map((item) => item.id));
  };
  
  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>✍️ Content Dashboard</Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth />
          <TextField select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="">All</MenuItem>
            {contentTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField select label="Tone" value={toneFilter} onChange={(e) => setToneFilter(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="">All</MenuItem>
            {tones.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField select label="Intent" value={intentFilter} onChange={(e) => setIntentFilter(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="">All</MenuItem>
            {intents.map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
          </TextField>
          <TextField select label="Sentiment" value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="">All</MenuItem>
            {sentiments.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField select label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        </Stack>
      </Paper>

      {loading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell padding="checkbox">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={handleSelectAll}
                        />
                        </TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Campaign</TableCell>
                        <TableCell>Content</TableCell>
                        <TableCell>Media</TableCell>
                        <TableCell>Tone</TableCell>
                        <TableCell>Tags</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((c) => (
                        <TableRow key={c.id} selected={selectedIds.includes(c.id)}>
                        <TableCell padding="checkbox">
                            <input
                            type="checkbox"
                            checked={selectedIds.includes(c.id)}
                            onChange={() => handleSelectOne(c.id)}
                            />
                        </TableCell>
                        <TableCell>{c.type}</TableCell>
                        <TableCell>{c.campaign?.name}</TableCell>
                        <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.content}
                        </TableCell>
                        <TableCell>
                            {c.mediaType === 'image' && c.mediaUrl && (
                            <img src={c.mediaUrl} alt="Preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                            )}
                            {c.mediaType === 'video' && c.mediaUrl && (
                            <video src={c.mediaUrl} controls style={{ width: 100, borderRadius: 4 }} />
                            )}
                            {!c.mediaUrl && <Typography variant="caption" color="text.secondary">No media</Typography>}
                        </TableCell>
                        <TableCell>{c.tone}</TableCell>
                        <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={1}>
                            <Button variant="outlined" size="small" onClick={() => setEditingItem(c)}>✏️ Edit</Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={async () => {
                                    if (!window.confirm(`Delete ${selectedIds.length} items? This cannot be undone.`)) return;

                                    try {
                                    const res = await fetch('/api/content/bulk-delete', {
                                        method: 'POST',
                                        headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${user.token}`
                                        },
                                        body: JSON.stringify({ ids: selectedIds })
                                    });

                                    if (res.ok) {
                                        setSnack({ open: true, message: '🗑️ Deleted successfully', severity: 'success' });
                                        setSelectedIds([]);
                                        fetchData();
                                    } else {
                                        throw new Error('Delete failed');
                                    }
                                    } catch (err) {
                                    console.error('❌ Bulk delete error:', err);
                                    setSnack({ open: true, message: 'Failed to delete content', severity: 'error' });
                                    }
                                }}
                                >
                                🗑️ Delete
                                </Button>
                            <Button variant="outlined" onClick={() => setTagModalOpen(true)}>🏷️ Tag</Button>
                            </Stack>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
            </Table>
          </TableContainer>
          {selectedIds.length > 0 && (
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Typography variant="body2">{selectedIds.length} selected</Typography>
            <Button variant="outlined" onClick={() => console.log('Tag', selectedIds)}>🏷️ Tag</Button>
            <Button variant="outlined" onClick={() => console.log('Export', selectedIds)}>📁 Export</Button>
            <Button variant="contained" color="error" onClick={() => console.log('Bulk Delete', selectedIds)}>🗑️ Delete</Button>
          </Stack>
          )}
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
          </Stack>
        </>
      )}
      <EditContentModal
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        content={editingItem}
        onSave={() => {
          setEditingItem(null);
          fetchData();
        }}
      />

      <DeleteConfirmationModal
        open={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        content={deletingItem}
        onDelete={() => {
          setDeletingItem(null);
          fetchData();
        }}
      />

        <BulkTagModal
        open={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        selectedCount={selectedIds.length}
        onSave={async (tags) => {
            try {
            await API.post('/api/content/bulk-tag', {
                ids: selectedIds,
                tags
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSnack({ open: true, message: 'Tags added successfully!', severity: 'success' });
            setTagModalOpen(false);
            fetchData(); // refresh list
            } catch (err) {
            console.error('❌ Failed to bulk tag:', err);
            setSnack({ open: true, message: 'Failed to tag content.', severity: 'error' });
            }
        }}
        />

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
