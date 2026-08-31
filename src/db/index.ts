import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Employee } from '../types/employee';

interface MyTeamDB extends DBSchema {
  employees: {
    key: string;
    value: Employee;
    indexes: { 'by-createdAt': number };
  };
  settings: {
    key: string;
    value: { key: string; value: string };
  };
}

export interface MyTeamBackup {
  version: 1;
  exportedAt: string;
  employees: Employee[];
  settings: { key: string; value: string }[];
}

const DB_NAME = 'myteam-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MyTeamDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<MyTeamDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          const store = db.createObjectStore('employees', { keyPath: 'id' });
          store.createIndex('by-createdAt', 'createdAt');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllEmployees(): Promise<Employee[]> {
  const db = await getDB();
  return db.getAllFromIndex('employees', 'by-createdAt');
}

export async function getEmployee(id: string): Promise<Employee | undefined> {
  const db = await getDB();
  return db.get('employees', id);
}

export async function saveEmployee(employee: Employee): Promise<void> {
  const db = await getDB();
  await db.put('employees', employee);
}

export async function deleteEmployee(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('employees', id);
}

export async function getThemeSetting(): Promise<'light' | 'dark'> {
  const db = await getDB();
  const row = await db.get('settings', 'theme');
  return row?.value === 'dark' ? 'dark' : 'light';
}

export async function saveThemeSetting(theme: 'light' | 'dark'): Promise<void> {
  const db = await getDB();
  await db.put('settings', { key: 'theme', value: theme });
}

export async function exportBackup(): Promise<MyTeamBackup> {
  const db = await getDB();
  const employees = await db.getAllFromIndex('employees', 'by-createdAt');
  const settings = await db.getAll('settings');

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    employees,
    settings,
  };
}

export async function importBackup(backup: MyTeamBackup): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['employees', 'settings'], 'readwrite');

  await tx.objectStore('employees').clear();
  await tx.objectStore('settings').clear();

  for (const employee of backup.employees) {
    await tx.objectStore('employees').put(employee);
  }
  for (const setting of backup.settings) {
    await tx.objectStore('settings').put(setting);
  }

  await tx.done;
}
