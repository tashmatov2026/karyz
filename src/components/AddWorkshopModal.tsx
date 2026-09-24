import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Building, Phone, User, AlertCircle } from 'lucide-react';

interface AddWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWorkshopModal: React.FC<AddWorkshopModalProps> = ({ isOpen, onClose }) => {
  const { addWorkshop } = useApp();

  const [name, setName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setLeaderName('');
      setPhone('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Цехтин атын киргизиңиз');
      return;
    }

    addWorkshop({
      name: name.trim(),
      leaderName: leaderName.trim(),
      phone: phone.trim(),
    });

    setName('');
    setLeaderName('');
    setPhone('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header: ЖАҢЫ ЦЕХ КОШУУ */}
        <div className="bg-[#1e293b] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                ЖАҢЫ ЦЕХ КОШУУ
              </h2>
              <p className="text-xs text-slate-400">Өзүңүздүн жаңы цехиңизди киргизиңиз</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-red-600 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Workshop Name: Цехтин аты */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-600" />
              Цехтин аты
            </label>
            <input
              id="workshop-name-input"
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Цехтин атын жазыңыз..."
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Leader: Жетекчиси */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Жетекчиси
            </label>
            <input
              id="workshop-leader-input"
              type="text"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              placeholder="Жетекчинин аты-жөнү..."
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Phone: Телефон */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Телефон
            </label>
            <input
              id="workshop-phone-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Телефон номери..."
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Action buttons: [ Жокко чыгаруу ] [ САКТОО ] */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Жокко чыгаруу
            </button>
            <button
              id="save-workshop-btn"
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95 uppercase tracking-wider cursor-pointer"
            >
              [ САКТОО ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

