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
  deleteEmployee as dbDelete,
  exportBackup,
  getAllEmployees,
  importBackup,
  saveEmployee as dbSave,
  type MyTeamBackup,
} from '../db';
import {
  createEmployee,
  METRIC_MAX,
  normalizeEmployee,
  normalizeStringList,
  type Employee,
  type EmployeeMetric,
  type EmployeeProfileInput,
  type FeedbackType,
  type LeadershipStyle,
  type NeedKey,
  type NeedMark,
} from '../types/employee';

interface EmployeesContextValue {
  employees: Employee[];
  loading: boolean;
  addEmployee: (profile: EmployeeProfileInput) => Promise<Employee>;
  updateEmployeeProfile: (id: string, profile: EmployeeProfileInput) => void;
  removeEmployee: (id: string) => Promise<void>;
  getById: (id: string) => Employee | undefined;
  updateNeedPercent: (id: string, need: NeedKey, delta: number) => void;
  updateNeedMark: (id: string, need: NeedKey, mark: NeedMark) => void;
  updateNeedComment: (id: string, need: NeedKey, comment: string) => void;
  addMetrics: (id: string, metrics: EmployeeMetric[]) => void;
  removeMetric: (id: string, metricId: string) => void;
  updateMetricValue: (id: string, metricId: string, delta: number) => void;
  updateMetricComment: (id: string, metricId: string, comment: string) => void;
  updateLeadershipStyle: (id: string, style: LeadershipStyle) => void;
  updateOneToOnePrep: (id: string, prep: string) => void;
  updateOneToOneAfter: (id: string, notes: string) => void;
  addOneToOneQuestion: (id: string, text: string) => void;
  updateOneToOneQuestion: (id: string, questionId: string, text: string) => void;
  updateOneToOneQuestionAnswer: (id: string, questionId: string, answer: string) => void;
  removeOneToOneQuestion: (id: string, questionId: string) => void;
  addOneToOneNote: (id: string, text: string) => void;
  updateOneToOneNote: (id: string, noteId: string, text: string) => void;
  addDelegationNote: (id: string, text: string) => void;
  updateDelegationNote: (id: string, noteId: string, text: string) => void;
  updateFeedbackType: (id: string, type: FeedbackType) => void;
  updateFeedbackNotes: (id: string, notes: string) => void;
  exportDatabase: () => Promise<void>;
  importDatabase: (file: File) => Promise<void>;
}

const EmployeesContext = createContext<EmployeesContextValue | null>(null);

export function EmployeesProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEmployees()
      .then((list) => setEmployees(list.map(normalizeEmployee)))
      .finally(() => setLoading(false));
  }, []);

  const commitEmployee = useCallback((employee: Employee) => {
    setEmployees((prev) => {
      const idx = prev.findIndex((e) => e.id === employee.id);
      if (idx === -1) {
        return [...prev, employee].sort((a, b) => a.createdAt - b.createdAt);
      }
      const next = [...prev];
      next[idx] = employee;
      return next;
    });
    void dbSave(employee);
  }, []);

  const updateEmployee = useCallback(
    (id: string, updater: (employee: Employee) => Employee) => {
      let nextEmployee: Employee | undefined;
      setEmployees((prev) => {
        const current = prev.find((e) => e.id === id);
        if (!current) return prev;
        nextEmployee = updater(current);
        return prev.map((e) => (e.id === id ? nextEmployee! : e));
      });
      if (nextEmployee) {
        void dbSave(nextEmployee);
      }
    },
    [],
  );

  const addEmployee = useCallback(
    async (profile: EmployeeProfileInput) => {
      const employee = createEmployee(profile);
      commitEmployee(employee);
      return employee;
    },
    [commitEmployee],
  );

  const updateEmployeeProfile = useCallback(
    (id: string, profile: EmployeeProfileInput) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        projects: normalizeStringList(profile.projects),
        projectManagers: normalizeStringList(profile.projectManagers),
      }));
    },
    [updateEmployee],
  );

  const removeEmployee = useCallback(async (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    await dbDelete(id);
  }, []);

  const getById = useCallback(
    (id: string) => employees.find((e) => e.id === id),
    [employees],
  );

  const updateNeedPercent = useCallback(
    (id: string, need: NeedKey, delta: number) => {
      updateEmployee(id, (employee) => {
        const current = employee.needs[need].percent;
        const usedOthers = Object.entries(employee.needs)
          .filter(([key]) => key !== need)
          .reduce((sum, [, value]) => sum + value.percent, 0);
        const maxAllowed = 100 - usedOthers;
        const nextPercent = Math.min(maxAllowed, Math.max(0, current + delta));
        return {
          ...employee,
          needs: {
            ...employee.needs,
            [need]: { ...employee.needs[need], percent: nextPercent },
          },
        };
      });
    },
    [updateEmployee],
  );

  const updateNeedMark = useCallback(
    (id: string, need: NeedKey, mark: NeedMark) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        needs: {
          ...employee.needs,
          [need]: { ...employee.needs[need], mark },
        },
      }));
    },
    [updateEmployee],
  );

  const updateNeedComment = useCallback(
    (id: string, need: NeedKey, comment: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        needs: {
          ...employee.needs,
          [need]: { ...employee.needs[need], comment },
        },
      }));
    },
    [updateEmployee],
  );

  const addMetrics = useCallback(
    (id: string, metrics: EmployeeMetric[]) => {
      if (metrics.length === 0) return;
      updateEmployee(id, (employee) => ({
        ...employee,
        metrics: [...employee.metrics, ...metrics],
      }));
    },
    [updateEmployee],
  );

  const removeMetric = useCallback(
    (id: string, metricId: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        metrics: employee.metrics.filter((metric) => metric.id !== metricId),
      }));
    },
    [updateEmployee],
  );

  const updateMetricValue = useCallback(
    (id: string, metricId: string, delta: number) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        metrics: employee.metrics.map((metric) => {
          if (metric.id !== metricId) return metric;
          return {
            ...metric,
            value: Math.min(METRIC_MAX, Math.max(0, metric.value + delta)),
          };
        }),
      }));
    },
    [updateEmployee],
  );

  const updateMetricComment = useCallback(
    (id: string, metricId: string, comment: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        metrics: employee.metrics.map((metric) =>
          metric.id === metricId ? { ...metric, comment } : metric,
        ),
      }));
    },
    [updateEmployee],
  );

  const updateLeadershipStyle = useCallback(
    (id: string, style: LeadershipStyle) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        leadershipStyle: style,
      }));
    },
    [updateEmployee],
  );

  const updateOneToOnePrep = useCallback(
    (id: string, prep: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        oneToOnePrep: prep,
      }));
    },
    [updateEmployee],
  );

  const updateOneToOneAfter = useCallback(
    (id: string, notes: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        oneToOneAfter: notes,
      }));
    },
    [updateEmployee],
  );

  const addOneToOneQuestion = useCallback(
    (id: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      updateEmployee(id, (employee) => ({
        ...employee,
        oneToOneQuestions: [
          ...(employee.oneToOneQuestions ?? []),
          {
            id: crypto.randomUUID(),
            text: trimmed,
            answer: '',
            createdAt: Date.now(),
          },
        ],
      }));
    },
    [updateEmployee],
  );

  const updateOneToOneQuestion = useCallback(
    (id: string, questionId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      updateEmployee(id, (employee) => ({
        ...employee,
        oneToOneQuestions: (employee.oneToOneQuestions ?? []).map((question) =>
          question.id === questionId ? { ...question, text: trimmed } : question,
        ),
      }));
    },
    [updateEmployee],
  );

  const updateOneToOneQuestionAnswer = useCallback(
    (id: string, questionId: string, answer: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        oneToOneQuestions: (employee.oneToOneQuestions ?? []).map((question) =>
          question.id === questionId ? { ...question, answer } : question,
        ),
      }));
    },
    [updateEmployee],
  );

  const removeOneToOneQuestion = useCallback(
    (id: string, questionId: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        oneToOneQuestions: (employee.oneToOneQuestions ?? []).filter(
          (question) => question.id !== questionId,
        ),
      }));
    },
    [updateEmployee],
  );

  const addOneToOneNote = useCallback(
    (id: string, text: string) => {
      const now = Date.now();
      updateEmployee(id, (employee) => ({
        ...employee,
        oneToOneNotes: [
          {
            id: crypto.randomUUID(),
            text,
            createdAt: now,
            updatedAt: now,
          },
          ...employee.oneToOneNotes,
        ],
      }));
    },
    [updateEmployee],
  );

  const updateOneToOneNote = useCallback(
    (id: string, noteId: string, text: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        oneToOneNotes: employee.oneToOneNotes.map((note) =>
          note.id === noteId
            ? { ...note, text, updatedAt: Date.now() }
            : note,
        ),
      }));
    },
    [updateEmployee],
  );

  const addDelegationNote = useCallback(
    (id: string, text: string) => {
      const now = Date.now();
      updateEmployee(id, (employee) => ({
        ...employee,
        delegationNotes: [
          {
            id: crypto.randomUUID(),
            text,
            createdAt: now,
            updatedAt: now,
          },
          ...employee.delegationNotes,
        ],
      }));
    },
    [updateEmployee],
  );

  const updateDelegationNote = useCallback(
    (id: string, noteId: string, text: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        delegationNotes: employee.delegationNotes.map((note) =>
          note.id === noteId
            ? { ...note, text, updatedAt: Date.now() }
            : note,
        ),
      }));
    },
    [updateEmployee],
  );

  const updateFeedbackType = useCallback(
    (id: string, type: FeedbackType) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        feedbackType: type,
      }));
    },
    [updateEmployee],
  );

  const updateFeedbackNotes = useCallback(
    (id: string, notes: string) => {
      updateEmployee(id, (employee) => ({
        ...employee,
        feedbackNotes: notes,
      }));
    },
    [updateEmployee],
  );

  const exportDatabase = useCallback(async () => {
    const backup = await exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    link.href = url;
    link.download = `myteam-backup-${stamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const importDatabase = useCallback(async (file: File) => {
    const raw = await file.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Файл не является корректным JSON');
    }

    const backup = parsed as MyTeamBackup;
    if (
      !backup ||
      backup.version !== 1 ||
      !Array.isArray(backup.employees) ||
      !Array.isArray(backup.settings)
    ) {
      throw new Error('Неверный формат файла резервной копии MyTeam');
    }

    const employeesNormalized = backup.employees.map((employee) =>
      normalizeEmployee(employee),
    );

    await importBackup({
      ...backup,
      employees: employeesNormalized,
    });

    setEmployees(employeesNormalized);
  }, []);

  const value = useMemo(
    () => ({
      employees,
      loading,
      addEmployee,
      updateEmployeeProfile,
      removeEmployee,
      getById,
      updateNeedPercent,
      updateNeedMark,
      updateNeedComment,
      addMetrics,
      removeMetric,
      updateMetricValue,
      updateMetricComment,
      updateLeadershipStyle,
      updateOneToOnePrep,
      updateOneToOneAfter,
      addOneToOneQuestion,
      updateOneToOneQuestion,
      updateOneToOneQuestionAnswer,
      removeOneToOneQuestion,
      addOneToOneNote,
      updateOneToOneNote,
      addDelegationNote,
      updateDelegationNote,
      updateFeedbackType,
      updateFeedbackNotes,
      exportDatabase,
      importDatabase,
    }),
    [
      employees,
      loading,
      addEmployee,
      updateEmployeeProfile,
      removeEmployee,
      getById,
      updateNeedPercent,
      updateNeedMark,
      updateNeedComment,
      addMetrics,
      removeMetric,
      updateMetricValue,
      updateMetricComment,
      updateLeadershipStyle,
      updateOneToOnePrep,
      updateOneToOneAfter,
      addOneToOneQuestion,
      updateOneToOneQuestion,
      updateOneToOneQuestionAnswer,
      removeOneToOneQuestion,
      addOneToOneNote,
      updateOneToOneNote,
      addDelegationNote,
      updateDelegationNote,
      updateFeedbackType,
      updateFeedbackNotes,
      exportDatabase,
      importDatabase,
    ],
  );

  return (
    <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeesContext);
  if (!ctx) {
    throw new Error('useEmployees must be used within EmployeesProvider');
  }
  return ctx;
}
