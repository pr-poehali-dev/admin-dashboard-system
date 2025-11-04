import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import type { User } from '@/App';
import UsersManagement from '@/components/sections/UsersManagement';
import MaterialsManagement from '@/components/sections/MaterialsManagement';
import OrdersManagement from '@/components/sections/OrdersManagement';
import StockManagement from '@/components/sections/StockManagement';
import WorkSchedule from '@/components/sections/WorkSchedule';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('orders');

  const canManageUsers = user.role === 'admin';
  const canCreateOrders = user.role === 'admin' || user.role === 'director' || user.role === 'manager';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
              <Icon name="Factory" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Производство</h1>
              <p className="text-xs text-muted-foreground">{user.full_name} • {getRoleLabel(user.role)}</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <Icon name="LogOut" size={18} />
            Выход
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-muted/50 p-2">
            <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ClipboardList" size={18} />
              <span className="hidden sm:inline">Заявки</span>
            </TabsTrigger>
            
            <TabsTrigger value="materials" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Package" size={18} />
              <span className="hidden sm:inline">Материалы</span>
            </TabsTrigger>
            
            <TabsTrigger value="stock" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Warehouse" size={18} />
              <span className="hidden sm:inline">Остатки</span>
            </TabsTrigger>
            
            <TabsTrigger value="schedule" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Calendar" size={18} />
              <span className="hidden sm:inline">График</span>
            </TabsTrigger>
            
            {canManageUsers && (
              <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon name="Users" size={18} />
                <span className="hidden sm:inline">Сотрудники</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="orders" className="mt-0">
            <OrdersManagement user={user} canCreate={canCreateOrders} />
          </TabsContent>

          <TabsContent value="materials" className="mt-0">
            <MaterialsManagement user={user} />
          </TabsContent>

          <TabsContent value="stock" className="mt-0">
            <StockManagement user={user} />
          </TabsContent>

          <TabsContent value="schedule" className="mt-0">
            <WorkSchedule user={user} />
          </TabsContent>

          {canManageUsers && (
            <TabsContent value="users" className="mt-0">
              <UsersManagement />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: 'Администратор',
    director: 'Руководитель',
    manager: 'Начальник',
    worker: 'Работник',
  };
  return labels[role] || role;
}

export default Dashboard;
