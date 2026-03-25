import React, { useEffect, useState } from 'react';

export interface ResetPasswordValues {
  email: string;
  code: string;
  password: string;
  platformURL: string;
}

export interface ResetPasswordFormProps {
  onSubmit: (values: ResetPasswordValues) => void | Promise<void>;
  initialValues?: Partial<ResetPasswordValues>;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const [values, setValues] = useState<ResetPasswordValues>({
    email: '',
    code: '',
    password: '',
    platformURL: '',
  });

  useEffect(() => {
    if (!initialValues) return;
    setValues((prev) => ({
      ...prev,
      ...initialValues,
    }));
  }, [initialValues]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit(values);
        }}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Restablecer contrasena</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleFieldChange}
          className="w-full mb-3 rounded border border-gray-300 px-3 py-2"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
          Codigo
        </label>
        <input
          id="code"
          name="code"
          type="text"
          value={values.code}
          onChange={handleFieldChange}
          className="w-full mb-3 rounded border border-gray-300 px-3 py-2"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
          Nueva contrasena
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleFieldChange}
          className="w-full mb-3 rounded border border-gray-300 px-3 py-2"
          required
        />

        <button
          type="submit"
          className="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
};
