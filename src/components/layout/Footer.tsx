import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Heart, Terminal, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                ChiperLab
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Learn Cryptography Through Experimentation. Understand mathematical foundations, simulate classical ciphers, and explore modern Web Crypto APIs.
            </p>
            <p className="text-[11px] font-semibold tracking-wide text-sky-600 dark:text-sky-400">
              Understand. Experiment. Solve.
            </p>
          </div>

          {/* Learn Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Learn Academy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/learn" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Academy Overview
                </Link>
              </li>
              <li>
                <Link to="/learn/fundamentals" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  12 Fundamentals
                </Link>
              </li>
              <li>
                <Link to="/learn/algorithms" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Algorithms Catalog
                </Link>
              </li>
              <li>
                <Link to="/learn/roadmap" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Learning Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Playground & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Playground
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/playground/encrypt" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Encrypt & Decrypt
                </Link>
              </li>
              <li>
                <Link to="/playground/hash" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  SHA-256 / SHA-512 Hash
                </Link>
              </li>
              <li>
                <Link to="/playground/analyze" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Frequency Analysis
                </Link>
              </li>
              <li>
                <Link to="/playground/analyze" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Caesar Brute-Force Cracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Challenges & Academy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Challenges
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/challenges/quiz" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Cryptography Quiz
                </Link>
              </li>
              <li>
                <Link to="/challenges/puzzle" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Crypto Puzzles
                </Link>
              </li>
              <li>
                <Link to="/challenges/attack" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Attack Simulations
                </Link>
              </li>
              <li>
                <Link to="/progress" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  My Progress & XP
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span>© 2026 ChiperLab</span>
            <span>•</span>
            <span className="text-slate-500 dark:text-slate-400">Educational Cryptography Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              100% Client-Side Web Crypto
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
