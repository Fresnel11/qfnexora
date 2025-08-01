import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout';
import { useAuth } from '../../store/AuthContext';
// import { useTranslation } from 'react-i18next';

const Login = () => {
  // const { t } = useTranslation();
  const { login, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Afficher le message de succès si on vient de vérifier l'email
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Nettoyer le state pour éviter de réafficher le message
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    if (result.success) {
      // Rediriger vers la page d'origine ou le dashboard
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
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
        
        {successMessage && (
          <div className="text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded">
            ✅ {successMessage}
          </div>
        )}
        
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
                    <Link to="/forgot-password" className="text-blue-600 hover:underline dark:text-blue-400">Mot de passe oublié ?</Link>
                    <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">Créer un compte</Link>
                  </div>
    </AuthLayout>
  );
};

export default Login; 