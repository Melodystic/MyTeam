import { normalizeOneToOneNotes, type OneToOneMeetingNote } from './employee';

export type WorkMode = 'team' | 'headOfLeads';

export type LeadNoteKind = 'directorate' | 'leads' | 'managerOneToOne';

export interface LeadNotesSection {
  prep: string;
  after: string;
  notes: OneToOneMeetingNote[];
}

export interface WorkspaceNotes {
  directorate: LeadNotesSection;
  leads: LeadNotesSection;
  managerOneToOne: LeadNotesSection;
}

export function createEmptyLeadNotesSection(): LeadNotesSection {
  return {
    prep: '',
    after: '',
    notes: [],
  };
}

export function createEmptyWorkspaceNotes(): WorkspaceNotes {
  return {
    directorate: createEmptyLeadNotesSection(),
    leads: createEmptyLeadNotesSection(),
    managerOneToOne: createEmptyLeadNotesSection(),
  };
}

function normalizeLeadNotesSection(value: unknown): LeadNotesSection {
  const source =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : {};

  return {
    prep: typeof source.prep === 'string' ? source.prep : '',
    after: typeof source.after === 'string' ? source.after : '',
    notes: normalizeOneToOneNotes(source.notes),
  };
}

export function normalizeWorkspaceNotes(value: unknown): WorkspaceNotes {
  let source: unknown = value;

  if (typeof value === 'string' && value.trim()) {
    try {
      source = JSON.parse(value) as unknown;
    } catch {
      return createEmptyWorkspaceNotes();
    }
  }

  const record =
    source && typeof source === 'object'
      ? (source as Record<string, unknown>)
      : {};

  return {
    directorate: normalizeLeadNotesSection(record.directorate),
    leads: normalizeLeadNotesSection(record.leads),
    managerOneToOne: normalizeLeadNotesSection(record.managerOneToOne),
  };
}

export function parseWorkMode(value: unknown): WorkMode {
  return value === 'headOfLeads' ? 'headOfLeads' : 'team';
}
