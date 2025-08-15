import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '@/hooks/useItems';
import { useAuthStore } from '@/store/auth';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Loading from '@/components/UI/Loading';
import type { Item, CreateItemRequest, UpdateItemRequest } from '@/types';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: Item;
}

function ItemModal({ isOpen, onClose, item }: ItemModalProps) {
  const isEditMode = !!item;
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateItemRequest>({
    defaultValues: item ? {
      name: item.name,
      category: item.category,
      price: item.price,
      stockQuantity: item.stockQuantity,
    } : {}
  });

  // Reset form when item changes or modal opens/closes
  useEffect(() => {
    if (isOpen && item) {
      setValue('name', item.name);
      setValue('category', item.category);
      setValue('price', item.price);
      setValue('stockQuantity', item.stockQuantity);
    } else if (isOpen && !item) {
      reset();
    }
  }, [isOpen, item, setValue, reset]);

  const onSubmit = async (data: CreateItemRequest) => {
    try {
      if (isEditMode) {
        await updateItemMutation.mutateAsync({ id: item.itemId.toString(), data });
      } else {
        await createItemMutation.mutateAsync(data);
      }
      reset();
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isLoading = createItemMutation.isPending || updateItemMutation.isPending;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {isEditMode ? 'Edit Item' : 'Add New Item'}
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Item Name"
                    placeholder="Enter item name"
                    error={errors.name?.message}
                    {...register('name', { required: 'Item name is required' })}
                  />

                  <Input
                    label="Category"
                    placeholder="Enter category"
                    error={errors.category?.message}
                    {...register('category', { required: 'Category is required' })}
                  />

                  <Input
                    label="Price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    error={errors.price?.message}
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                  />

                  <Input
                    label="Stock Quantity"
                    type="number"
                    placeholder="0"
                    error={errors.stockQuantity?.message}
                    {...register('stockQuantity', { 
                      required: 'Stock quantity is required',
                      min: { value: 0, message: 'Stock quantity cannot be negative' }
                    })}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={isLoading}
                    >
                      {isEditMode ? 'Update Item' : 'Create Item'}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function ItemsPage() {
  const { role } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: items, isLoading } = useItems({
    name: searchTerm || undefined,
    category: categoryFilter || undefined,
  });
  
  const deleteItemMutation = useDeleteItem();

  const filteredItems = items || [];
  const categories = Array.from(new Set(items?.map(item => item.category) || []));

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Out of Stock', class: 'badge-danger' };
    if (quantity <= 5) return { text: 'Low Stock', class: 'badge-warning' };
    return { text: 'In Stock', class: 'badge-success' };
  };

  if (isLoading) {
    return <Loading text="Loading items..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Items</h1>
          <p className="text-gray-600">Manage your inventory items</p>
        </div>
        {role === 'admin' && (
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={PlusIcon}
          >
            Add Item
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={MagnifyingGlassIcon}
            />
          </div>
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="card">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              {items?.length === 0 
                ? "Get started by adding your first item."
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Created</th>
                  {role === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item.stockQuantity);
                  return (
                    <tr key={item._id}>
                      <td className="font-medium">{item.name}</td>
                      <td>{item.category}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.stockQuantity}</td>
                      <td>
                        <span className={`badge ${stockStatus.class}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      {role === 'admin' && (
                        <td>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditItem(item)}
                              icon={PencilIcon}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteItem(item.itemId.toString())}
                              loading={deleteItemMutation.isPending}
                              icon={TrashIcon}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <ItemModal
        key={editingItem?._id || 'new'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={editingItem || undefined}
      />
    </div>
  );
}

ItemsPage.title = 'Items';