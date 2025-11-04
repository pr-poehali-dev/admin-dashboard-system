import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { User } from '@/App';

const OrdersManagement = ({ user, canCreate }: { user: User; canCreate: boolean }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="ClipboardList" size={24} className="text-primary" />
            Заявки
          </CardTitle>
          <CardDescription>Управление производственными заявками</CardDescription>
        </div>

        {canCreate && (
          <Button className="gap-2">
            <Icon name="Plus" size={18} />
            Создать заявку
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              Созданные
            </Button>
            <Button variant="outline" className="gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              В исполнении
            </Button>
            <Button variant="outline" className="gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              Исполнены
            </Button>
          </div>

          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <Icon name="ClipboardList" size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Нет заявок</p>
            <p className="text-sm">Создайте первую заявку для начала работы</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersManagement;
