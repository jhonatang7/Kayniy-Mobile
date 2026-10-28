import * as SecureStore from 'expo-secure-store';

export const storage = {
  getString(key: string) {
    return SecureStore.getItemAsync(key);
  },
  setString(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
  delete(key: string) {
    return SecureStore.deleteItemAsync(key);
  },
};

export default storage;
