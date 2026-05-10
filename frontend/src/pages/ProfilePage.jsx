import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import LoadingButton from '../components/LoadingButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/profile').then((res) => setProfile(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user.role === 'customer') {
        await api.put('/profile/customer', {
          name: profile.name,
          phone: profile.phone
        });
      }
      if (user.role === 'vendor') {
        await api.put('/profile/vendor', {
          businessName: profile.business_name,
          ownerName: profile.owner_name,
          phone: profile.phone,
          serviceCategory: profile.service_category,
          city: profile.city
        });
      }
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <main className="p-10 text-center font-black">Loading profile...</main>;
  }

  if (user.role === 'admin') {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <section className="rounded-2xl bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-black">Admin Profile</h1>
          <p className="mt-2 text-slate-600">{user.email}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-black">Profile</h1>
        <div className="mt-6 grid gap-4">
          {user.role === 'customer' ? (
            <>
              <input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
              <input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
              <input value={profile.email || ''} disabled className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500" />
            </>
          ) : (
            <>
              <input value={profile.business_name || ''} onChange={(e) => setProfile({ ...profile, business_name: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
              <input value={profile.owner_name || ''} onChange={(e) => setProfile({ ...profile, owner_name: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
              <input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
              <input value={profile.service_category || ''} onChange={(e) => setProfile({ ...profile, service_category: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
              <input value={profile.city || ''} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
              <input value={profile.email || ''} disabled className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500" />
            </>
          )}
        </div>
        <LoadingButton loading={loading} className="mt-6">Save changes</LoadingButton>
      </form>
    </main>
  );
};

export default ProfilePage;
