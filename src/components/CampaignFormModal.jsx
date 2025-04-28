import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, Tabs, Tab, Typography, Stack, Tooltip
} from '@mui/material';
import { createCampaignPlan, fetchStrategies } from '../api/api';
import CampaignPreviewModal from './CampaignPreviewModal';

const platforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Email'];
const postLengths = ['Short', 'Medium', 'Long'];
const tones = ['Neutral', 'Friendly', 'Professional', 'Witty', 'Urgent'];
const brandVoices = ['Professional', 'Casual', 'Witty', 'Bold', 'Inspirational', 'Neutral'];
const callToActions = ['Sign up now', 'Learn more', 'Try it free', 'Get started today', 'Book a demo', 'Shop now'];
const campaignGoals = ['Increase Brand Awareness', 'Generate Leads', 'Boost Engagement', 'Drive Website Traffic', 'Promote Product Launch', 'Build Community', 'Increase Sales'];
const audiences = ['Gen Z', 'Millennials', 'Parents', 'Professionals', 'Small Business Owners', 'Students', 'Retirees', 'Investors'];
const painPoints = ['Low engagement on social media', 'Lack of leads', 'Low sales', 'No brand awareness', 'Poor traffic conversion'];
const offers = ['None', 'Free trial', '20% off', 'BOGO deal', 'Exclusive access', 'Free consultation', 'Limited time offer', 'Free shipping'];

export default function CampaignFormModal({ open, onClose, onCreated, initialData }) {
  const initialForm = useMemo(() => ({
    name: '', goal: '', audience: '', platform: 'Facebook',
    budget: '', strategyId: '', callToAction: 'Learn more',
    painPoint: '', offer: '', brandVoiceNotes: 'Professional',
    postLength: 'Short', tone: 'Neutral', hashtags: '',
    customCallToAction: '', customBrandVoice: '', customTone: '',
    customPostLength: '', customPlatform: '', customGoal: '',
    customAudience: '', customOffer: '', customPainPoint: ''
  }), []);

  const [form, setForm] = useState(initialForm);
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          ...initialForm,
          ...initialData,
          id: initialData.id,
          goal: campaignGoals.includes(initialData.goal) ? initialData.goal : 'Other',
          customGoal: !campaignGoals.includes(initialData.goal) ? initialData.goal : '',
          audience: audiences.includes(initialData.audience) ? initialData.audience : 'Other',
          customAudience: !audiences.includes(initialData.audience) ? initialData.audience : '',
          platform: platforms.includes(initialData.platform) ? initialData.platform : 'Other',
          customPlatform: !platforms.includes(initialData.platform) ? initialData.platform : '',
          tone: tones.includes(initialData.tone) ? initialData.tone : 'Other',
          customTone: !tones.includes(initialData.tone) ? initialData.tone : '',
          postLength: postLengths.includes(initialData.postLength) ? initialData.postLength : 'Other',
          customPostLength: !postLengths.includes(initialData.postLength) ? initialData.postLength : '',
          brandVoiceNotes: brandVoices.includes(initialData.brandVoiceNotes) ? initialData.brandVoiceNotes : 'Other',
          customBrandVoice: !brandVoices.includes(initialData.brandVoiceNotes) ? initialData.brandVoiceNotes : '',
          callToAction: callToActions.includes(initialData.callToAction) ? initialData.callToAction : 'Other',
          customCallToAction: !callToActions.includes(initialData.callToAction) ? initialData.callToAction : '',
          offer: offers.includes(initialData.offer) ? initialData.offer : 'Other',
          customOffer: !offers.includes(initialData.offer) ? initialData.offer : '',
          painPoint: painPoints.includes(initialData.painPoint) ? initialData.painPoint : 'Other',
          customPainPoint: !painPoints.includes(initialData.painPoint) ? initialData.painPoint : '',
        });
      } else {
        setForm(initialForm);
      }
      loadStrategies();
    }
  }, [open, initialData]);
  

  const loadStrategies = async () => {
    try {
      const res = await fetchStrategies();
      setStrategies(res.data);
      if (res.data.length) {
        setForm((prev) => ({ ...prev, strategyId: res.data[0].id }));
      }
    } catch (err) {
      console.error('❌ Failed to fetch strategies:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, goal, audience, budget, strategyId } = form;
    if (!name || !goal || !audience || !budget || !strategyId) {
      setError('Please fill in all required fields.');
      return;
    }
  
    const payload = {
      ...form,
      goal: form.goal === 'Other' ? form.customGoal : form.goal,
      audience: form.audience === 'Other' ? form.customAudience : form.audience,
      platform: form.platform === 'Other' ? form.customPlatform : form.platform,
      tone: form.tone === 'Other' ? form.customTone : form.tone,
      postLength: form.postLength === 'Other' ? form.customPostLength : form.postLength,
      brandVoiceNotes: form.brandVoiceNotes === 'Other' ? form.customBrandVoice : form.brandVoiceNotes,
      callToAction: form.callToAction === 'Other' ? form.customCallToAction : form.callToAction,
      offer: form.offer === 'Other' ? form.customOffer : form.offer,
      painPoint: form.painPoint === 'Other' ? form.customPainPoint : form.painPoint,
      budget: parseInt(form.budget, 10)
    };
  
    setLoading(true);
    setError('');
  
    try {
      const res = initialData?.id
        ? await fetch(`/api/campaigns/${initialData.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
          })
        : await createCampaignPlan(payload);
  
      if (!res.ok && res.status) throw new Error('Network error');
  
      const data = await res.json();
      onCreated(data);
      onClose();
    } catch (err) {
      console.error('❌ Failed to submit campaign:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>📋 New Campaign Plan</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} sx={{ mb: 2 }}>
          <Tab label="Campaign Info" />
          <Tab label="Targeting & Tone" />
          <Tab label="Strategy Link" />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={2}>
            <TextField label="Campaign Name" name="name" fullWidth value={form.name} onChange={handleChange} />

            <TextField label="Campaign Goal" name="goal" select fullWidth value={form.goal} onChange={handleChange}>
              {[...campaignGoals, 'Other'].map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
            {form.goal === 'Other' && <TextField label="Custom Goal" name="customGoal" fullWidth value={form.customGoal} onChange={handleChange} />}

            <TextField label="Target Audience" name="audience" select fullWidth value={form.audience} onChange={handleChange}>
              {[...audiences, 'Other'].map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </TextField>
            {form.audience === 'Other' && <TextField label="Custom Audience" name="customAudience" fullWidth value={form.customAudience} onChange={handleChange} />}

            <TextField label="Platform" name="platform" select fullWidth value={form.platform} onChange={handleChange}>
              {[...platforms, 'Other'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
            {form.platform === 'Other' && <TextField label="Custom Platform" name="customPlatform" fullWidth value={form.customPlatform} onChange={handleChange} />}

            <Tooltip title="Set your estimated or max spend for this campaign.">
              <TextField label="Budget ($)" name="budget" type="number" fullWidth value={form.budget} onChange={handleChange} />
            </Tooltip>
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={2}>
            <TextField label="Post Length" name="postLength" select fullWidth value={form.postLength} onChange={handleChange}>
              {[...postLengths, 'Other'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
            {form.postLength === 'Other' && <TextField label="Custom Post Length" name="customPostLength" fullWidth value={form.customPostLength} onChange={handleChange} />}

            <TextField label="Tone" name="tone" select fullWidth value={form.tone} onChange={handleChange}>
              {[...tones, 'Other'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            {form.tone === 'Other' && <TextField label="Custom Tone" name="customTone" fullWidth value={form.customTone} onChange={handleChange} />}

            <TextField label="Brand Voice" name="brandVoiceNotes" select fullWidth value={form.brandVoiceNotes} onChange={handleChange}>
              {[...brandVoices, 'Other'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
            {form.brandVoiceNotes === 'Other' && <TextField label="Custom Brand Voice" name="customBrandVoice" fullWidth value={form.customBrandVoice} onChange={handleChange} />}

            <TextField label="Call to Action" name="callToAction" select fullWidth value={form.callToAction} onChange={handleChange}>
              {[...callToActions, 'Other'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            {form.callToAction === 'Other' && <TextField label="Custom Call to Action" name="customCallToAction" fullWidth value={form.customCallToAction} onChange={handleChange} />}

            <TextField label="Offer" name="offer" select fullWidth value={form.offer} onChange={handleChange}>
              {[...offers, 'Other'].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
            {form.offer === 'Other' && <TextField label="Custom Offer" name="customOffer" fullWidth value={form.customOffer} onChange={handleChange} />}

            <TextField label="Pain Point" name="painPoint" select fullWidth value={form.painPoint} onChange={handleChange}>
              {[...painPoints, 'Other'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
            {form.painPoint === 'Other' && <TextField label="Custom Pain Point" name="customPainPoint" fullWidth value={form.customPainPoint} onChange={handleChange} />}

            <TextField label="Hashtags" name="hashtags" fullWidth value={form.hashtags} onChange={handleChange} placeholder="marketing,startup,AI" />
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={2}>
            <TextField label="Linked Strategy" name="strategyId" select fullWidth value={form.strategyId} onChange={handleChange}>
              <MenuItem value="" disabled>Select a strategy</MenuItem>
              {strategies.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name || s.goal}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        )}

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>{error}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
        <Button
        variant="outlined"
        onClick={() => setPreviewOpen(true)}
        disabled={loading}
        >
        🤖 Preview with AI
        </Button>
      </DialogActions>
    </Dialog>

    <CampaignPreviewModal
    open={previewOpen}
    onClose={() => setPreviewOpen(false)}
    onEdit={() => {
        setPreviewOpen(false);
        setTab(0); // or whichever tab you want to focus on
    }}
    formData={{
        id: form.id,
        name: form.name,
        goal: form.goal === 'Other' ? form.customGoal : form.goal,
        platform: form.platform === 'Other' ? form.customPlatform : form.platform,
        audience: form.audience === 'Other' ? form.customAudience : form.audience,
        tone: form.tone === 'Other' ? form.customTone : form.tone,
        callToAction: form.callToAction === 'Other' ? form.customCallToAction : form.callToAction,
        painPoint: form.painPoint === 'Other' ? form.customPainPoint : form.painPoint,
        offer: form.offer === 'Other' ? form.customOffer : form.offer,
        brandVoiceNotes: form.brandVoiceNotes === 'Other' ? form.customBrandVoice : form.brandVoiceNotes,
        postLength: form.postLength === 'Other' ? form.customPostLength : form.postLength,
        hashtags: form.hashtags,
    }}
    />
    </>
  );
}
