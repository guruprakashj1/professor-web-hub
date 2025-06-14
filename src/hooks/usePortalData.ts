
import { useState, useEffect, useCallback } from 'react';
import { FileStorageService } from '@/utils/fileStorage';
import { PortalData } from '@/types/portalData';

export const usePortalData = () => {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const storage = FileStorageService.getInstance();

  const loadData = useCallback(() => {
    try {
      setLoading(true);
      const portalData = storage.loadData();
      setData(portalData);
      setError(null);
      console.log('Data loaded:', portalData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [storage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = useCallback(() => {
    console.log('Refreshing data...');
    loadData();
  }, [loadData]);

  const createItem = <T extends { id: string }>(section: keyof PortalData, item: Omit<T, 'id'>) => {
    try {
      const newItem = storage.create<T>(section, item);
      console.log('Item created:', newItem);
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
      console.log('Item updated:', updatedItem);
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
      console.log('Item deleted:', { section, id, success });
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
      console.log('About updated:', updatedAbout);
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
      console.log('Data imported successfully');
      refreshData();
    } catch (err) {
      setError('Failed to import data');
      throw err;
    }
  };

  const resetData = () => {
    try {
      storage.resetData();
      console.log('Data reset to defaults');
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
