import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { User } from '@/App';

const StockManagement = ({ user }: { user: User }) => {
  const canManageStock = user.role === 'admin' || user.role === 'director' || user.role === 'worker';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="Warehouse" size={24} className="text-primary" />
            Остатки материалов
          </CardTitle>
          <CardDescription>Учёт остатков на складе (красное выделение при &lt; 10 шт)</CardDescription>
        </div>

        {canManageStock && (
          <Button className="gap-2">
            <Icon name="Plus" size={18} />
            Добавить остаток
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <Icon name="Warehouse" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Нет данных об остатках</p>
          <p className="text-sm">Добавьте информацию о материалах на складе</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockManagement;
