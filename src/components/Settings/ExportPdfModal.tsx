import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import { formatCurrency } from '../../utils/currency';
import { filterTransactionsByMonth, getMonthName, calculateTotalByType } from '../../utils/finance';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { X } from 'lucide-react';

interface ExportPdfModalProps {
  onClose: () => void;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({ onClose }) => {
  const { state } = useFinance();
  const { getTranslation } = useTranslation();
  const t = (key: any) => getTranslation(key, state.language);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const handleExport = async () => {
    const reportElement = document.getElementById('report-container');
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`quantum-finance-report-${selectedMonth}-${selectedYear}.pdf`);
    
    onClose();
  };

  const filteredTransactions = filterTransactionsByMonth(
    state.transactions,
    selectedMonth,
    selectedYear
  );

  const totalIncome = calculateTotalByType(filteredTransactions, 'income');
  const totalExpense = calculateTotalByType(filteredTransactions, 'expense');
  const balance = totalIncome - totalExpense;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-dark w-full max-w-4xl rounded-lg shadow-xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white">
              {t('exportPdf')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                {t('selectMonthYear')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('month')}
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/50"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {getMonthName(month)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('year')}
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/50"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div id="report-container" className="bg-white text-black p-6 rounded-lg shadow-inner">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-display font-bold">
                  {t('financialReport')}
                </h1>
                <p className="text-gray-600">
                  {getMonthName(selectedMonth)} {selectedYear}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm text-gray-600 mb-1">{t('income')}</h3>
                  <p className="text-xl font-bold text-green-500">
                    {formatCurrency(totalIncome, state.currency)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm text-gray-600 mb-1">{t('expense')}</h3>
                  <p className="text-xl font-bold text-red-500">
                    {formatCurrency(totalExpense, state.currency)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm text-gray-600 mb-1">{t('totalBalance')}</h3>
                  <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(balance, state.currency)}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">{t('transactions')}</h3>
              {filteredTransactions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">{t('noTransactionsFound')}</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">{t('date')}</th>
                      <th className="border border-gray-300 p-2 text-left">{t('description')}</th>
                      <th className="border border-gray-300 p-2 text-left">{t('category')}</th>
                      <th className="border border-gray-300 p-2 text-left">{t('type')}</th>
                      <th className="border border-gray-300 p-2 text-left">{t('amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-200">
                        <td className="border border-gray-300 p-2">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 p-2">{transaction.description}</td>
                        <td className="border border-gray-300 p-2">{t(transaction.category)}</td>
                        <td className="border border-gray-300 p-2">{t(transaction.type)}</td>
                        <td 
                          className={`border border-gray-300 p-2 font-semibold ${
                            transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {formatCurrency(transaction.amount, state.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                onClick={handleExport}
                className="bg-gradient-to-r from-primary to-secondary text-dark font-bold py-2 px-6 rounded-md hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('generate')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};