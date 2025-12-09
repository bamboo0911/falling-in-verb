
import React from 'react';
import { LogOut, Globe, MessageCircle, User, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Language, LANGUAGE_CONFIGS } from '../types';

interface Props {
  currentLanguage: Language | null;
  onLanguageChange: (lang: Language) => void;
  instructionLang: string;
  onInstructionLangChange: (lang: string) => void;
  instructionLanguages: { id: string; label: string; flag: string }[];
  uiLabels: any;
}

export const Settings: React.FC<Props> = ({
  currentLanguage,
  onLanguageChange,
  instructionLang,
  onInstructionLangChange,
  instructionLanguages,
  uiLabels
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-charcoal">{uiLabels.settingsTitle}</h2>
        <p className="text-stone-grey text-sm">{uiLabels.settingsSubtitle}</p>
      </div>

      {/* Account Section */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-mist-dark space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-mist flex items-center justify-center text-stone-400 text-2xl font-bold border-2 border-white shadow-md">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.displayName?.[0] || <User />
            )}
          </div>
          <div>
            <h3 className="font-bold text-charcoal text-lg">{user?.displayName || 'Guest User'}</h3>
            <p className="text-stone-grey text-sm">{user?.email || 'Not logged in'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 px-4 rounded-xl border border-rose-dust/20 text-rose-dust font-bold hover:bg-rose-dust/10 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> {uiLabels.signOut}
        </button>
      </section>

      {/* Learning Language */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-4">
        <div className="flex items-center gap-2 text-stone-grey font-bold border-b border-mist-dark pb-2">
          <Globe size={18} className="text-rose-dust" />
          <h3>{uiLabels.targetLanguage}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(LANGUAGE_CONFIGS).map((config) => {
            const isActive = currentLanguage === config.id;
            return (
              <button
                key={config.id}
                onClick={() => onLanguageChange(config.id)}
                className={`
                  relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left
                  ${isActive
                    ? 'border-rose-dust bg-rose-dust/10'
                    : 'border-mist-dark hover:border-rose-dust/50 hover:bg-mist'}
                `}
              >
                <span className="text-2xl">{config.flag}</span>
                <span className={`font-bold ${isActive ? 'text-rose-dust' : 'text-charcoal'}`}>
                  {config.name}
                </span>
                {isActive && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-rose-dust text-white rounded-full p-1">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Instruction Language */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-4">
        <div className="flex items-center gap-2 text-stone-grey font-bold border-b border-mist-dark pb-2">
          <MessageCircle size={18} className="text-rose-dust" />
          <h3>{uiLabels.explanationLanguage}</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {instructionLanguages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onInstructionLangChange(lang.id)}
              className={`
                py-2 px-3 rounded-xl text-sm font-medium transition-all border
                ${instructionLang === lang.id
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-white text-stone-grey border-mist-dark hover:border-charcoal'}
              `}
            >
              <span className="mr-2">{lang.flag}</span> {lang.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
