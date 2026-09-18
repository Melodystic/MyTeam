import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getWorkModeSetting,
  getWorkspaceNotes,
  saveWorkModeSetting,
  saveWorkspaceNotes,
  subscribeBackupImported,
} from '../db';
import type { OneToOneMeetingNote } from '../types/employee';
import {
  createEmptyWorkspaceNotes,
  type LeadNoteKind,
  type WorkMode,
  type WorkspaceNotes,
} from '../types/workspace';

interface WorkspaceContextValue {
  workMode: WorkMode;
  setWorkMode: (mode: WorkMode) => void;
  notes: WorkspaceNotes;
  updateLeadNotesPrep: (kind: LeadNoteKind, prep: string) => void;
  updateLeadNotesAfter: (kind: LeadNoteKind, after: string) => void;
  saveLeadMeeting: (
    kind: LeadNoteKind,
    meetingDate: number,
    prep: string,
    after: string,
  ) => void;
  updateLeadMeetingNote: (
    kind: LeadNoteKind,
    noteId: string,
    note: Pick<OneToOneMeetingNote, 'meetingDate' | 'prep' | 'after'>,
  ) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workMode, setWorkModeState] = useState<WorkMode>('team');
  const [notes, setNotes] = useState<WorkspaceNotes>(createEmptyWorkspaceNotes);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    const [storedMode, storedNotes] = await Promise.all([
      getWorkModeSetting(),
      getWorkspaceNotes(),
    ]);
    setWorkModeState(storedMode);
    setNotes(storedNotes);
  }, []);

  useEffect(() => {
    void reload().finally(() => setReady(true));
    return subscribeBackupImported(() => {
      void reload();
    });
  }, [reload]);

  const commitNotes = useCallback((updater: (current: WorkspaceNotes) => WorkspaceNotes) => {
    setNotes((current) => {
      const next = updater(current);
      void saveWorkspaceNotes(next);
      return next;
    });
  }, []);

  const setWorkMode = useCallback((mode: WorkMode) => {
    setWorkModeState(mode);
    void saveWorkModeSetting(mode);
  }, []);

  const updateLeadNotesPrep = useCallback(
    (kind: LeadNoteKind, prep: string) => {
      commitNotes((current) => ({
        ...current,
        [kind]: { ...current[kind], prep },
      }));
    },
    [commitNotes],
  );

  const updateLeadNotesAfter = useCallback(
    (kind: LeadNoteKind, after: string) => {
      commitNotes((current) => ({
        ...current,
        [kind]: { ...current[kind], after },
      }));
    },
    [commitNotes],
  );

  const saveLeadMeeting = useCallback(
    (kind: LeadNoteKind, meetingDate: number, prep: string, after: string) => {
      const trimmedPrep = prep.trim();
      const trimmedAfter = after.trim();
      if (!trimmedPrep && !trimmedAfter) return;

      const now = Date.now();
      commitNotes((current) => ({
        ...current,
        [kind]: {
          prep: '',
          after: '',
          notes: [
            {
              id: crypto.randomUUID(),
              meetingDate,
              prep: trimmedPrep,
              after: trimmedAfter,
              createdAt: now,
              updatedAt: now,
            },
            ...current[kind].notes,
          ],
        },
      }));
    },
    [commitNotes],
  );

  const updateLeadMeetingNote = useCallback(
    (
      kind: LeadNoteKind,
      noteId: string,
      updates: Pick<OneToOneMeetingNote, 'meetingDate' | 'prep' | 'after'>,
    ) => {
      const prep = updates.prep.trim();
      const after = updates.after.trim();
      if (!prep && !after) return;

      commitNotes((current) => ({
        ...current,
        [kind]: {
          ...current[kind],
          notes: current[kind].notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  meetingDate: updates.meetingDate,
                  prep,
                  after,
                  updatedAt: Date.now(),
                }
              : note,
          ),
        },
      }));
    },
    [commitNotes],
  );

  const value = useMemo(
    () => ({
      workMode,
      setWorkMode,
      notes,
      updateLeadNotesPrep,
      updateLeadNotesAfter,
      saveLeadMeeting,
      updateLeadMeetingNote,
    }),
    [
      workMode,
      setWorkMode,
      notes,
      updateLeadNotesPrep,
      updateLeadNotesAfter,
      saveLeadMeeting,
      updateLeadMeetingNote,
    ],
  );

  if (!ready) return null;

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
}
