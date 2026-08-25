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

interface StudentUser {
  _id: string;
  name: string;
  phone: string;
  status: UserStatus;
  avatar?: string;
}

interface StudentRecord {
  _id: string;
  studentId: string;
  grade: string;
  section: string;
  userId: StudentUser | null;
}

interface StudentFormState {
  name: string;
  phone: string;
  studentId: string;
  grade: string;
  section: string;
  status: UserStatus;
}

interface StudentsListResponse {
  students: StudentRecord[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

const emptyForm: StudentFormState = {
  name: '',
  phone: '',
  studentId: '',
  grade: '',
  section: '',
  status: 'ACTIVE',
};



export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [dialogMode, setDialogMode] = useState<'closed' | 'add' | 'edit'>('closed');
  const [form, setForm] = useState<StudentFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [archiveTarget, setArchiveTarget] = useState<StudentRecord | null>(null);
  const [archiving, setArchiving] = useState(false);

  async function fetchStudents() {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get<StudentsListResponse>(`/admin/students?page=${page}&search=${encodeURIComponent(search)}`);
      setStudents(response.students);
      setTotalPages(response.pagination.totalPages);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch students'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // refetch when page changes

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1); // reset to first page on search
    fetchStudents();
  }

  function openAddDialog() {
    setForm(emptyForm);
    setEditingId(null);
    setDialogMode('add');
  }

  function openEditDialog(student: StudentRecord) {
    setForm({
      name: student.userId?.name || '',
      phone: student.userId?.phone || '',
      studentId: student.studentId || '',
      grade: student.grade || '',
      section: student.section || '',
      status: student.userId?.status || 'ACTIVE',
    });
    setEditingId(student._id);
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
        await apiClient.post('/admin/students', {
          name: form.name,
          phone: form.phone,
          studentId: form.studentId,
          grade: form.grade,
          section: form.section,
        });
        toast.success('Student added');
      } else if (dialogMode === 'edit' && editingId) {
        await apiClient.patch(`/admin/students/${editingId}`, {
          name: form.name,
          phone: form.phone,
          studentId: form.studentId,
          grade: form.grade,
          section: form.section,
          status: form.status,
        });
        toast.success('Student updated');
      }
      setDialogMode('closed');
      await fetchStudents();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to save student'));
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      await apiClient.delete(`/admin/students/${archiveTarget._id}`);
      toast.success('Student archived');
      setArchiveTarget(null);
      await fetchStudents();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to archive student'));
    } finally {
      setArchiving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1D1D1F] tracking-tight">Students</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchStudents()}
            disabled={loading}
            className="text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] disabled:opacity-50 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={openAddDialog}
            className="bg-[#007AFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            + Add Student
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
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Grade & Section</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6E6E73]">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6E6E73]">No students found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                        {student.userId?.name?.charAt(0) || 'S'}
                      </div>
                      {student.userId?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">{student.studentId}</td>
                    <td className="px-6 py-4">{student.grade} - {student.section}</td>
                    <td className="px-6 py-4">{student.userId?.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.userId?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                        student.userId?.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {student.userId?.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button onClick={() => openEditDialog(student)} className="text-[#007AFF] hover:underline text-sm font-medium">
                          Edit
                        </button>
                        {student.userId?.status !== 'INACTIVE' && (
                          <button onClick={() => setArchiveTarget(student)} className="text-red-500 hover:underline text-sm font-medium">
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
              <DialogTitle>{dialogMode === 'add' ? 'Add Student' : 'Edit Student'}</DialogTitle>
              <DialogDescription>
                {dialogMode === 'add'
                  ? 'Create a new student account for this school.'
                  : "Update this student's details."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="student-name">Full name</Label>
                <Input
                  id="student-name"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="student-phone">Phone</Label>
                <Input
                  id="student-phone"
                  required
                  minLength={10}
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="student-id">Student ID</Label>
                <Input
                  id="student-id"
                  required
                  value={form.studentId}
                  onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="student-grade">Grade</Label>
                <Input
                  id="student-grade"
                  required
                  value={form.grade}
                  onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="student-section">Section</Label>
                <Input
                  id="student-section"
                  required
                  value={form.section}
                  onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                />
              </div>
              {dialogMode === 'edit' && (
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="student-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm((f) => ({ ...f, status: v as UserStatus }))}
                  >
                    <SelectTrigger id="student-status">
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
                {saving ? 'Saving...' : dialogMode === 'add' ? 'Add Student' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation */}
      <AlertDialog open={!!archiveTarget} onOpenChange={(open) => !open && !archiving && setArchiveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {archiveTarget?.userId?.name || 'this student'}?</AlertDialogTitle>
            <AlertDialogDescription>
              This marks the student&apos;s account as inactive. They will no longer be able to sign in, but their records are preserved.
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
