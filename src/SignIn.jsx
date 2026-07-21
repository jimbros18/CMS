import { useState } from 'react';

export default function SignIn({ onSignIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }
        setError('');
        onSignIn({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 w-full max-w-sm">
                
                <div className="mb-6">
                    <h1 className="text-2xl font-medium text-white mb-1">Sign in</h1>
                    <p className="text-sm text-gray-400">Welcome back. Enter your credentials to continue.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="rounded px-3 py-2 bg-gray-700 text-white text-sm placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label className="text-xs text-gray-400">Password</label>
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="rounded px-3 py-2 bg-gray-700 text-white text-sm placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-400">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-white text-gray-900 font-medium text-sm py-2 rounded hover:bg-gray-100 transition-colors"
                    >
                        Sign in
                    </button>
                </form>

                <p className="text-xs text-gray-400 text-center">
                    Don't have an account? <a href="#" className="text-blue-400 hover:text-blue-300">Contact your administrator.</a>
                </p>

            </div>
        </div>
    );
}