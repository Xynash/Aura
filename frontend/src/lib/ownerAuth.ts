const KEY_STORAGE = 'aura_owner_key';

export function getOwnerKey(): string {
  return localStorage.getItem(KEY_STORAGE) || '';
}