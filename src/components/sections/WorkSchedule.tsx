import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { User } from '@/App';

const WorkSchedule = ({ user }: { user: User }) => {
  const canEditSchedule = user.role !== 'director';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="Calendar" size={24} className="text-primary" />
            График рабочего времени
          </CardTitle>
          <CardDescription>Учёт рабочих часов сотрудников по месяцам (формат А4 альбомный)</CardDescription>
        </div>

        {canEditSchedule && (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Icon name="Printer" size={18} />
              Печать
            </Button>
            <Button className="gap-2">
              <Icon name="Plus" size={18} />
              Добавить часы
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Нет данных о графике</p>
          <p className="text-sm">Начните учёт рабочего времени</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkSchedule;
