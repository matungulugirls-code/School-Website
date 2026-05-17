'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiKey,
  FiRefreshCw,
  FiShield,
  FiUser,
} from 'react-icons/fi';
import { toast } from 'sonner';

const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('auth_token') ||
    localStorage.getItem('jwt_token');
};

const formatDate = (date) => {
  if (!date) return 'Not available';
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function StudentPasswordRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [activePassword, setActivePassword] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const stats = useMemo(() => ({
    pending: requests.filter(item => item.status === 'pending').length,
    resolved: requests.filter(item => item.status === 'resolved').length,
    total: requests.length,
  }), [requests]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const response = await fetch(`/api/student-password-reset?status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to load requests');
      setRequests(data.requests || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load password requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const issueTemporaryPassword = async (requestId) => {
    setBusyId(requestId);
    setActivePassword(null);
    try {
      const token = getAdminToken();
      const response = await fetch('/api/student-password-reset', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: requestId,
          action: 'issue-temporary-password'
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not issue password');
      setActivePassword({
        requestId,
        password: data.temporaryPassword
      });
      toast.success('Temporary password issued');
      await fetchRequests();
    } catch (error) {
      toast.error(error.message || 'Could not issue temporary password');
    } finally {
      setBusyId(null);
    }
  };

  const updateStatus = async (requestId, status) => {
    setBusyId(requestId);
    try {
      const token = getAdminToken();
      const response = await fetch('/api/student-password-reset', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: requestId, status })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not update request');
      toast.success('Request updated');
      await fetchRequests();
    } catch (error) {
      toast.error(error.message || 'Could not update request');
    } finally {
      setBusyId(null);
    }
  };

  const copyPassword = async (password) => {
    await navigator.clipboard.writeText(password);
    toast.success('Temporary password copied');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400" />
        <div className="bg-slate-950 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
                Student Portal Security
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">Password Requests</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Review student password-help requests and issue a new temporary password when identity has been verified.
              </p>
            </div>
            <button
              onClick={fetchRequests}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Pending', value: stats.pending, icon: FiClock },
          { label: 'Resolved', value: stats.resolved, icon: FiCheckCircle },
          { label: 'Total Loaded', value: stats.total, icon: FiShield },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Live</span>
            </div>
            <p className="mt-5 text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-1 text-sm font-bold text-slate-600">{label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">Request Queue</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">Student password assistance</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
            {['pending', 'resolved', 'all'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
                  statusFilter === status ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {activePassword && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-amber-900">Temporary password shown once</p>
                <p className="mt-1 font-mono text-lg font-black text-slate-950">{activePassword.password}</p>
              </div>
              <button
                onClick={() => copyPassword(activePassword.password)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white"
              >
                <FiCopy />
                Copy
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-48 items-center justify-center text-sm font-bold text-slate-500">
            Loading password requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <FiKey className="mx-auto text-4xl text-slate-300" />
            <p className="mt-3 text-sm font-black uppercase tracking-widest text-slate-500">No requests found</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {requests.map((request) => {
              const name = request.fullName || request.account?.fullName ||
                [request.student?.firstName, request.student?.middleName, request.student?.lastName].filter(Boolean).join(' ') ||
                'Student';

              return (
                <article key={request.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-800 shadow-sm">
                        <FiUser />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-slate-950">{name}</h3>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${
                            request.status === 'resolved'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-amber-200 bg-amber-50 text-amber-700'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-bold text-slate-600">ADM {request.admissionNumber}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {request.email || 'No email'} · {request.parentPhone || 'No phone'} · {formatDate(request.requestedAt)}
                        </p>
                        {request.message && (
                          <p className="mt-3 rounded-2xl bg-white p-3 text-sm text-slate-600">{request.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-[360px]">
                      <button
                        onClick={() => issueTemporaryPassword(request.id)}
                        disabled={busyId === request.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
                      >
                        <FiKey />
                        Issue Temporary
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, request.status === 'resolved' ? 'pending' : 'resolved')}
                        disabled={busyId === request.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                      >
                        <FiAlertCircle />
                        {request.status === 'resolved' ? 'Reopen' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
