import React, { useState } from 'react';
import AuthLayout from '../../components/Auth/AuthLayout';
// import { useAuth } from '../../hooks/useAuth'; // À activer si tu as un hook d'auth
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

const Login = () => {
  // const { t } = useTranslation();
  // const { login } = useAuth();
  // const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // await login({ email, password });
      // navigate('/dashboard');
      setLoading(false);
    } catch (err) {
      setError('Identifiants invalides'); // t('login.error')
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Connexion</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Mot de passe</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition disabled:opacity-60"
          disabled={loading}
        >
          {/* {t('login.button')} */}
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <div className="flex justify-between mt-4 text-sm">
        <a href="/forgot-password" className="text-blue-600 hover:underline dark:text-blue-400">Mot de passe oublié ?</a>
        <a href="/register" className="text-blue-600 hover:underline dark:text-blue-400">Créer un compte</a>
      </div>
    </AuthLayout>
  );
};

export default Login; 