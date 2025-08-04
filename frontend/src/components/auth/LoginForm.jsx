import React, { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMetamask, setIsMetamask] = useState(false);
  const { connectWallet } = useWeb3();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isMetamask) {
      await connectWallet();
    } else {
      // Traditional email/password login
      console.log('Email login:', email, password);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        {!isMetamask && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </>
        )}

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="metamask"
            checked={isMetamask}
            onChange={(e) => setIsMetamask(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="metamask" className="text-gray-700">
            Login with MetaMask
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          {isMetamask ? 'Connect Wallet' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;