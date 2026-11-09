import React from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  Award, 
  Layers, 
  Briefcase, 
  GraduationCap, 
  ClipboardCheck, 
  Database, 
  Info,
  Users,
  History,
  TrendingUp,
  X
} from 'lucide-react';
import { NavTabId, User } from '../types';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  currentUser,
}) => {
  // All navigation items (Notice "Insight" has been completely removed per request 5, and "Performa Pegawai" added per request 9)
  const allNavItems = [
    { id: 'dashboard' as NavTabId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'realisasi-pmk' as NavTabId, label: 'Realisasi PMK', icon: BarChart2 },
    { id: 'sertifikasi' as NavTabId, label: 'Sertifikasi', icon: Award },
    { id: 'analisis-kompetensi' as NavTabId, label: 'Analisis Kompetensi', icon: Layers },
    { id: 'bank-kasus' as NavTabId, label: 'Bank Kasus Publik', icon: Briefcase },
    { id: 'pembelajaran-internal' as NavTabId, label: 'Pembelajaran Internal', icon: GraduationCap },
    { id: 'survei-level-3' as NavTabId, label: 'Survei Level 3', icon: ClipboardCheck },
    { id: 'data-pmk' as NavTabId, label: 'Data PMK', icon: Database },
    { id: 'performa-pegawai' as NavTabId, label: 'Performa Pegawai', icon: TrendingUp },
    { id: 'manajemen-user' as NavTabId, label: 'Manajemen Pengguna', icon: Users, adminOnly: true },
    { id: 'log-aktivitas' as NavTabId, label: 'Log Aktivitas', icon: History, adminOnly: true },
    { id: 'tentang-lentera' as NavTabId, label: 'Tentang LENTERA', icon: Info },
  ];

  // Role-based access filter: Super Admin & Admin see all or user's allowedMenus
  const allowed = currentUser.allowedMenus || [];
  const visibleNavItems = allNavItems.filter((item) => {
    if (currentUser.role === 'Super Admin' || currentUser.role === 'Admin') {
      return true;
    }
    // For non-admin, filter by allowedMenus and hide admin-only modules
    if (item.adminOnly) return false;
    if (allowed.length > 0) {
      return allowed.includes(item.id);
    }
    return true;
  });

  const handleItemClick = (id: NavTabId) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container - Dominant White */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-white dark:bg-[#071325] text-slate-700 dark:text-slate-200 flex flex-col justify-between
        transition-transform duration-300 ease-in-out border-r border-slate-200/90 dark:border-slate-800/80 shadow-xs
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top Section */}
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Brand Header on White with Bank Indonesia & LENTERA Logos */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 relative bg-white dark:bg-[#071325]">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/aistudio/LOGO_UTAMA_BIRU_945fed8b.png"
                  alt="Bank Indonesia"
                  className="h-6 w-auto object-contain shrink-0"
                />
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />
                <img
                  src="/assets/aistudio/LENTERA_Blue_Circuit_Logo_0ccbf88a.png"
                  alt="LENTERA"
                  className="h-6 w-auto object-contain shrink-0"
                />
              </div>
              <div className="text-[10px] leading-snug text-slate-500 dark:text-slate-400 font-medium">
                Learning, Enrichment, Transformation, and Evaluation for Resulting Advancement
              </div>
            </div>

            {/* Mobile close */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links on Dominant White */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto bg-white dark:bg-[#071325]">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left
                    transition-all duration-150 cursor-pointer group relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-sky-50 to-emerald-50/70 dark:from-emerald-500/20 dark:to-blue-600/10 text-[#0c2340] dark:text-white border border-sky-200/80 dark:border-emerald-500/30 font-bold shadow-2xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0c2340] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}
                  `}
                >
                  {/* Subtle active left bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-sky-600 dark:bg-emerald-400" />
                  )}

                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-sky-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-sky-600 dark:group-hover:text-slate-200'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer Info on White */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#071325] text-[11px] text-slate-500 dark:text-slate-400">
            <div className="font-bold text-[#0c2340] dark:text-slate-200">Kantor Perwakilan Bank Indonesia</div>
            <div className="text-[10px] text-sky-700 dark:text-emerald-400 font-semibold">Provinsi Jawa Timur</div>
          </div>
        </div>
      </aside>
    </>
  );
};
