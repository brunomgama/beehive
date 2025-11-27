'use client'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { Movement, BankAccount } from '@/lib/api/bank-api'
import { getMovementTypeColor, getMovementStatusColor, getMovementCategoryColor} from '@/lib/bank/movement-colors'
import { formatCurrency, formatDayLabel } from '@/lib/utils'

type MovementsListProps = {
  movements: Movement[]
  filteredMovements: Movement[]
  searchTerm: string
  error: string
  accounts: BankAccount[]
  onSearchChangeAction: (value: string) => void
  onAddAction: () => void
  onViewAction: (id: number) => void
  onEditAction: (id: number) => void
  onDeleteAction: (id: number) => void
  getAccountNameAction: (accountId: number) => string
}

export function MovementsList({movements, filteredMovements, searchTerm, error, accounts, onSearchChangeAction, onAddAction, onViewAction, onEditAction, onDeleteAction, getAccountNameAction}:
     MovementsListProps) {

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-8" />
                    <Input placeholder="Search movements..." value={searchTerm} onChange={(e) => onSearchChangeAction(e.target.value)} className="pl-10"/>
                </div>
                <div className="text-sm text-gray-600">
                    {filteredMovements.length} of {movements.length} movements
                </div>
                </div>
                <Button onClick={onAddAction} className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Add Movement
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg shadow-sm border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredMovements.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No movements match your search.' : 'No movements found.'}
                        </TableCell>
                    </TableRow>
                    ) : (
                    filteredMovements.map((movement) => (
                        <TableRow key={movement.id}>
                        <TableCell className="font-medium">
                            {movement.description}
                        </TableCell>
                        <TableCell>{getAccountNameAction(movement.accountId)}</TableCell>
                        <TableCell>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementTypeColor(movement.type)}`}>
                            {movement.type}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementCategoryColor(movement.category)}`}>
                            {movement.category}
                            </span>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${movement.type === 'INCOME' ? 'text-green-600' : 'text-red-600' }`}>
                            {movement.type === 'EXPENSE' ? '-' : '+'}
                            {formatCurrency(movement.amount)}
                        </TableCell>
                        <TableCell>{formatDayLabel(movement.date)}</TableCell>
                        <TableCell>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementStatusColor(movement.status)}`}>
                            {movement.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                            <Button size="sm"onClick={() => movement.id && onViewAction(movement.id)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => movement.id && onEditAction(movement.id)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => movement.id && onDeleteAction(movement.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
                </Table>
            </div>
        </div>
    )
}
