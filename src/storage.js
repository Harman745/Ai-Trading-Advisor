// Storage wrapper that works both in Claude artifacts and standalone
// Falls back to localStorage if window.storage is not available

const storage = {
  async get(key) {
    try {
      // Try Claude artifacts storage first
      if (window.storage && window.storage.get) {
        return await window.storage.get(key);
      }
      
      // Fallback to localStorage
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set(key, value) {
    try {
      // Try Claude artifacts storage first
      if (window.storage && window.storage.set) {
        return await window.storage.set(key, value);
      }
      
      // Fallback to localStorage
      localStorage.setItem(key, value);
      return { key, value };
    } catch (error) {
      console.error('Storage set error:', error);
      return null;
    }
  },

  async delete(key) {
    try {
      // Try Claude artifacts storage first
      if (window.storage && window.storage.delete) {
        return await window.storage.delete(key);
      }
      
      // Fallback to localStorage
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (error) {
      console.error('Storage delete error:', error);
      return null;
    }
  },

  async list(prefix = '') {
    try {
      // Try Claude artifacts storage first
      if (window.storage && window.storage.list) {
        return await window.storage.list(prefix);
      }
      
      // Fallback to localStorage
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!prefix || key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return { keys };
    } catch (error) {
      console.error('Storage list error:', error);
      return { keys: [] };
    }
  }
};

// Make it available globally
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = storage;
}

export default storage;
