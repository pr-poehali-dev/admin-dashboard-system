import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import type { User } from '@/App';
import { API_ENDPOINTS } from '@/lib/api';

interface Material {
  id: number;
  name: string;
  category_name: string;
  color_name: string;
  color_hex: string;
  auto_deduct: boolean;
  manual_deduct: boolean;
  defect: boolean;
  image_url: string | null;
}

interface Category {
  id: number;
  name: string;
}

interface Color {
  id: number;
  name: string;
  hex_code: string;
}

const MaterialsManagement = ({ user }: { user: User }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    color_id: '',
    auto_deduct: false,
    manual_deduct: false,
    defect: false,
    image_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [materialsRes, categoriesRes, colorsRes] = await Promise.all([
        fetch(API_ENDPOINTS.materialsList),
        fetch(API_ENDPOINTS.materialsCategories),
        fetch(API_ENDPOINTS.materialsColors),
      ]);

      const [materialsData, categoriesData, colorsData] = await Promise.all([
        materialsRes.json(),
        categoriesRes.json(),
        colorsRes.json(),
      ]);

      if (materialsRes.ok) setMaterials(materialsData.materials || []);
      if (categoriesRes.ok) setCategories(categoriesData.categories || []);
      if (colorsRes.ok) setColors(colorsData.colors || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
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
      const response = await fetch(API_ENDPOINTS.materialsCreate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Материал добавлен',
        });
        setDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось добавить материал',
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

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить материал? Это действие нельзя отменить.')) return;

    try {
      const response = await fetch(API_ENDPOINTS.materialsDelete, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Материал удалён',
        });
        loadData();
      } else {
        const data = await response.json();
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось удалить материал',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить материал',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      color_id: '',
      auto_deduct: false,
      manual_deduct: false,
      defect: false,
      image_url: '',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="Package" size={24} className="text-primary" />
            Материалы
          </CardTitle>
          <CardDescription>Управление материалами и их свойствами</CardDescription>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={18} />
              Добавить материал
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Новый материал</DialogTitle>
              <DialogDescription>Заполните данные для создания материала</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Раздел *</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите раздел" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color_id">Цвет *</Label>
                  <Select value={formData.color_id} onValueChange={(value) => setFormData({ ...formData, color_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите цвет" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: color.hex_code }} />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Способ списания</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto_deduct"
                    checked={formData.auto_deduct}
                    onCheckedChange={(checked) => setFormData({ ...formData, auto_deduct: checked as boolean })}
                  />
                  <label htmlFor="auto_deduct" className="text-sm cursor-pointer">
                    Автоматически
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manual_deduct"
                    checked={formData.manual_deduct}
                    onCheckedChange={(checked) => setFormData({ ...formData, manual_deduct: checked as boolean })}
                  />
                  <label htmlFor="manual_deduct" className="text-sm cursor-pointer">
                    Вручную
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="defect"
                    checked={formData.defect}
                    onCheckedChange={(checked) => setFormData({ ...formData, defect: checked as boolean })}
                  />
                  <label htmlFor="defect" className="text-sm cursor-pointer">
                    Брак
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Добавить'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {materials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Нет материалов
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Раздел</TableHead>
                  <TableHead>Цвет</TableHead>
                  <TableHead>Списание</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.category_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded border"
                          style={{ backgroundColor: material.color_hex }}
                        />
                        {material.color_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {material.auto_deduct && <span className="text-green-500">Авто </span>}
                      {material.manual_deduct && <span className="text-blue-500">Ручн. </span>}
                      {material.defect && <span className="text-red-500">Брак</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(material.id)}>
                        <Icon name="Trash2" size={16} className="text-destructive" />
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

export default MaterialsManagement;