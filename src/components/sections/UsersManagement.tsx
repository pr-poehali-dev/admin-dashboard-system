import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { API_ENDPOINTS } from '@/lib/api';

interface User {
  id: number;
  login: string;
  password: string;
  full_name: string;
  role: string;
  status: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    full_name: '',
    role: 'worker',
    status: 'active',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.usersList);
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить пользователей',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingUser ? API_ENDPOINTS.usersUpdate : API_ENDPOINTS.usersCreate;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser ? { ...formData, id: editingUser.id } : formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingUser ? 'Пользователь обновлён' : 'Пользователь создан',
        });
        setDialogOpen(false);
        setEditingUser(null);
        resetForm();
        loadUsers();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось сохранить пользователя',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить данные',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      login: '',
      password: '',
      full_name: '',
      role: 'worker',
      status: 'active',
    });
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      login: user.login,
      password: user.password,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    resetForm();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="Users" size={24} className="text-primary" />
            Управление сотрудниками
          </CardTitle>
          <CardDescription>Создание и редактирование учётных записей</CardDescription>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) closeDialog();
          else setDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="UserPlus" size={18} />
              Добавить сотрудника
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Редактировать сотрудника' : 'Новый сотрудник'}</DialogTitle>
              <DialogDescription>
                Заполните данные для {editingUser ? 'обновления' : 'создания'} учётной записи
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="login">Логин *</Label>
                  <Input
                    id="login"
                    value={formData.login}
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль *</Label>
                  <Input
                    id="password"
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="full_name">ФИО *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Должность *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="director">Руководитель</SelectItem>
                      <SelectItem value="manager">Начальник</SelectItem>
                      <SelectItem value="worker">Работник</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Статус *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Работает</SelectItem>
                      <SelectItem value="fired">Уволен</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Отмена
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {loading && users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Загрузка...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Нет сотрудников
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Логин</TableHead>
                  <TableHead>Пароль</TableHead>
                  <TableHead>Должность</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.login}</TableCell>
                    <TableCell className="font-mono text-sm">{user.password}</TableCell>
                    <TableCell>{getRoleLabel(user.role)}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? 'Работает' : 'Уволен'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                        <Icon name="Edit" size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
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

export default UsersManagement;