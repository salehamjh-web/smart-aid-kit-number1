import React, { useState, useEffect } from 'react';
import { TopBar } from '../TopBar';
import { KitItem, AppContent } from '../../types';
import { CheckCircle2, AlertCircle, Plus, Trash2, Save, X, Edit2, AlertTriangle, Check, Minus } from 'lucide-react';

interface KitViewProps {
  onBack: () => void;
  content: AppContent;
}

export const KitView: React.FC<KitViewProps> = ({ onBack, content }) => {
  // State for inventory items
  const [items, setItems] = useState<KitItem[]>(() => {
    try {
      const saved = localStorage.getItem('smart-kit-inventory');
      const parsedItems = saved ? JSON.parse(saved) : content.default_kit;
      // Migration: ensure quantity exists for old data
      return parsedItems.map((item: any) => ({
        ...item,
        quantity: item.quantity !== undefined ? item.quantity : 1
      }));
    } catch (e) {
      return content.default_kit;
    }
  });

  // Notification State
  const [notification, setNotification] = useState<string | null>(null);
  
  // Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Sync items when language changes (content updates)
  useEffect(() => {
    setItems(currentItems => {
      return currentItems.map(item => {
        const defaultVersion = content.default_kit.find(d => d.id === item.id);
        if (defaultVersion) {
          return {
            ...item,
            name: defaultVersion.name,
            description: defaultVersion.description
          };
        }
        return item;
      });
    });
  }, [content]);

  // State for view mode and form data
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<KitItem | null>(null);

  useEffect(() => {
    localStorage.setItem('smart-kit-inventory', JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    setCurrentItem({
      id: Date.now().toString(),
      name: '',
      description: '',
      status: 'available',
      quantity: 1
    });
    setIsEditing(true);
  };

  const handleEditItem = (item: KitItem) => {
    setCurrentItem({ ...item });
    setIsEditing(true);
  };

  const requestDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems(prev => prev.filter(i => i.id !== itemToDelete));
      setNotification(content.ui.item_deleted);
      setItemToDelete(null);
    }
  };

  const handleSave = () => {
    if (!currentItem || !currentItem.name.trim()) return;
    
    setItems(prev => {
      const exists = prev.find(i => i.id === currentItem.id);
      if (exists) {
        return prev.map(i => i.id === currentItem.id ? currentItem : i);
      } else {
        return [...prev, currentItem];
      }
    });
    setIsEditing(false);
    setCurrentItem(null);
    setNotification(content.ui.changes_saved);
  };

  const statusColors = {
    available: 'bg-green-100 text-green-800 border-green-200',
    low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    expired: 'bg-red-100 text-red-800 border-red-200'
  };

  // --- RENDER FORM VIEW ---
  if (isEditing && currentItem) {
    return (
      <div className="h-full flex flex-col bg-slate-50">
        <TopBar title={currentItem.id.length > 5 ? content.ui.add_item : content.ui.edit} onBack={() => setIsEditing(false)} disclaimerText={content.ui.safety_disclaimer} />
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold text-slate-700 ml-2">{content.ui.item_name}</label>
            <input 
              type="text" 
              value={currentItem.name}
              onChange={e => setCurrentItem({...currentItem, name: e.target.value})}
              className="p-6 text-2xl rounded-2xl border-4 border-slate-600 bg-slate-700 text-white focus:border-blue-500 outline-none shadow-sm font-bold placeholder-slate-400"
              placeholder={content.ui.item_name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold text-slate-700 ml-2">{content.ui.description}</label>
            <textarea 
              value={currentItem.description}
              onChange={e => setCurrentItem({...currentItem, description: e.target.value})}
              className="p-6 text-xl rounded-2xl border-4 border-slate-600 bg-slate-700 text-white focus:border-blue-500 outline-none shadow-sm h-40 resize-none placeholder-slate-400"
              placeholder={content.ui.description}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold text-slate-700 ml-2">{content.ui.quantity}</label>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => setCurrentItem({...currentItem, quantity: Math.max(0, currentItem.quantity - 1)})} 
                className="h-16 w-16 rounded-xl bg-slate-200 flex items-center justify-center active:scale-95 shadow-sm border-b-4 border-slate-300"
              >
                <Minus size={32} />
              </button>
              <input
                type="number"
                value={currentItem.quantity}
                onChange={e => setCurrentItem({...currentItem, quantity: Math.max(0, parseInt(e.target.value) || 0)})}
                className="h-16 w-32 text-center text-3xl font-bold rounded-xl border-4 border-slate-200 bg-white text-slate-900 focus:border-blue-500 outline-none"
              />
              <button 
                type="button" 
                onClick={() => setCurrentItem({...currentItem, quantity: currentItem.quantity + 1})} 
                className="h-16 w-16 rounded-xl bg-slate-200 flex items-center justify-center active:scale-95 shadow-sm border-b-4 border-slate-300"
              >
                <Plus size={32} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold text-slate-700 ml-2">{content.ui.status}</label>
            <div className="grid grid-cols-3 gap-4">
              {(['available', 'low', 'expired'] as const).map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setCurrentItem({...currentItem, status})}
                  className={`p-4 sm:p-6 rounded-2xl border-4 font-bold capitalize flex flex-col items-center gap-2 transition-all active:scale-95 ${
                    currentItem.status === status 
                      ? (status === 'available' ? 'bg-green-600 text-white border-green-800 shadow-lg scale-105' : 
                         status === 'low' ? 'bg-yellow-400 text-black border-yellow-600 shadow-lg scale-105' : 
                         'bg-red-600 text-white border-red-800 shadow-lg scale-105')
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  {status === 'available' && <CheckCircle2 size={32} />}
                  {status === 'low' && <AlertTriangle size={32} />}
                  {status === 'expired' && <AlertCircle size={32} />}
                  {content.ui[status]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-200 grid grid-cols-2 gap-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <button 
            type="button"
            onClick={() => setIsEditing(false)}
            className="h-20 rounded-2xl font-bold text-xl bg-slate-200 text-slate-700 border-b-4 border-slate-300 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <X size={28} /> {content.ui.cancel}
          </button>
          <button 
            type="button"
            onClick={handleSave}
            disabled={!currentItem.name}
            className={`h-20 rounded-2xl font-bold text-xl text-white border-b-4 flex items-center justify-center gap-2 transition-all ${
              currentItem.name 
                ? 'bg-blue-600 border-blue-800 active:scale-95 shadow-lg' 
                : 'bg-slate-400 border-slate-500 opacity-50 cursor-not-allowed'
            }`}
          >
            <Save size={28} /> {content.ui.save}
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER LIST VIEW ---
  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      <TopBar title={content.ui.manage_kit} onBack={onBack} disclaimerText={content.ui.safety_disclaimer} />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
          {items.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-100 flex flex-col gap-4 relative group overflow-hidden">
              
              <div className="flex justify-between items-start">
                <div className="flex-1 rtl:pl-2 ltr:pr-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-slate-800 leading-tight">{item.name}</h3>
                    <div className="bg-slate-100 px-3 py-1 rounded-lg text-lg font-bold text-slate-600 border border-slate-200 whitespace-nowrap ml-2 rtl:mr-2 rtl:ml-0">
                       x {item.quantity}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[item.status]}`}>
                    {item.status === 'available' && <CheckCircle2 size={14} />}
                    {item.status === 'low' && <AlertTriangle size={14} />}
                    {item.status === 'expired' && <AlertCircle size={14} />}
                    {content.ui[item.status]}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-500 font-medium leading-snug line-clamp-2">{item.description}</p>
              
              <div className="flex gap-3 mt-auto pt-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => handleEditItem(item)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Edit2 size={20} /> {content.ui.edit}
                </button>
                <button 
                  type="button"
                  onClick={() => requestDelete(item.id)}
                  className="w-14 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center transition-colors active:scale-95 border border-red-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

           <button 
            type="button"
            onClick={handleAddItem}
            className="min-h-[220px] flex flex-col items-center justify-center gap-4 border-4 border-dashed border-slate-300 rounded-3xl text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-95 group"
          >
            <div className="bg-slate-100 group-hover:bg-blue-100 p-6 rounded-full transition-colors">
              <Plus size={40} />
            </div>
            <span className="text-xl font-bold">{content.ui.add_item}</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 rtl:right-auto rtl:left-6 z-10">
        <button 
          type="button"
          onClick={handleAddItem}
          className="h-20 w-20 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center border-b-4 border-blue-800 active:scale-95 active:border-b-0 translate-y-0 active:translate-y-1 transition-all"
        >
          <Plus size={40} strokeWidth={3} />
        </button>
      </div>
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-short z-[70]">
          <Check size={28} strokeWidth={3} />
          <span className="text-xl font-bold">{notification}</span>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl flex flex-col gap-8 border-4 border-slate-200">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-red-100 text-red-600 rounded-full">
                <Trash2 size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 leading-tight">
                {content.ui.confirm_delete}
              </h3>
            </div>
            
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-xl border-b-4 border-slate-200 hover:bg-slate-200 active:scale-95 transition-all"
              >
                {content.ui.cancel}
              </button>
              <button 
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold text-xl border-b-4 border-red-800 shadow-lg hover:bg-red-500 active:scale-95 transition-all"
              >
                {content.ui.delete}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};