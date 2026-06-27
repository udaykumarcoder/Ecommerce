import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Seo } from '../../components/common/Seo';
import { adminListCategories, adminListProducts, adminSaveProduct, uploadProductImages } from '../../services/adminCatalog';
import type { Category, Product } from '../../types';

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  short_description: z.string().min(5),
  category_id: z.string().min(1),
  price: z.coerce.number().positive(),
  discount_price: z.coerce.number().nonnegative().optional().nullable(),
  stock: z.coerce.number().int().nonnegative(),
  sku: z.string().min(2),
  featured: z.boolean(),
  new_arrival: z.boolean(),
  best_seller: z.boolean(),
  status: z.enum(['active', 'draft']),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  tags: z.string().optional(),
  specifications: z.string().optional(),
  images: z.string().optional(),
});

type ProductFormValues = z.infer<typeof schema>;

const emptyValues: ProductFormValues = {
  title: '', slug: '', description: '', short_description: '', category_id: '', price: 0, discount_price: null, stock: 0, sku: '', featured: false, new_arrival: false, best_seller: false, status: 'active', seo_title: '', seo_description: '', tags: '', specifications: '', images: '',
};

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues });

  useEffect(() => {
    let mounted = true;
    Promise.all([adminListCategories(), id ? adminListProducts() : Promise.resolve([])])
      .then(([categoryData, productData]) => {
        if (!mounted) return;
        setCategories(categoryData);
        const firstCategory = categoryData[0]?.id ?? '';
        if (!id) setValue('category_id', firstCategory);
        if (id) {
          const product = productData.find((item) => item.id === id);
          if (!product) {
            toast.error('Product not found');
            navigate('/admin/products');
            return;
          }
          reset({ ...product, tags: product.tags.join(', '), specifications: JSON.stringify(product.specifications, null, 2), images: product.images.join('\n'), discount_price: product.discount_price ?? null });
          setImages(product.images);
        }
      })
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : 'Unable to load product form.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id, navigate, reset, setValue]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploadingImages(true);
    try {
      const urls = await uploadProductImages(Array.from(files));
      const next = [...images, ...urls];
      setImages(next);
      setValue('images', next.join('\n'));
      toast.success('Images compressed and uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploadingImages(false);
    }
  }

  async function onSubmit(values: ProductFormValues) {
    if (!categories.length) {
      toast.error('Create or import a category before saving products.');
      return;
    }
    const now = new Date().toISOString();
    let specs: Record<string, string> = {};
    try {
      specs = values.specifications ? JSON.parse(values.specifications) : {};
    } catch {
      toast.error('Specifications must be valid JSON');
      return;
    }
    const existing = id ? (await adminListProducts()).find((item) => item.id === id) : undefined;
    const product: Product = {
      id: id ?? crypto.randomUUID(),
      title: values.title,
      slug: values.slug,
      description: values.description,
      short_description: values.short_description,
      category_id: values.category_id,
      category: categories.find((category) => category.id === values.category_id),
      price: values.price,
      discount_price: values.discount_price || null,
      stock: values.stock,
      sku: values.sku,
      featured: values.featured,
      new_arrival: values.new_arrival,
      best_seller: values.best_seller,
      status: values.status,
      images: (values.images || images.join('\n')).split('\n').map((item) => item.trim()).filter(Boolean),
      specifications: specs,
      tags: values.tags?.split(',').map((item) => item.trim()).filter(Boolean) ?? [],
      seo_title: values.seo_title,
      seo_description: values.seo_description,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    try {
      await adminSaveProduct(product);
      toast.success('Product saved');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Product save failed');
    }
  }

  return (
    <>
      <Seo title={`${id ? 'Edit' : 'Add'} Product | SaifElectronics`} description="Manage SaifElectronics product." />
      <div className="mb-6"><h1 className="text-2xl font-bold">{id ? 'Edit Product' : 'Add Product'}</h1><p className="text-slate-500">Validated catalog form with Supabase categories and image upload.</p></div>
      {loading ? <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500 dark:border-slate-800 dark:bg-slate-900">Loading form...</p> : null}
      {!loading && !categories.length ? <p className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">No categories exist yet. Import the starter catalog or create a category first.</p> : null}
      {!loading && categories.length ? (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">
          <Field label="Product Name" error={errors.title?.message}><input {...register('title')} onBlur={(event) => setValue('slug', event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))} className="input" /></Field>
          <Field label="Slug" error={errors.slug?.message}><input {...register('slug')} className="input" /></Field>
          <Field label="Short Description" error={errors.short_description?.message}><input {...register('short_description')} className="input" /></Field>
          <Field label="Category" error={errors.category_id?.message}><select {...register('category_id')} className="input">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field>
          <Field label="Price" error={errors.price?.message}><input type="number" step="0.01" {...register('price')} className="input" /></Field>
          <Field label="Discount Price" error={errors.discount_price?.message}><input type="number" step="0.01" {...register('discount_price')} className="input" /></Field>
          <Field label="Stock Quantity" error={errors.stock?.message}><input type="number" {...register('stock')} className="input" /></Field>
          <Field label="SKU" error={errors.sku?.message}><input {...register('sku')} className="input" /></Field>
          <Field label="Description" error={errors.description?.message} wide><textarea {...register('description')} rows={4} className="input" /></Field>
          <Field label="Image URLs" wide><textarea {...register('images')} rows={4} className="input" placeholder="One image URL per line" /></Field>
          <div className="lg:col-span-2 rounded-md border border-dashed border-slate-300 p-5 text-center dark:border-slate-700">
            <ImagePlus className="mx-auto text-teal-600" aria-hidden="true" />
            <label className={`mt-2 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950 ${uploadingImages ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}>{uploadingImages ? 'Compressing...' : 'Upload images'}<input type="file" multiple accept="image/*" disabled={uploadingImages} className="sr-only" onChange={(event) => handleFiles(event.target.files)} /></label>
            {images.length ? <div className="mt-4 grid grid-cols-4 gap-3">{images.map((image) => <img key={image} src={image} alt="Preview" className="aspect-square rounded-md object-cover" />)}</div> : null}
          </div>
          <Field label="Tags"><input {...register('tags')} className="input" placeholder="baby camera, monitor" /></Field>
          <Field label="Status"><select {...register('status')} className="input"><option value="active">Active</option><option value="draft">Draft</option></select></Field>
          <Field label="SEO Title"><input {...register('seo_title')} className="input" /></Field>
          <Field label="SEO Description"><input {...register('seo_description')} className="input" /></Field>
          <Field label="Specifications JSON" wide><textarea {...register('specifications')} rows={4} className="input" placeholder='{"Warranty":"1 year"}' /></Field>
          <div className="flex flex-wrap gap-5 lg:col-span-2">{(['featured', 'new_arrival', 'best_seller'] as const).map((name) => <label key={name} className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" {...register(name)} /> {name.replace('_', ' ')}</label>)}</div>
          <div className="flex gap-3 lg:col-span-2"><button disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700"><Save size={18} aria-hidden="true" /> Save Product</button><button type="button" onClick={() => navigate('/admin/products')} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 font-semibold dark:border-slate-700"><Trash2 size={18} aria-hidden="true" /> Cancel</button></div>
        </form>
      ) : null}
    </>
  );
}

function Field({ label, error, children, wide }: { label: string; error?: string; children: React.ReactNode; wide?: boolean }) {
  return <label className={`block text-sm font-semibold ${wide ? 'lg:col-span-2' : ''}`}>{label}<div className="mt-2">{children}</div>{error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}</label>;
}
