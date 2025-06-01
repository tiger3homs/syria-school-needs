import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check, School, ClipboardList } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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

const PAGE_SIZE = 10; // Number of notifications per page

const AdminNotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const fetchNotifications = async (page: number) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error, count } = await supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (error) throw error;
      setNotifications(data || []);
      setTotalNotifications(count || 0);
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
    fetchNotifications(currentPage);
  }, [user, currentPage]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalPages = Math.ceil(totalNotifications / PAGE_SIZE);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'school_registered':
        return <AvatarFallback className="bg-primary/20 text-primary"><School className="h-5 w-5" /></AvatarFallback>;
      case 'need_submitted':
        return <AvatarFallback className="bg-accent/20 text-accent"><ClipboardList className="h-5 w-5" /></AvatarFallback>;
      default:
        return <AvatarFallback className="bg-muted/20 text-muted-foreground"><Bell className="h-5 w-5" /></AvatarFallback>;
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        {/* <CardTitle>{t('notifications.title')}</CardTitle> */}
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            {t('notifications.markAllRead')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded-md">
                <div className="h-10 w-10 rounded-full bg-secondary animate-pulse"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-secondary rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-secondary rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted" />
            <p className="text-lg">{t('notifications.noNotifications')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-3 border rounded-md ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
              >
                <Avatar className="h-10 w-10">
                  {getNotificationIcon(notification.type)}
                </Avatar>
                <div className="flex-1">
                  <p className={`text-base font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
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
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                // <PaginationItem key={i}>
                //   <PaginationLink
                //     isActive={i === currentPage}
                //     onClick={() => setCurrentPage(i)}
                //   >
                //     {i + 1}
                //   </PaginationLink>
                // </PaginationItem>
                null
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminNotificationsList;
