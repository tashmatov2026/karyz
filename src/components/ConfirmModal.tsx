import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ConfirmModal: React.FC = () => {
  const { confirmModalState, closeConfirmModal } = useApp();

  if (!confirmModalState.isOpen) return null;

  const handleConfirm = () => {
    try {
      confirmModalState.onConfirm();
    } catch (e) {
      console.error('Confirm action error:', e);
    }
    closeConfirmModal();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-red-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  {confirmModalState.title || 'Өчүрүүнү ырастоо'}
                </h3>
                <button
                  onClick={closeConfirmModal}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                {confirmModalState.message}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeConfirmModal}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors active:scale-95 cursor-pointer"
            >
              {confirmModalState.cancelText || 'Жокко чыгаруу'}
            </button>
            <button
              type="button"
              id="modal-confirm-delete-btn"
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{confirmModalState.confirmText || 'Өчүрүү'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
