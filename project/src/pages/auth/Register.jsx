import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout';
import { useAuth } from '../../store/AuthContext';
// import { useTranslation } from 'react-i18next';

const Register = () => {
  // const { t } = useTranslation();
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    userType: 'individual',
    password: '',
    companyName: '',
    companyWebsite: '',
    companyAddress: '',
    companyDescription: '',
    companyLogoUrl: '',
    IFU: ''
  });



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Préparer les données selon le type d'utilisateur
    const submitData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      userType: formData.userType,
      password: formData.password
    };

    // Ajouter les champs entreprise seulement si userType est "company"
    if (formData.userType === 'company') {
      submitData.companyName = formData.companyName;
      submitData.companyWebsite = formData.companyWebsite;
      submitData.companyAddress = formData.companyAddress;
      submitData.companyDescription = formData.companyDescription;
      submitData.companyLogoUrl = formData.companyLogoUrl;
      submitData.IFU = formData.IFU;
    }

    console.log('Envoi des données au service register...');
    const result = await register(submitData);
    console.log('Résultat du register:', result);
    if (result.success) {
      console.log('Inscription réussie, redirection vers verify-email...');
      // Stocker l'email pour la page de vérification
      localStorage.setItem('pendingEmail', formData.email);
      // Rediriger vers la page de vérification avec l'email en paramètre
      const redirectUrl = `/verify-email?email=${encodeURIComponent(formData.email)}`;
      console.log('URL de redirection:', redirectUrl);
      navigate(redirectUrl);
    } else {
      console.log('Échec de l\'inscription:', result.error);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Créer un compte</h2>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Type d'utilisateur */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">Type de compte</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="individual"
                checked={formData.userType === 'individual'}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">Particulier</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="company"
                checked={formData.userType === 'company'}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">Entreprise</span>
            </label>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Prénom *</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Nom *</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Téléphone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Date de naissance *</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Mot de passe *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            required
            minLength={6}
          />
        </div>

        {/* Champs entreprise - conditionnels */}
        {formData.userType === 'company' && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Informations entreprise</h3>
            
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Nom de l'entreprise *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                required={formData.userType === 'company'}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Site web</label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Adresse</label>
              <textarea
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder="Adresse complète de l'entreprise"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Description</label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder="Description de l'activité de l'entreprise"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Logo URL</label>
              <input
                type="url"
                name="companyLogoUrl"
                value={formData.companyLogoUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">IFU</label>
              <input
                type="text"
                name="IFU"
                value={formData.IFU}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder="Numéro IFU de l'entreprise"
              />
            </div>
          </div>
        )}

        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Création du compte...' : 'Créer mon compte'}
        </button>
      </form>

      <div className="text-center mt-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">Déjà un compte ? </span>
        <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400">Se connecter</a>
      </div>
    </AuthLayout>
  );
};

export default Register; 