
import { useState, useEffect, useCallback } from 'react';
import { FirebaseStorageService } from '@/utils/firebaseStorage';
import { PortalData } from '@/types/portalData';

export const useFirebasePortalData = () => {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const storage = FirebaseStorageService.getInstance();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const portalData = await storage.loadData();
      setData(portalData);
      setError(null);
      console.log('Data loaded from Firebase:', portalData);
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

  const refreshData = useCallback(async () => {
    console.log('Refreshing data from Firebase...');
    storage.clearCache();
    await loadData();
  }, [loadData, storage]);

  const createItem = async <T extends { id: string }>(section: keyof PortalData, item: Omit<T, 'id'>) => {
    try {
      const newItem = await storage.create<T>(section, item);
      console.log('Item created:', newItem);
      // Update local state immediately
      if (data) {
        const updatedData = { ...data };
        if (Array.isArray(updatedData[section])) {
          (updatedData[section] as T[]).push(newItem);
        }
        setData(updatedData);
      }
      return newItem;
    } catch (err) {
      setError('Failed to create item');
      throw err;
    }
  };

  const updateItem = async <T extends { id: string }>(section: keyof PortalData, id: string, updates: Partial<T>) => {
    try {
      const updatedItem = await storage.update<T>(section, id, updates);
      console.log('Item updated:', updatedItem);
      // Update local state immediately
      if (data && updatedItem) {
        const updatedData = { ...data };
        if (Array.isArray(updatedData[section])) {
          const items = updatedData[section] as T[];
          const index = items.findIndex(item => item.id === id);
          if (index !== -1) {
            items[index] = updatedItem;
          }
        }
        setData(updatedData);
      }
      return updatedItem;
    } catch (err) {
      setError('Failed to update item');
      throw err;
    }
  };

  const deleteItem = async (section: keyof PortalData, id: string) => {
    try {
      const success = await storage.delete(section, id);
      console.log('Item deleted:', { section, id, success });
      // Update local state immediately
      if (data && success) {
        const updatedData = { ...data };
        if (Array.isArray(updatedData[section])) {
          const items = updatedData[section] as { id: string }[];
          updatedData[section] = items.filter(item => item.id !== id) as any;
        }
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError('Failed to delete item');
      throw err;
    }
  };

  const updateAbout = async (updates: Partial<PortalData['about']>) => {
    try {
      const updatedAbout = await storage.updateAbout(updates);
      console.log('About updated:', updatedAbout);
      // Update local state immediately
      if (data) {
        setData({ ...data, about: updatedAbout });
      }
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

  const importData = async (jsonString: string) => {
    try {
      await storage.importData(jsonString);
      console.log('Data imported successfully');
      await refreshData();
    } catch (err) {
      setError('Failed to import data');
      throw err;
    }
  };

  const resetData = async () => {
    try {
      await storage.resetData();
      console.log('Data reset to defaults');
      await refreshData();
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
