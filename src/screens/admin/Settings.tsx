// src/screens/Admin/Settings.tsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Button } from '../../components/ui/button';
import { Save} from 'lucide-react';

interface SalonSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  openingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  bookingSettings: {
    maxAdvanceBookingDays: number;
    minAdvanceBookingHours: number;
    cancellationPolicyHours: number;
  };
}

export const AdminSettings = () => {
  const [settings, setSettings] = useState<SalonSettings>({
    businessName: 'Choppers Salon',
    email: 'info@choppers.com',
    phone: '(123) 456-7890',
    address: '123 Salon Street, Beauty District, City, 10001',
    openingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true },
    },
    bookingSettings: {
      maxAdvanceBookingDays: 30,
      minAdvanceBookingHours: 24,
      cancellationPolicyHours: 24,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'salon'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as SalonSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'salon'), settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black"
        >
          <Save size={18} className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Business Information */}
        <div className="bg-gray-800 p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-gray-800 p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
          <div className="space-y-4">
            {Object.entries(settings.openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-32 capitalize font-medium">{day}</div>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={!hours.closed}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        openingHours: {
                          ...settings.openingHours,
                          [day]: { ...hours, closed: !e.target.checked }
                        }
                      });
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Open</span>
                </div>
                {!hours.closed && (
                  <>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          openingHours: {
                            ...settings.openingHours,
                            [day]: { ...hours, open: e.target.value }
                          }
                        });
                      }}
                      className="p-1 bg-gray-700 border border-gray-600 text-white"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          openingHours: {
                            ...settings.openingHours,
                            [day]: { ...hours, close: e.target.value }
                          }
                        });
                      }}
                      className="p-1 bg-gray-700 border border-gray-600 text-white"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Settings */}
        <div className="bg-gray-800 p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Booking Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Max Advance Booking (days)</label>
              <input
                type="number"
                value={settings.bookingSettings.maxAdvanceBookingDays}
                onChange={(e) => setSettings({
                  ...settings,
                  bookingSettings: {
                    ...settings.bookingSettings,
                    maxAdvanceBookingDays: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Min Advance Booking (hours)</label>
              <input
                type="number"
                value={settings.bookingSettings.minAdvanceBookingHours}
                onChange={(e) => setSettings({
                  ...settings,
                  bookingSettings: {
                    ...settings.bookingSettings,
                    minAdvanceBookingHours: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cancellation Policy (hours)</label>
              <input
                type="number"
                value={settings.bookingSettings.cancellationPolicyHours}
                onChange={(e) => setSettings({
                  ...settings,
                  bookingSettings: {
                    ...settings.bookingSettings,
                    cancellationPolicyHours: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};