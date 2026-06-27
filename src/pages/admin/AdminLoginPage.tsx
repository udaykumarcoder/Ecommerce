import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Seo } from '../../components/common/Seo';
import { useAuth } from '../../contexts/AuthContext';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginValues = z.infer<typeof schema>;

export function AdminLoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: 'admin@saifelectronics.com', password: 'password' } });

  if (user) return <Navigate to="/admin" replace />;

  async function onSubmit(values: LoginValues) {
    setSubmitting(true);
    try {
      await signIn(values.email, values.password);
      toast.success('Logged in');
      navigate((location.state as { from?: Location })?.from?.pathname ?? '/admin');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid min-h-screen place-items-center bg-slate-100 px-4 dark:bg-slate-950">
      <Seo title="Admin Login | SaifElectronics" description="SaifElectronics admin login." />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-600 text-white"><Lock size={20} aria-hidden="true" /></span>
          <div>
            <h1 className="text-xl text-white font-bold">Admin Login</h1>
            <p className="text-sm text-slate-500">Manage SaifElectronics catalog</p>
          </div>
        </div>
        <label className="block text-sm text-white font-semibold">Email
          <input {...register('email')} className="mt-2 w-full text-white rounded-md border border-slate-300 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950" />
          {errors.email ? <span className="mt-1 block text-xs text-rose-600">{errors.email.message}</span> : null}
        </label>
        <label className="mt-4 block text-sm text-white font-semibold">Password
          <input type="password" {...register('password')} className="mt-2 w-full text-white rounded-md border border-slate-300 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950" />
          {errors.password ? <span className="mt-1 block text-xs text-rose-600">{errors.password.message}</span> : null}
        </label>
        <button disabled={submitting} className="mt-6 w-full rounded-md bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-60">{submitting ? 'Signing in...' : 'Login'}</button>
      </form>
    </section>
  );
}
