import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Save, Trash2, ShieldCheck, ExternalLink } from 'lucide-react';
import { saveApiKey, getApiKey, removeApiKey } from '../services/storageService';
import { GlassButton } from './GlassButton';

export const SettingsScreen: React.FC = () => {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentKey = getApiKey();
    if (currentKey) {
      setKey(currentKey);
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (key.trim().length > 10) {
      saveApiKey(key.trim());
      setSaved(true);
      alert("API Key berhasil disimpan di browser ini.");
    } else {
      alert("API Key tidak valid.");
    }
  };

  const handleDelete = () => {
    if (confirm("Hapus API Key? Anda tidak akan bisa membuat quiz baru.")) {
      removeApiKey();
      setKey('');
      setSaved(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <Key size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Konfigurasi API</h2>
            <p className="text-slate-500 text-sm">Kelola kunci akses AI Anda.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex items-start">
             <ShieldCheck size={18} className="mr-2 mt-0.5 shrink-0" />
             <p>
               <strong>Privasi Terjamin:</strong> API Key Anda hanya disimpan di <em>Local Storage</em> browser perangkat ini. 
               Kami tidak mengirimkannya ke server manapun selain Google AI.
             </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Google Gemini API Key</label>
            <div className="relative">
              <input 
                type="password" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center">
              Belum punya key? 
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline ml-1 flex items-center">
                Dapatkan disini <ExternalLink size={10} className="ml-1" />
              </a>
            </p>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-slate-200/50">
            <GlassButton onClick={handleSave} className="flex-1 flex items-center justify-center">
              <Save size={18} className="mr-2" />
              {saved ? "Update Key" : "Simpan Key"}
            </GlassButton>
            
            {saved && (
              <button 
                onClick={handleDelete}
                className="px-4 py-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                title="Hapus Key"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};