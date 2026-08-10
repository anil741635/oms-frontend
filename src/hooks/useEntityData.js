import { useCallback, useEffect, useState } from "react";
import { useToast } from "./useToast";

// Shared list/create/update/delete state for a CRUD page. `createFn`/`updateFn`
// let callers override how a payload maps to an API call (e.g. Orders needs a
// custom endpoint), otherwise the entity's own api.create/update is used.
export function useEntityData(api, options = {}) {
  const { label = "item", createFn, updateFn } = options;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Used for reloads after a mutation (called from event handlers below, so
  // resetting loading/error synchronously there is fine).
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || `Failed to load ${label.toLowerCase()}s`);
    } finally {
      setLoading(false);
    }
  }, [api, label]);

  // Initial fetch on mount. Kept separate from `load` (rather than calling it
  // directly) so nothing is set synchronously within the effect body itself —
  // the loading/error state is already correct from useState's initial value.
  useEffect(() => {
    let cancelled = false;
    api
      .getAll()
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || `Failed to load ${label.toLowerCase()}s`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, label]);

  const create = async (payload) => {
    try {
      await (createFn ? createFn(payload) : api.create(payload));
      showToast(`${label} added successfully`, "success");
      await load();
      return true;
    } catch (err) {
      showToast(err.message || `Failed to add ${label.toLowerCase()}`, "error");
      return false;
    }
  };

  const update = async (id, payload) => {
    try {
      await (updateFn ? updateFn(id, payload) : api.update(id, payload));
      showToast(`${label} updated successfully`, "success");
      await load();
      return true;
    } catch (err) {
      showToast(err.message || `Failed to update ${label.toLowerCase()}`, "error");
      return false;
    }
  };

  const remove = async (id) => {
    try {
      await api.remove(id);
      showToast(`${label} deleted successfully`, "success");
      await load();
      return true;
    } catch (err) {
      showToast(err.message || `Failed to delete ${label.toLowerCase()}`, "error");
      return false;
    }
  };

  return { items, loading, error, reload: load, create, update, remove };
}
