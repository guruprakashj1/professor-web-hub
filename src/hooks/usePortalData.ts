
import { useState, useEffect } from 'react';
import { FileStorageService } from '@/utils/fileStorage';
import { PortalData } from '@/types/portalData';

export const usePortalData = () => {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const storage = FileStorageService.getInstance();

  const loadData = () => {
    try {
      setLoading(true);
      const portalData = storage.loadData();
      setData(portalData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
  };

  const createItem = <T extends { id: string }>(section: keyof PortalData, item: Omit<T, 'id'>) => {
    try {
      const newItem = storage.create<T>(section, item);
      refreshData();
      return newItem;
    } catch (err) {
      setError('Failed to create item');
      throw err;
    }
  };

  const updateItem = <T extends { id: string }>(section: keyof PortalData, id: string, updates: Partial<T>) => {
    try {
      const updatedItem = storage.update<T>(section, id, updates);
      refreshData();
      return updatedItem;
    } catch (err) {
      setError('Failed to update item');
      throw err;
    }
  };

  const deleteItem = (section: keyof PortalData, id: string) => {
    try {
      const success = storage.delete(section, id);
      refreshData();
      return success;
    } catch (err) {
      setError('Failed to delete item');
      throw err;
    }
  };

  const updateAbout = (updates: Partial<PortalData['about']>) => {
    try {
      const updatedAbout = storage.updateAbout(updates);
      refreshData();
      return updatedAbout;
    } catch (err) {
      setError('Failed to update about section');
      throw err;
    }
  };

  const exportData = () => {
    try {
      return storage.exportData();
    } catch (err) {
      setError('Failed to export data');
      throw err;
    }
  };

  const importData = (jsonString: string) => {
    try {
      storage.importData(jsonString);
      refreshData();
    } catch (err) {
      setError('Failed to import data');
      throw err;
    }
  };

  const resetData = () => {
    try {
      storage.resetData();
      refreshData();
    } catch (err) {
      setError('Failed to reset data');
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refreshData,
    createItem,
    updateItem,
    deleteItem,
    updateAbout,
    exportData,
    importData,
    resetData
  };
};
