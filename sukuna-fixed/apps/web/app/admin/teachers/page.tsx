'use client';

import { useEffect, useState, FormEvent } from 'react';
import { apiClient } from '@/services/api-client';
import { getErrorMessage } from '@/lib/api-error';
import { toast } from 'sonner';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/admin/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/admin/ui/alert-dialog';

type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

interface TeacherUser {
  _id: string;
  name: string;
  phone: string;
  status: UserStatus;
  avatar?: string;
}

interface TeacherRecord {
  _id: string;
  teacherId: string;
  subjects: string[];
  assignedClasses: { grade: string; section: string }[];
  userId: TeacherUser | null;
}

interface TeacherFormState {
  name: string;
  phone: string;
  teacherId: string;
  subjects: string; // comma-separated in the form, split into an array on submit
  status: UserStatus;
}

const emptyForm: TeacherFormState = {
  name: '',
  phone: '',
  teacherId: '',
  subjects: '',
  status: 'ACTIVE',
};

interface TeachersListResponse {
  teachers: TeacherRecord[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

function parseSubjects(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [dialogMode, setDialogMode] = useState<'closed' | 'add' | 'edit'>('closed');
  const [form, setForm] = useState<TeacherFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [archiveTarget, setArchiveTarget] = useState<TeacherRecord | null>(null);
  const [archiving, setArchiving] = useState(false);

  async function fetchTeachers() {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get<TeachersListResponse>(`/admin/teachers?page=${page}&search=${encodeURIComponent(search)}`);
      setTeachers(response.teachers);
      setTotalPages(response.pagination.totalPages);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch teachers'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchTeachers();
  }

  function openAddDialog() {
    setForm(emptyForm);
    setEditingId(null);
    setDialogMode('add');
  }

  function openEditDialog(teacher: TeacherRecord) {
    setForm({
      name: teacher.userId?.name || '',
      phone: teacher.userId?.phone || '',
      teacherId: teacher.teacherId || '',
      subjects: (teacher.subjects || []).join(', '),
      status: teacher.userId?.status || 'ACTIVE',
    });
    setEditingId(teacher._id);
    setDialogMode('edit');
  }

  function closeDialog() {
    if (saving) return;
    setDialogMode('closed');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (dialogMode === 'add') {
        await apiClient.post('/admin/teachers', {
          name: form.name,
          phone: form.phone,
          teacherId: form.teacherId,
          subjects: parseSubjects(form.subjects),
        });
        toast.success('Teacher added');
      } else if (dialogMode === 'edit' && editingId) {
        await apiClient.patch(`/admin/teachers/${editingId}`, {
          name: form.name,
          phone: form.phone,
          teacherId: form.teacherId,
          subjects: parseSubjects(form.subjects),
          status: form.status,
        });
        toast.success('Teacher updated');
      }
      setDialogMode('closed');
      await fetchTeachers();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to save teacher'));
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      await apiClient.delete(`/admin/teachers/${archiveTarget._id}`);
      toast.success('Teacher archived');
      setArchiveTarget(null);
      await fetchTeachers();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to archive teacher'));
    } finally {
      setArchiving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1D1D1F] tracking-tight">Teachers</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchTeachers()}
            disabled={loading}
            className="text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] disabled:opacity-50 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={openAddDialog}
            className="bg-[#007AFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            + Add Teacher
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB]">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="flex-1 max-w-sm px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1D1D1F]">
            <thead className="bg-[#F8FAFC] text-[#6E6E73] text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Teacher ID</th>
                <th className="px-6 py-4">Subjects</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6E6E73]">Loading teachers...</td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6E6E73]">No teachers found.</td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                        {teacher.userId?.name?.charAt(0) || 'T'}
                      </div>
                      {teacher.userId?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">{teacher.teacherId}</td>
                    <td className="px-6 py-4">
                      {teacher.subjects && teacher.subjects.length > 0 
                        ? teacher.subjects.join(', ') 
                        : 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">{teacher.userId?.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.userId?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                        teacher.userId?.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {teacher.userId?.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button onClick={() => openEditDialog(teacher)} className="text-[#007AFF] hover:underline text-sm font-medium">
                          Edit
                        </button>
                        {teacher.userId?.status !== 'INACTIVE' && (
                          <button onClick={() => setArchiveTarget(teacher)} className="text-red-500 hover:underline text-sm font-medium">
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-sm text-[#6E6E73]">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogMode !== 'closed'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>{dialogMode === 'add' ? 'Add Teacher' : 'Edit Teacher'}</DialogTitle>
              <DialogDescription>
                {dialogMode === 'add'
                  ? 'Create a new teacher account for this school.'
                  : "Update this teacher's details."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="teacher-name">Full name</Label>
                <Input
                  id="teacher-name"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="teacher-phone">Phone</Label>
                <Input
                  id="teacher-phone"
                  required
                  minLength={10}
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="teacher-id">Teacher ID</Label>
                <Input
                  id="teacher-id"
                  required
                  value={form.teacherId}
                  onChange={(e) => setForm((f) => ({ ...f, teacherId: e.target.value }))}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="teacher-subjects">Subjects</Label>
                <Input
                  id="teacher-subjects"
                  placeholder="Math, Physics, Chemistry"
                  value={form.subjects}
                  onChange={(e) => setForm((f) => ({ ...f, subjects: e.target.value }))}
                />
                <p className="text-xs text-[#6E6E73]">Comma-separated list of subjects.</p>
              </div>
              {dialogMode === 'edit' && (
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="teacher-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm((f) => ({ ...f, status: v as UserStatus }))}
                  >
                    <SelectTrigger id="teacher-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : dialogMode === 'add' ? 'Add Teacher' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation */}
      <AlertDialog open={!!archiveTarget} onOpenChange={(open) => !open && !archiving && setArchiveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {archiveTarget?.userId?.name || 'this teacher'}?</AlertDialogTitle>
            <AlertDialogDescription>
              This marks the teacher&apos;s account as inactive. They will no longer be able to sign in, but their records are preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              disabled={archiving}
              className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/20"
            >
              {archiving ? 'Archiving...' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
