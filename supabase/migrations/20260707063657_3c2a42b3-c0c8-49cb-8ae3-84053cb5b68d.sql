
ALTER TABLE public.evidence ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE public.attachments ADD COLUMN IF NOT EXISTS evidence_id uuid REFERENCES public.evidence(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_attachments_evidence_id ON public.attachments(evidence_id);
CREATE INDEX IF NOT EXISTS idx_evidence_suggestion_id ON public.evidence(suggestion_id, version);
