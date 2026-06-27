import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Seo } from '../../components/common/Seo';
import { adminDeleteCategory, adminListCategories, adminSaveCategory } from '../../services/adminCatalog';
import type { Category } from '../../types';

const schema = z.object({ name: z.string().min(2), slug: z.string().min(2), image: z.string().url(), description: z.string().min(5) });
type Values = z.infer<typeof schema>;

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: '', slug: '', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80', description: '' } });
  const load = () => adminListCategories().then(setCategories);
  useEffect(() => { load(); }, []);

  async function onSubmit(values: Values) {
    await adminSaveCategory({ id: editing ?? crypto.randomUUID(), ...values, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    toast.success('Category saved');
    setEditing(null); reset({ name: '', slug: '', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80', description: '' }); load();
  }

  return (
    <>
      <Seo title="Admin Categories | SaifElectronics" description="Manage SaifElectronics categories." />
      <div className="mb-6"><h1 className="text-2xl font-bold">Categories</h1><p className="text-slate-500">Create and manage catalog categories.</p></div>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <label className="block text-sm font-semibold">Name<input {...register('name')} onBlur={(event) => setValue('slug', event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))} className="input mt-2" />{errors.name ? <span className="text-xs text-rose-600">{errors.name.message}</span> : null}</label>
          <label className="mt-4 block text-sm font-semibold">Slug<input {...register('slug')} className="input mt-2" />{errors.slug ? <span className="text-xs text-rose-600">{errors.slug.message}</span> : null}</label>
          <label className="mt-4 block text-sm font-semibold">Image URL<input {...register('image')} className="input mt-2" />{errors.image ? <span className="text-xs text-rose-600">{errors.image.message}</span> : null}</label>
          <label className="mt-4 block text-sm font-semibold">Description<textarea {...register('description')} rows={4} className="input mt-2" />{errors.description ? <span className="text-xs text-rose-600">{errors.description.message}</span> : null}</label>
          <button disabled={isSubmitting} className="mt-5 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 font-semibold text-white"><Save size={18} /> {editing ? 'Update' : 'Save'} Category</button>
        </form>
        <div className="grid gap-4 sm:grid-cols-2">{categories.map((category) => <article key={category.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><img src={category.image} alt="" className="h-36 w-full object-cover" /><div className="p-4"><h2 className="font-bold">{category.name}</h2><p className="mt-1 text-sm text-slate-500">{category.description}</p><div className="mt-4 flex gap-2"><button onClick={() => { setEditing(category.id); reset(category); }} className="rounded-md border border-slate-300 p-2 dark:border-slate-700" aria-label="Edit category"><Edit size={16} /></button><button onClick={async () => { await adminDeleteCategory(category.id); toast.success('Category deleted'); load(); }} className="rounded-md border border-slate-300 p-2 text-rose-600 dark:border-slate-700" aria-label="Delete category"><Trash2 size={16} /></button></div></div></article>)}</div>
      </div>
    </>
  );
}
