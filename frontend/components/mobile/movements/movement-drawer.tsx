import { useEffect, useState } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BankAccount, CreateMovementData, movementApi } from '@/lib/api/bank-api';
import { useRouter } from 'next/navigation';

export function MovementDrawer({
  isDrawerOpen,
  toggleDrawer,
  selectedAccountId,
}: {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  selectedAccountId: number | null;
}) {
  const [formData, setFormData] = useState<CreateMovementData>({
    accountId: selectedAccountId || 0,
    category: 'OTHER',
    type: 'EXPENSE',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PENDING',
  });

  const router = useRouter();

  useEffect(() => {
    if (selectedAccountId) {
      setFormData((prev) => ({ ...prev, accountId: selectedAccountId }));
    }
  }, [selectedAccountId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : name === 'accountId' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await movementApi.create(formData);
    if (result.data) {
      toggleDrawer();
      router.push('/bank/movements');
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={toggleDrawer}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Movement</DrawerTitle>
          <DrawerClose onClick={toggleDrawer}>Close</DrawerClose>
        </DrawerHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="accountId">Account</Label>
            <select
              id="accountId"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className="w-full border rounded"
            >
              <option value={0}>Select an account</option>
              {/* Add options dynamically */}
            </select>
          </div>
          {/* Other form fields */}
          <Button type="submit">Create</Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}