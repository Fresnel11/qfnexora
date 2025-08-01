import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout';
import { useAuth } from '../../store/AuthContext';
// import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  // const { t } = useTranslation();
  const { forgotPassword, loading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccess(false);
    
    const result = await forgotPassword(email);
    if (result.success) {
      setSuccess(true);
      // Stocker l'email pour la page de réinitialisation
      localStorage.setItem('resetEmail', email);
      
      // Redirection automatique après 2 secondes
      setTimeout(() => {
        window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
      }, 2000);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Mot de passe oublié</h2>
      
      {!success ? (
        <>
          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Entrez votre adresse email. Nous vous enverrons un code de réinitialisation.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">
                Adresse email *
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder="votre@email.com"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition disabled:opacity-60"
              disabled={loading || !email}
            >
              {loading ? 'Envoi...' : 'Envoyer le code de réinitialisation'}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Code envoyé !
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Nous avons envoyé un code de réinitialisation à <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vérifiez votre boîte de réception et vos spams.
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Redirection automatique vers la page de réinitialisation dans 2 secondes...
          </p>
          
          <div className="mt-6 space-y-3">
            <Link
              to={`/reset-password?email=${encodeURIComponent(email)}`}
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition text-center"
            >
              Réinitialiser maintenant
            </Link>
            
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="block w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Utiliser un autre email
            </button>
          </div>
        </div>
      )}

      <div className="text-center mt-6 text-sm">
        <span className="text-gray-600 dark:text-gray-400">Vous vous souvenez de votre mot de passe ? </span>
        <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
          Se connecter
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword; 