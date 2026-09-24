import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  getDepartmentProfiles,
  saveDepartmentProfiles,
  subscribeBackupImported,
} from '../db';
import { useEmployees } from './EmployeesContext';
import {
  normalizeProjectAssignments,
  type CharacterizationNote,
  type ProjectAssignment,
} from '../types/employee';
import {
  createDepartmentProfile,
  mergeTeamIntoProfiles,
  profilesMatch,
  type DepartmentProfile,
  type DepartmentProfileInput,
} from '../types/departmentProfile';

interface ProfileUpdate {
  firstName: string;
  lastName: string;
  leadName: string;
  projectAssignments: ProjectAssignment[];
}

interface ProfilesContextValue {
  profiles: DepartmentProfile[];
  loading: boolean;
  getById: (id: string) => DepartmentProfile | undefined;
  addProfile: (input: DepartmentProfileInput) => DepartmentProfile;
  updateProfile: (id: string, update: ProfileUpdate) => void;
  removeProfile: (id: string) => void;
  addProfileComment: (id: string, date: number, text: string) => void;
  updateProfileComment: (
    id: string,
    noteId: string,
    note: Pick<CharacterizationNote, 'date' | 'text'>,
  ) => void;
}

const ProfilesContext = createContext<ProfilesContextValue | null>(null);

export function ProfilesProvider({ children }: { children: ReactNode }) {
  const { employees, loading: employeesLoading } = useEmployees();
  const [profiles, setProfiles] = useState<DepartmentProfile[]>([]);
  const [ready, setReady] = useState(false);
  const [synced, setSynced] = useState(false);
  const [syncEpoch, setSyncEpoch] = useState(0);
  const skipSync = useRef(false);

  const reload = useCallback(async () => {
    skipSync.current = true;
    const stored = await getDepartmentProfiles();
    skipSync.current = false;
    setProfiles(stored);
    setSynced(false);
    setSyncEpoch((epoch) => epoch + 1);
  }, []);

  useEffect(() => {
    void reload().finally(() => setReady(true));
    return subscribeBackupImported(() => {
      void reload();
    });
  }, [reload]);

  useEffect(() => {
    if (!ready || employeesLoading || skipSync.current) return;

    setProfiles((current) => {
      const next = mergeTeamIntoProfiles(current, employees);
      if (profilesMatch(current, next)) return current;
      void saveDepartmentProfiles(next);
      return next;
    });
    setSynced(true);
  }, [ready, employeesLoading, employees, syncEpoch]);

  const commit = useCallback(
    (updater: (current: DepartmentProfile[]) => DepartmentProfile[]) => {
      setProfiles((current) => {
        const next = updater(current);
        void saveDepartmentProfiles(next);
        return next;
      });
    },
    [],
  );

  const getById = useCallback(
    (id: string) => profiles.find((profile) => profile.id === id),
    [profiles],
  );

  const addProfile = useCallback(
    (input: DepartmentProfileInput) => {
      const profile = createDepartmentProfile(input);
      commit((current) => [...current, profile]);
      return profile;
    },
    [commit],
  );

  const updateProfile = useCallback(
    (id: string, update: ProfileUpdate) => {
      commit((current) =>
        current.map((profile) => {
          if (profile.id !== id) return profile;
          const linked = !!profile.sourceEmployeeId;
          return {
            ...profile,
            firstName: linked ? profile.firstName : update.firstName.trim(),
            lastName: linked ? profile.lastName : update.lastName.trim(),
            leadName: update.leadName.trim(),
            projectAssignments: normalizeProjectAssignments(
              update.projectAssignments,
            ),
          };
        }),
      );
    },
    [commit],
  );

  const removeProfile = useCallback(
    (id: string) => {
      commit((current) =>
        current.filter(
          (profile) => profile.id !== id || profile.sourceEmployeeId,
        ),
      );
    },
    [commit],
  );

  const addProfileComment = useCallback(
    (id: string, date: number, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const now = Date.now();
      commit((current) =>
        current.map((profile) =>
          profile.id === id
            ? {
                ...profile,
                characterizations: [
                  {
                    id: crypto.randomUUID(),
                    date,
                    text: trimmed,
                    createdAt: now,
                    updatedAt: now,
                  },
                  ...profile.characterizations,
                ],
              }
            : profile,
        ),
      );
    },
    [commit],
  );

  const updateProfileComment = useCallback(
    (
      id: string,
      noteId: string,
      updates: Pick<CharacterizationNote, 'date' | 'text'>,
    ) => {
      const text = updates.text.trim();
      if (!text) return;
      commit((current) =>
        current.map((profile) =>
          profile.id === id
            ? {
                ...profile,
                characterizations: profile.characterizations.map((note) =>
                  note.id === noteId
                    ? {
                        ...note,
                        date: updates.date,
                        text,
                        updatedAt: Date.now(),
                      }
                    : note,
                ),
              }
            : profile,
        ),
      );
    },
    [commit],
  );

  const value = useMemo(
    () => ({
      profiles,
      loading: !ready || !synced || employeesLoading,
      getById,
      addProfile,
      updateProfile,
      removeProfile,
      addProfileComment,
      updateProfileComment,
    }),
    [
      profiles,
      ready,
      synced,
      employeesLoading,
      getById,
      addProfile,
      updateProfile,
      removeProfile,
      addProfileComment,
      updateProfileComment,
    ],
  );

  if (!ready) return null;

  return (
    <ProfilesContext.Provider value={value}>{children}</ProfilesContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useProfiles() {
  const context = useContext(ProfilesContext);
  if (!context) {
    throw new Error('useProfiles must be used within ProfilesProvider');
  }
  return context;
}
