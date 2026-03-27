"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/components/settings-provider";
import type { IssuerSettings } from "@/types/invoice";
import Link from "next/link";

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </label>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, isLoaded } = useSettings();
  const [form, setForm] = useState<IssuerSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setForm(settings);
    }
  }, [isLoaded, settings]);

  function update<K extends keyof IssuerSettings>(
    key: K,
    value: IssuerSettings[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!isLoaded) {
    return (
      <div className="py-12 text-center text-gray-400">読み込み中...</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <Link
          href="/invoices"
          className="text-sm text-blue-600 hover:underline"
        >
          請求一覧に戻る
        </Link>
      </div>

      <div className="grid gap-6">
        <FormSection title="発行者情報">
          <Field
            label="会社名 / 屋号"
            value={form.companyName}
            onChange={(v) => update("companyName", v)}
            placeholder="株式会社○○"
          />
          <Field
            label="代表者名"
            value={form.representativeName}
            onChange={(v) => update("representativeName", v)}
            placeholder="上原 千翔"
          />
          <Field
            label="郵便番号"
            value={form.postalCode}
            onChange={(v) => update("postalCode", v)}
            placeholder="〒000-0000"
          />
          <Field
            label="住所"
            value={form.address}
            onChange={(v) => update("address", v)}
            placeholder="東京都..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="電話番号"
              value={form.phone}
              onChange={(v) => update("phone", v)}
              placeholder="090-0000-0000"
              type="tel"
            />
            <Field
              label="メールアドレス"
              value={form.email}
              onChange={(v) => update("email", v)}
              placeholder="info@example.com"
              type="email"
            />
          </div>
        </FormSection>

        <FormSection title="インボイス登録番号">
          <Field
            label="適格請求書発行事業者の登録番号"
            value={form.registrationNumber}
            onChange={(v) => update("registrationNumber", v)}
            placeholder="T1234567890123"
          />
          <p className="text-xs text-gray-500">
            T + 13桁の数字（例: T1234567890123）
          </p>
        </FormSection>

        <FormSection title="振込先口座">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="銀行名"
              value={form.bankName}
              onChange={(v) => update("bankName", v)}
              placeholder="○○銀行"
            />
            <Field
              label="支店名"
              value={form.branchName}
              onChange={(v) => update("branchName", v)}
              placeholder="○○支店"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                口座種別
              </span>
              <select
                value={form.accountType}
                onChange={(e) =>
                  update("accountType", e.target.value as "普通" | "当座")
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="普通">普通</option>
                <option value="当座">当座</option>
              </select>
            </label>
            <Field
              label="口座番号"
              value={form.accountNumber}
              onChange={(v) => update("accountNumber", v)}
              placeholder="1234567"
            />
            <Field
              label="口座名義"
              value={form.accountHolder}
              onChange={(v) => update("accountHolder", v)}
              placeholder="カ）○○"
            />
          </div>
        </FormSection>

        <FormSection title="デフォルト備考">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              備考欄のデフォルト文言
            </span>
            <textarea
              value={form.defaultNotes}
              onChange={(e) => update("defaultNotes", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="お振込手数料はお客様にてご負担をお願いいたします。"
            />
          </label>
        </FormSection>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            保存
          </button>
          {saved && (
            <span className="text-sm text-green-600">保存しました</span>
          )}
        </div>
      </div>
    </div>
  );
}
