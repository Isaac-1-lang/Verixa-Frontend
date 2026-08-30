"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Layers, Compass, LogOut, X, Settings, ChevronRight, ChevronDown, Zap, BarChart3, AlertCircle, CheckSquare, Building2, Users, MessageSquareText, GraduationCap, BrainCircuit, CreditCard, Rocket, ShieldCheck, ListTodo, FileBarChart, BookOpen, CalendarDays, ClipboardCheck, Gauge, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const trainingChildren = [
  { name: 'Overview', path: '/dashboard/training', icon: LayoutDashboard },
  { name: 'Programs', path: '/dashboard/training/programs', icon: BookOpen },
  { name: 'Participants', path: '/dashboard/training/participants', icon: Users },
  { name: 'Sessions', path: '/dashboard/training/sessions', icon: CalendarDays },
  { name: 'Attendance', path: '/dashboard/training/attendance', icon: ClipboardCheck },
  { name: 'Assessments', path: '/dashboard/training/assessments', icon: BrainCircuit },
  { name: 'Feedback', path: '/dashboard/training/feedback', icon: MessageSquareText },
  { name: 'Readiness', path: '/dashboard/training/readiness', icon: Gauge },
  { name: 'Reports', path: '/dashboard/training/reports', icon: FileBarChart },
];
const navLinks = [
  { name:'Dashboard',icon:LayoutDashboard,path:'/dashboard'},{name:'Organizations',icon:Building2,path:'/dashboard/organizations'},{name:'People & Access',icon:Users,path:'/dashboard/access'},{name:'Projects',icon:Layers,path:'/dashboard/projects'},
  {name:'Test Cases',icon:Zap,path:'/dashboard/test-cases'},{name:'Requirements',icon:CheckSquare,path:'/dashboard/requirements'},{name:'Test Runs',icon:Compass,path:'/dashboard/runs'},{name:'Execution Queue',icon:ListTodo,path:'/dashboard/queue'},
  {name:'Executions',icon:BarChart3,path:'/dashboard/executions'},{name:'Defects',icon:AlertCircle,path:'/dashboard/defects'},{name:'Feedback',icon:MessageSquareText,path:'/dashboard/feedback'},
  {name:'Training',icon:GraduationCap,path:'/dashboard/training',children:trainingChildren},{name:'Competencies',icon:BrainCircuit,path:'/dashboard/competencies'},{name:'Go-live Readiness',icon:Rocket,path:'/dashboard/readiness'},
  {name:'Reports',icon:FileBarChart,path:'/dashboard/reports'},{name:'Plans & Billing',icon:CreditCard,path:'/dashboard/billing'},{name:'Administration',icon:ShieldCheck,path:'/dashboard/admin'}
];

export default function Sidebar({isOpen,onClose,collapsed,onToggleCollapse}){
 const pathname=usePathname();const [trainingOpen,setTrainingOpen]=useState(pathname.startsWith('/dashboard/training'));
 const active=(item)=>pathname===item.path||(item.path!=='/dashboard'&&pathname.startsWith(item.path));
 return <><AnimatePresence>{isOpen&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose}/>}</AnimatePresence>
 <aside className={'h-screen overflow-hidden bg-white flex flex-col fixed left-0 top-0 z-50 border-r border-navy/6 transform transition-[transform,width] duration-300 lg:translate-x-0 '+(collapsed?'lg:w-20':'lg:w-60')+' w-60 '+(isOpen?'translate-x-0':'-translate-x-full lg:translate-x-0')} style={{boxShadow:'4px 0 24px rgba(26,38,74,.04)'}}>
  <div className={"h-14 flex items-center border-b border-navy/6 shrink-0 "+(collapsed?"px-2 justify-center":"px-4 justify-between")}><Link href="/dashboard" onClick={onClose} className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center"><img src="/logo.png" alt="Verixa" className="w-10 h-10 object-contain brightness-0 invert"/></div>{!collapsed&&<span className="font-bold text-navy text-lg">VERIXA</span>}</Link><button onClick={onClose} className="lg:hidden p-1.5 text-navy/30"><X size={16}/></button><button onClick={onToggleCollapse} title={collapsed?"Expand sidebar":"Collapse sidebar"} className="hidden lg:grid w-8 h-8 place-items-center rounded-md text-navy/35 hover:text-navy hover:bg-navy/5">{collapsed?<PanelLeftOpen size={16}/>:<PanelLeftClose size={16}/>}</button></div>
  <nav className={"flex-1 min-h-0 py-4 overflow-y-auto overscroll-contain custom-scrollbar "+(collapsed?"px-2":"px-3")}><div className="space-y-1">{navLinks.map(item=>{const Icon=item.icon;const isActive=active(item);if(item.children)return <div key={item.path}><button onClick={()=>setTrainingOpen(v=>!v)} className={'w-full group flex items-center gap-3 px-2 py-2 rounded-md font-semibold text-sm transition-all '+(isActive?'bg-navy text-white shadow-md shadow-navy/20':'text-navy/50 hover:text-navy hover:bg-navy/5')}><span className={'w-7 h-7 rounded-full grid place-items-center '+(isActive?'bg-white/15':'bg-navy/4')}><Icon size={13}/></span>{!collapsed&&<span className="flex-1 text-left">{item.name}</span>}{!collapsed&&(trainingOpen?<ChevronDown size={13}/>:<ChevronRight size={13}/>)}</button><AnimatePresence initial={false}>{trainingOpen&&!collapsed&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><div className="ml-5 mt-1 pl-3 border-l border-navy/10 space-y-0.5">{item.children.map(child=>{const ChildIcon=child.icon;const childActive=pathname===child.path;return <Link key={child.path} href={child.path} onClick={onClose} className={'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-bold transition-colors '+(childActive?'bg-navy/8 text-navy':'text-navy/40 hover:text-navy hover:bg-navy/4')}><ChildIcon size={12}/><span>{child.name}</span></Link>})}</div></motion.div>}</AnimatePresence></div>;
  return <Link key={item.path} href={item.path} onClick={onClose} title={collapsed?item.name:undefined} className={'group flex items-center gap-3 px-2 py-2 rounded-md font-semibold text-sm transition-all '+(isActive?'bg-navy text-white shadow-md shadow-navy/20':'text-navy/50 hover:text-navy hover:bg-navy/5')}><span className={'w-7 h-7 rounded-full grid place-items-center '+(isActive?'bg-white/15':'bg-navy/4')}><Icon size={13}/></span>{!collapsed&&<span className="flex-1">{item.name}</span>}{!collapsed&&isActive&&<ChevronRight size={12}/>}</Link>})}</div></nav>
  <div className={"border-t border-navy/6 space-y-1 "+(collapsed?"p-2":"p-3")}><Link href="/dashboard/profile" onClick={onClose} title={collapsed?"Settings":undefined} className={"flex items-center gap-3 py-2 rounded-lg font-semibold text-sm text-navy/50 hover:bg-navy/5 "+(collapsed?"justify-center px-2":"px-3")}><Settings size={14}/>{!collapsed&&"Settings"}</Link><button onClick={()=>{localStorage.removeItem('token');localStorage.removeItem('tokenType');localStorage.removeItem('user');window.location.href='/auth/login'}} title={collapsed?"Logout":undefined} className={"w-full flex items-center gap-3 py-2 rounded-lg font-semibold text-sm text-navy/50 hover:text-red-500 hover:bg-red-50 "+(collapsed?"justify-center px-2":"px-3")}><LogOut size={14}/>{!collapsed&&"Logout"}</button></div>
 </aside></>
}
