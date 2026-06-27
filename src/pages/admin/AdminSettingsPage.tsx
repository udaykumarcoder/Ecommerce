import { Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Seo } from '../../components/common/Seo';

export function AdminSettingsPage() {
  const [storeName, setStoreName] = useState(localStorage.getItem('saif-setting-store') ?? 'SaifElectronics');
  const [deliveryArea, setDeliveryArea] = useState(localStorage.getItem('saif-setting-area') ?? 'Dubai only');
  const [phone, setPhone] = useState(localStorage.getItem('saif-setting-phone') ?? '+91 9441919023');

  function save() {
    localStorage.setItem('saif-setting-store', storeName);
    localStorage.setItem('saif-setting-area', deliveryArea);
    localStorage.setItem('saif-setting-phone', phone);
    toast.success('Settings saved');
  }

  return (
    <>
      <Seo title="Admin Settings | SaifElectronics" description="Manage SaifElectronics settings." />
      <div className="mb-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-slate-500">Operational store settings for admins.</p></div>
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <label className="block text-sm font-semibold">Store Name<input value={storeName} onChange={(event) => setStoreName(event.target.value)} className="input mt-2" /></label>
        <label className="mt-4 block text-sm font-semibold">Delivery Area<input value={deliveryArea} onChange={(event) => setDeliveryArea(event.target.value)} className="input mt-2" /></label>
        <label className="mt-4 block text-sm font-semibold">Phone Number<input value={phone} onChange={(event) => setPhone(event.target.value)} className="input mt-2" /></label>
        <button onClick={save} className="mt-5 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 font-semibold text-white"><Save size={18} /> Save Settings</button>
      </div>
    </>
  );
}
