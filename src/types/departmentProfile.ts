import {
  normalizeCharacterizations,
  normalizeProjectAssignments,
  type CharacterizationNote,
  type Employee,
  type ProjectAssignment,
} from './employee';

export interface DepartmentProfile {
  id: string;
  sourceEmployeeId: string | null;
  firstName: string;
  lastName: string;
  projectAssignments: ProjectAssignment[];
  leadName: string;
  characterizations: CharacterizationNote[];
  createdAt: number;
}

export interface DepartmentProfileInput {
  firstName: string;
  lastName: string;
}

export function createDepartmentProfile(
  input: DepartmentProfileInput,
): DepartmentProfile {
  return {
    id: crypto.randomUUID(),
    sourceEmployeeId: null,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    projectAssignments: [],
    leadName: '',
    characterizations: [],
    createdAt: Date.now(),
  };
}

export function profileFromEmployee(employee: Employee): DepartmentProfile {
  return {
    id: employee.id,
    sourceEmployeeId: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    projectAssignments: normalizeProjectAssignments(employee.projectAssignments),
    leadName: typeof employee.leadName === 'string' ? employee.leadName : '',
    characterizations: normalizeCharacterizations(employee.characterizations),
    createdAt: employee.createdAt,
  };
}

export function normalizeDepartmentProfiles(value: unknown): DepartmentProfile[] {
  let source: unknown = value;
  if (typeof value === 'string' && value.trim()) {
    try {
      source = JSON.parse(value) as unknown;
    } catch {
      return [];
    }
  }

  if (!Array.isArray(source)) return [];

  return source.flatMap((raw) => {
    if (!raw || typeof raw !== 'object') return [];
    const profile = raw as Record<string, unknown>;
    if (
      typeof profile.id !== 'string' ||
      typeof profile.firstName !== 'string' ||
      typeof profile.lastName !== 'string' ||
      typeof profile.createdAt !== 'number'
    ) {
      return [];
    }

    return [
      {
        id: profile.id,
        sourceEmployeeId:
          typeof profile.sourceEmployeeId === 'string'
            ? profile.sourceEmployeeId
            : null,
        firstName: profile.firstName,
        lastName: profile.lastName,
        projectAssignments: normalizeProjectAssignments(
          profile.projectAssignments,
        ),
        leadName: typeof profile.leadName === 'string' ? profile.leadName : '',
        characterizations: normalizeCharacterizations(profile.characterizations),
        createdAt: profile.createdAt,
      },
    ];
  });
}

function sameProfileIdentity(
  current: DepartmentProfile,
  next: DepartmentProfile,
): boolean {
  return (
    current.id === next.id &&
    current.sourceEmployeeId === next.sourceEmployeeId &&
    current.firstName === next.firstName &&
    current.lastName === next.lastName
  );
}

export function mergeTeamIntoProfiles(
  profiles: DepartmentProfile[],
  employees: Employee[],
): DepartmentProfile[] {
  const employeeIds = new Set(employees.map((employee) => employee.id));
  const kept = profiles.filter(
    (profile) =>
      !profile.sourceEmployeeId || employeeIds.has(profile.sourceEmployeeId),
  );
  const linkedIds = new Set(
    kept
      .map((profile) => profile.sourceEmployeeId)
      .filter((id): id is string => !!id),
  );

  const synced = kept.map((profile) => {
    if (!profile.sourceEmployeeId) return profile;
    const employee = employees.find(
      (item) => item.id === profile.sourceEmployeeId,
    );
    if (!employee) return profile;
    if (
      profile.firstName === employee.firstName &&
      profile.lastName === employee.lastName
    ) {
      return profile;
    }
    return {
      ...profile,
      firstName: employee.firstName,
      lastName: employee.lastName,
    };
  });

  const imported = employees
    .filter((employee) => !linkedIds.has(employee.id))
    .map((employee) => profileFromEmployee(employee));

  return [...synced, ...imported];
}

export function profilesMatch(
  current: DepartmentProfile[],
  next: DepartmentProfile[],
): boolean {
  if (current.length !== next.length) return false;
  return current.every((profile, index) =>
    sameProfileIdentity(profile, next[index]),
  );
}
