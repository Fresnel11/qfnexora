import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout';
import { useAuth } from '../../store/AuthContext';
// import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  // const { t } = useTranslation();
  const { resetPassword, resendOtp, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Récupérer l'email depuis l'URL ou localStorage
  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    const emailFromStorage = localStorage.getItem('resetEmail');
    
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      localStorage.setItem('resetEmail', emailFromUrl);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // Pas d'email trouvé, rediriger vers forgot-password
      navigate('/forgot-password');
    }
  }, [searchParams, navigate]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Seulement 6 chiffres
    setOtpCode(value);
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    if (newPassword.length < 6) {
      return;
    }

    const result = await resetPassword(email, otpCode, newPassword);
    if (result.success) {
      // Nettoyer l'email en attente
      localStorage.removeItem('resetEmail');
      // Rediriger vers login avec message de succès
      navigate('/login', { 
        state: { message: 'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.' }
      });
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    
    const result = await resendOtp(email);
    if (result.success) {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000); // Masquer le message après 5s
    }
    
    setResendLoading(false);
  };

  const isFormValid = otpCode.length === 6 && newPassword.length >= 6 && newPassword === confirmPassword;

  if (!email) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Réinitialiser le mot de passe</h2>
      
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Code envoyé à :
        </p>
        <p className="font-medium text-gray-800 dark:text-white">{email}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">
            Code de vérification *
          </label>
          <input
            type="text"
            value={otpCode}
            onChange={handleOtpChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white text-center text-lg tracking-widest"
            placeholder="000000"
            maxLength={6}
            required
            autoFocus
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Saisissez le code à 6 chiffres reçu par email
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">
            Nouveau mot de passe *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) clearError();
              }}
              className="w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="Nouveau mot de passe"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Minimum 6 caractères
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">
            Confirmer le mot de passe *
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) clearError();
            }}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            placeholder="Confirmer le mot de passe"
            required
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded">
            ✅ Nouveau code envoyé avec succès !
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition disabled:opacity-60"
          disabled={loading || !isFormValid}
        >
          {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Vous n'avez pas reçu le code ?
        </p>
        <button
          onClick={handleResendOtp}
          disabled={resendLoading}
          className="text-blue-600 hover:underline dark:text-blue-400 text-sm disabled:opacity-60"
        >
          {resendLoading ? 'Envoi...' : 'Renvoyer le code'}
        </button>
      </div>

      <div className="text-center mt-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">Retour à </span>
        <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
          la connexion
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword; 