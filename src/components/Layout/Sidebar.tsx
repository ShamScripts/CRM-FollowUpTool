import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  Calendar, 
  Bell, 
  FileSpreadsheet, 
  BarChart3, 
  Phone, 
  Heart, 
  Settings, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Follow-ups & Reminders', href: '/followups', icon: Calendar },
  { name: 'Excel Sync', href: '/sync', icon: FileSpreadsheet },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Sentiment', href: '/sentiment', icon: Heart },
  { name: 'Admin', href: '/admin', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <motion.div
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-background border-r border-border flex flex-col h-full shadow-sm"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <span className="ml-3 text-xl font-bold text-foreground">
                CRM Pro
              </span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 hover:bg-muted"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3"
              >
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 border-t border-border"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-foreground">
                Need help?
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Contact our support team for assistance
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};