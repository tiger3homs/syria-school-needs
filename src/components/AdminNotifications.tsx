import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, School, ClipboardList, X } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  entity_type?: string;
  entity_id?: string;
  read: boolean;
  created_at: string;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10); // Limit notifications for dropdown

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      toast({
        title: t('notifications.errorFetching'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error: any) {
      toast({
        title: t('notifications.errorUpdating'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ read: true })
        .eq('recipient_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );

      toast({
        title: t('common.success'),
        description: t('notifications.allRead'),
      });
    } catch (error: any) {
      toast({
        title: t('notifications.errorUpdating'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'school_registered':
        return <AvatarFallback className="bg-primary/20 text-primary"><School className="h-4 w-4" /></AvatarFallback>;
      case 'need_submitted':
        return <AvatarFallback className="bg-accent/20 text-accent"><ClipboardList className="h-4 w-4" /></AvatarFallback>;
      default:
        return <AvatarFallback className="bg-muted/20 text-muted-foreground"><Bell className="h-4 w-4" /></AvatarFallback>;
    }
  };

  return (
    <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
      <DropdownMenuLabel className="flex items-center justify-between px-4 py-2">
        <span className="font-semibold text-foreground">{t('notifications.title')}</span>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto px-2 py-1 text-xs text-primary hover:bg-primary/10">
            {t('notifications.markAllRead')}
          </Button>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <ScrollArea className="h-72">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-secondary animate-pulse"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-secondary rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-secondary rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted" />
            <p className="text-sm">{t('notifications.noNotifications')}</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex items-start space-x-3 p-3 cursor-pointer ${
                !notification.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-secondary/50'
              }`}
              onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing on item click
            >
              <Avatar className="h-8 w-8">
                {getNotificationIcon(notification.type)}
              </Avatar>
              <div className="flex-1">
                <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </DropdownMenuItem>
          ))
        )}
      </ScrollArea>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="px-4 py-2">
        <Button 
          variant="ghost" 
          className="w-full text-center text-primary hover:bg-primary/10"
          asChild
        >
          <Link to="/admin/notifications">{t('notifications.viewAll')}</Link>
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default AdminNotifications;
