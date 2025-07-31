import { supabase } from './supabaseClient';
import type { Student, AbsensiRecord } from './dummyData';

// CRUD Student
export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase.from('students').select('*');
  if (error) throw error;
  return data as Student[];
}

export async function addStudent(student: Student) {
  const { error } = await supabase.from('students').insert([student]);
  if (error) throw error;
}

export async function updateStudent(student: Student) {
  const { error } = await supabase.from('students').update(student).eq('id', student.id);
  if (error) throw error;
}

export async function deleteStudent(id: number) {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
}

// CRUD Absensi
export async function fetchAbsensi(): Promise<AbsensiRecord[]> {
  const { data, error } = await supabase.from('absensi').select('*');
  if (error) throw error;
  return data as AbsensiRecord[];
}

export async function addAbsensi(absensi: AbsensiRecord) {
  const { error } = await supabase.from('absensi').insert([absensi]);
  if (error) throw error;
}

export async function updateAbsensi(absensi: AbsensiRecord) {
  const { error } = await supabase.from('absensi').update(absensi).eq('id', absensi.id);
  if (error) throw error;
}

export async function deleteAbsensi(id: number) {
  const { error } = await supabase.from('absensi').delete().eq('id', id);
  if (error) throw error;
}
