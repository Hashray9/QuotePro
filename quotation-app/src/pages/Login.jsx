import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { salespeople } from '../data/salespeople';
import { Zap } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const [role, setRole] = useState('');
  const [selectedSP, setSelectedSP] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      login('admin');
    } else if (role === 'salesperson' && selectedSP) {
      login('salesperson', parseInt(selectedSP));
    }
  };

  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="login-logo-section">
          <motion.img
            src="/images/logo.png"
            alt="ElectroMart"
            className="login-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1>ElectroMart Solutions</h1>
            <p>Smart Quotes, Faster Sales</p>
          </motion.div>
        </div>

        <motion.form
          className="login-form"
          onSubmit={handleLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="form-group">
            <label>Login As</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => { setRole(e.target.value); setSelectedSP(''); }}
            >
              <option value="">Select role...</option>
              <option value="admin">Admin</option>
              <option value="salesperson">Salesperson</option>
            </select>
          </div>

          {role === 'salesperson' && (
            <motion.div
              className="form-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label>Select Salesperson</label>
              <select
                className="form-select"
                value={selectedSP}
                onChange={(e) => setSelectedSP(e.target.value)}
              >
                <option value="">Choose salesperson...</option>
                {salespeople.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.name} — {sp.region}</option>
                ))}
              </select>
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="login-button"
            disabled={!role || (role === 'salesperson' && !selectedSP)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Zap size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
            Enter QuotePro
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
