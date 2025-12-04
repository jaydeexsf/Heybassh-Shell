'use client';

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "heybassh-password-vault";
const ITERATIONS = 210_000;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

type VaultEntry = {
  id: string;
  label: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  tags: string[];
  favorite: boolean;
  lastUpdated: number;
};

type PersistedVault = {
  cipher: string;
  iv: string;
  salt: string;
  lastUpdated: number;
  entryCount: number;
};

type PasswordManagerProps = {
  storageKey?: string;
  headline?: string;
  description?: string;
  embedded?: boolean;
  loadVault?: () => Promise<PersistedVault | null>;
  saveVault?: (vault: PersistedVault | null) => Promise<void>;
};

type FormState = Omit<VaultEntry, "id" | "lastUpdated"> & { id?: string };

const defaultTags = ["Production", "Staging", "Sandbox", "Internal", "Personal"];

const base64Encode = (data: ArrayBuffer | Uint8Array) => {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  return btoa(String.fromCharCode(...bytes));
};

const base64Decode = (value: string) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0));

async function deriveKey(password: string, salt: Uint8Array) {
  if (!password) throw new Error("Missing master password");
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    material,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptEntries(
  password: string,
  entries: VaultEntry[],
  persistedSalt?: string,
): Promise<PersistedVault> {
  const salt = persistedSalt ? base64Decode(persistedSalt) : crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const payload = encoder.encode(JSON.stringify(entries));
  const cipherBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload);

  return {
    cipher: base64Encode(cipherBuffer),
    iv: base64Encode(iv),
    salt: base64Encode(salt),
    lastUpdated: Date.now(),
    entryCount: entries.length,
  };
}

async function decryptEntries(password: string, vault: PersistedVault) {
  const salt = base64Decode(vault.salt);
  const iv = base64Decode(vault.iv);
  const key = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, base64Decode(vault.cipher));

  return JSON.parse(decoder.decode(decrypted)) as VaultEntry[];
}

const emptyEntry: FormState = {
  label: "",
  username: "",
  password: "",
  url: "",
  notes: "",
  tags: [],
  favorite: false,
};

const randomId = () => crypto.randomUUID();

const generatePassword = () => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()";
  const passwordArray = Array.from(crypto.getRandomValues(new Uint32Array(18)));
  return passwordArray.map((value) => charset[value % charset.length]).join("");
};

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);

const copyToClipboard = async (value: string, label: string) => {
  if (!navigator?.clipboard) {
    alert("Clipboard is unavailable in this context.");
    return;
  }
  await navigator.clipboard.writeText(value);
  alert(`${label} copied to clipboard`);
};

function EntryForm({
  initialState,
  onSubmit,
  onCancel,
}: {
  initialState: FormState;
  onSubmit: (entry: FormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(initialState);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-900/50 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {form.id ? "Update credential" : "Store new credential"}
          </h3>
          <p className="text-sm text-slate-400">Encrypts instantly with your master password</p>
        </div>
        <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-400 hover:text-white">
          Close
        </button>
      </div>

      <form
        className="mt-6 grid grid-cols-1 gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <label className="text-sm font-medium text-slate-100">
          Label
          <input
            required
            value={form.label}
            onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
            placeholder="e.g. CRM Production"
            className="mt-1 w-full rounded-xl border border-white/5 bg-slate-800/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-100">
          Username / Email
          <input
            required
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            placeholder="account@email.com"
            className="mt-1 w-full rounded-xl border border-white/5 bg-slate-800/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-100">
          Password
          <div className="mt-1 flex gap-2">
            <input
              required
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="Strong password"
              className="w-full rounded-xl border border-white/5 bg-slate-800/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="button"
              className="rounded-xl border border-cyan-400/30 px-3 text-sm font-medium text-cyan-300 transition hover:border-cyan-400 hover:text-white"
              onClick={() => setForm((prev) => ({ ...prev, password: generatePassword() }))}
            >
              Generate
            </button>
          </div>
        </label>

        <label className="text-sm font-medium text-slate-100">
          URL
          <input
            value={form.url}
            onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
            placeholder="https://"
            className="mt-1 w-full rounded-xl border border-white/5 bg-slate-800/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-100">
          Notes
          <textarea
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            placeholder="Multi-factor location, owners, etc."
            className="mt-1 min-h-[90px] w-full rounded-xl border border-white/5 bg-slate-800/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-100">
          Tags
          <div className="mt-2 flex flex-wrap gap-2">
            {defaultTags.map((tag) => {
              const selected = form.tags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      tags: selected ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
                    }))
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    selected
                      ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-300/70"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-100">
          <input
            type="checkbox"
            checked={form.favorite}
            onChange={(event) => setForm((prev) => ({ ...prev, favorite: event.target.checked }))}
            className="h-4 w-4 rounded border-white/20 bg-slate-800 text-cyan-400 focus:ring-0"
          />
          Mark as favorite
        </label>

        <button
          type="submit"
          className="mt-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
        >
          {form.id ? "Save changes" : "Add credential"}
        </button>
      </form>
    </div>
  );
}

function StatTile({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200 shadow-lg shadow-slate-900/40 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      {subtext ? <p className="text-xs text-slate-400">{subtext}</p> : null}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center text-slate-300">
      <p className="text-lg font-semibold text-white">Your vault is ready to be filled</p>
      <p className="mt-2 text-sm text-slate-400">
        Start by adding your first credential. Everything stays local and encrypted with your master password.
      </p>
      <button
        onClick={onCreate}
        className="mt-6 rounded-full bg-white/10 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/40 transition hover:bg-white/20"
      >
        Add credential
      </button>
    </div>
  );
}

function LockedState({
  hasVault,
  onUnlock,
  onSetup,
  error,
  busy,
}: {
  hasVault: boolean;
  onUnlock: (password: string) => void;
  onSetup: (password: string, confirm: string) => void;
  error?: string;
  busy: boolean;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="max-w-xl rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-white shadow-2xl shadow-black/60 backdrop-blur">
      <h2 className="text-2xl font-semibold">{hasVault ? "Unlock vault" : "Create a master password"}</h2>
      <p className="mt-2 text-sm text-slate-300">
        {hasVault
          ? "We never store your master password. Use the one you created previously to decrypt your vault."
          : "Choose a master password that you do not use anywhere else. It encrypts everything locally."}
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (hasVault) {
            onUnlock(password);
          } else {
            onSetup(password, confirm);
          }
        }}
      >
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Master password"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
        {!hasVault ? (
          <input
            type="password"
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Confirm master password"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        ) : null}
        {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:brightness-110 disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Please wait..." : hasVault ? "Unlock" : "Create and unlock vault"}
        </button>
      </form>
    </div>
  );
}

function CredentialRow({
  entry,
  onEdit,
  onDelete,
}: {
  entry: VaultEntry;
  onEdit: (entry: VaultEntry) => void;
  onDelete: (id: string) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/40 p-4 shadow-lg shadow-black/40 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-white">{entry.label}</p>
          {entry.favorite ? (
            <span className="text-xs font-semibold uppercase text-amber-300">Favorite</span>
          ) : null}
        </div>
        <p className="text-sm text-slate-400">{entry.username}</p>
        {entry.url ? (
          <a href={entry.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 hover:text-cyan-200">
            {entry.url}
          </a>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Updated {formatDate(entry.lastUpdated)}</p>
      </div>

      <div className="flex flex-col gap-2 text-sm text-slate-200 sm:text-right">
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 font-mono text-xs tracking-wide text-white">
          {revealed ? entry.password : "•".repeat(16)}
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            onClick={() => setRevealed((prev) => !prev)}
            className="rounded-xl border border-white/10 px-3 py-1 text-xs text-slate-200 hover:border-cyan-300 hover:text-white"
          >
            {revealed ? "Hide" : "Reveal"}
          </button>
          <button
            onClick={() => copyToClipboard(entry.password, "Password")}
            className="rounded-xl border border-white/10 px-3 py-1 text-xs text-slate-200 hover:border-cyan-300 hover:text-white"
          >
            Copy
          </button>
          <button
            onClick={() => onEdit(entry)}
            className="rounded-xl border border-white/10 px-3 py-1 text-xs text-slate-200 hover:border-cyan-300 hover:text-white"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${entry.label}? You cannot recover this credential.`)) {
                onDelete(entry.id);
              }
            }}
            className="rounded-xl border border-rose-500/40 px-3 py-1 text-xs text-rose-200 hover:bg-rose-500/10"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PasswordManagerApp({
  storageKey = STORAGE_KEY,
  headline = "Heybassh Password Manager",
  description = "Dedicated vault for CRM credentials, keys, and secrets. Everything stays local and encrypted with your master password.",
  embedded = false,
  loadVault,
  saveVault,
}: PasswordManagerProps) {
  const [status, setStatus] = useState<"loading" | "setup" | "locked" | "unlocked">("loading");
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [persisted, setPersisted] = useState<PersistedVault | null>(null);
  const [master, setMaster] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<FormState>(emptyEntry);
  const [filters, setFilters] = useState({ search: "", tag: "All" });

  useEffect(() => {
    let cancelled = false;

    if (loadVault) {
      setStatus("loading");
      loadVault()
        .then((data) => {
          if (cancelled) return;
          if (!data) {
            setStatus("setup");
            return;
          }
          setPersisted(data);
          setStatus("locked");
        })
        .catch((err) => {
          console.error("Vault load failed", err);
          if (!cancelled) {
            setStatus("setup");
          }
        });

      return () => {
        cancelled = true;
      };
    }

    if (typeof window === "undefined") return;
    const cached = window.localStorage.getItem(storageKey);
    if (!cached) {
      setStatus("setup");
      return;
    }
    try {
      const data: PersistedVault = JSON.parse(cached);
      setPersisted(data);
      setStatus("locked");
    } catch (err) {
      console.error("Vault parse failed", err);
      window.localStorage.removeItem(storageKey);
      setStatus("setup");
    }
  }, [storageKey, loadVault]);

  useEffect(() => {
    if (status !== "unlocked" || !master) return;
    let cancelled = false;
    setSaving(true);
    encryptEntries(master, entries, persisted?.salt)
      .then(async (payload) => {
        if (cancelled) return;
        try {
          if (saveVault) {
            await saveVault(payload);
          } else if (typeof window !== "undefined") {
            window.localStorage.setItem(storageKey, JSON.stringify(payload));
          }
          if (!cancelled) {
            setPersisted(payload);
          }
        } catch (err) {
          console.error("Persist failed", err);
        }
      })
      .catch((err) => {
        console.error("Persist failed", err);
      })
      .finally(() => !cancelled && setSaving(false));

    return () => {
      cancelled = true;
    };
  }, [entries, master, status, storageKey, persisted?.salt, saveVault]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        filters.search.length === 0 ||
        [entry.label, entry.username, entry.url, entry.notes]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesTag = filters.tag === "All" || entry.tags.includes(filters.tag);
      return matchesSearch && matchesTag;
    });
  }, [entries, filters]);

  const stats = useMemo(
    () => ({
      total: entries.length,
      favorites: entries.filter((entry) => entry.favorite).length,
      lastUpdated: persisted?.lastUpdated,
    }),
    [entries, persisted?.lastUpdated],
  );

  const resetForm = () => {
    setEditing(emptyEntry);
    setFormVisible(false);
  };

  const handleUnlock = async (password: string) => {
    if (!persisted) return;
    setBusy(true);
    setError(undefined);
    try {
      const decrypted = await decryptEntries(password, persisted);
      setEntries(decrypted);
      setMaster(password);
      setStatus("unlocked");
    } catch {
      setError("Unable to decrypt vault. Check your master password.");
    } finally {
      setBusy(false);
    }
  };

  const handleSetup = (password: string, confirm: string) => {
    if (password.length < 12) {
      setError("Use at least 12 characters for better security.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setMaster(password);
    setEntries([]);
    setStatus("unlocked");
    setError(undefined);
  };

  const saveEntry = (payload: FormState) => {
    if (!payload.label || !payload.username || !payload.password) return;
    setEntries((prev) => {
      if (payload.id) {
        return prev.map((entry) =>
          entry.id === payload.id ? { ...entry, ...payload, lastUpdated: Date.now() } : entry,
        );
      }
      return [
        {
          id: randomId(),
          label: payload.label,
          username: payload.username,
          password: payload.password,
          url: payload.url,
          notes: payload.notes,
          tags: payload.tags,
          favorite: payload.favorite,
          lastUpdated: Date.now(),
        },
        ...prev,
      ];
    });
    resetForm();
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const logout = () => {
    setStatus("locked");
    setEntries([]);
    setMaster("");
  };

  const clearVault = () => {
    if (confirm("This removes the encrypted vault from this browser. You cannot undo it.")) {
      if (saveVault) {
        saveVault(null).catch((err) => {
          console.error("Persist failed", err);
        });
      } else if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey);
      }
      setPersisted(null);
      setEntries([]);
      setMaster("");
      setStatus("setup");
    }
  };

  if (status === "loading") {
    return (
      <div
        className={
          embedded
            ? "flex min-h-[320px] items-center justify-center rounded-[32px] border border-[#1a2446] bg-[#050b1c]"
            : "flex min-h-screen items-center justify-center bg-slate-950"
        }
      >
        <p className="text-sm text-slate-300">Booting password manager…</p>
      </div>
    );
  }

  if (status === "locked" || status === "setup") {
    return (
      <div
        className={
          embedded
            ? "rounded-[32px] border border-[#1a2446] bg-[#050b1c] px-6 py-8 text-white"
            : "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16"
        }
      >
        <div className={embedded ? "space-y-6" : "mx-auto max-w-4xl space-y-10"}>
          <header className="space-y-4 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Heybassh Security</p>
            <h1 className="text-4xl font-semibold">{headline}</h1>
            <p className="text-lg text-slate-300">{description}</p>
          </header>
          <LockedState hasVault={status === "locked"} onUnlock={handleUnlock} onSetup={handleSetup} error={error} busy={busy} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        embedded
          ? "rounded-[32px] border border-[#1a2446] bg-[#050b1c] px-4 py-6 text-white"
          : "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 text-white"
      }
    >
      <div className={embedded ? "space-y-6" : "mx-auto max-w-6xl space-y-8"}>
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Heybassh Security</p>
            <h1 className="mt-2 text-4xl font-bold">{headline}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setEditing(emptyEntry);
                setFormVisible(true);
              }}
              className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 px-6 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 hover:brightness-110"
            >
              Add credential
            </button>
            <button onClick={logout} className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white hover:border-white/40">
              Lock
            </button>
            <button
              onClick={clearVault}
              className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-rose-200 hover:border-rose-200/70"
            >
              Reset vault
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Credentials" value={stats.total} />
          <StatTile label="Favorites" value={stats.favorites} />
          <StatTile label="Last updated" value={stats.lastUpdated ? formatDate(stats.lastUpdated) : "Just now"} />
          <StatTile label="Sync status" value={saving ? "Encrypting…" : "Secure & local"} subtext="Data never leaves this browser" />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 gap-2">
              <input
                value={filters.search}
                onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                placeholder="Search label, username, notes…"
                className="flex-1 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
              <select
                value={filters.tag}
                onChange={(event) => setFilters((prev) => ({ ...prev, tag: event.target.value }))}
                className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                <option>All</option>
                {defaultTags.map((tag) => (
                  <option key={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              {filteredEntries.length} result
              {filteredEntries.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {filteredEntries.length === 0 ? (
              <EmptyState
                onCreate={() => {
                  setEditing(emptyEntry);
                  setFormVisible(true);
                }}
              />
            ) : (
              filteredEntries.map((entry) => (
                <CredentialRow
                  key={entry.id}
                  entry={entry}
                  onEdit={(value) => {
                    setEditing(value);
                    setFormVisible(true);
                  }}
                  onDelete={deleteEntry}
                />
              ))
            )}
          </div>
        </section>

        {formVisible ? <EntryForm initialState={editing} onSubmit={saveEntry} onCancel={resetForm} /> : null}
      </div>
    </div>
  );
}

export type { VaultEntry, PasswordManagerProps, PersistedVault };


