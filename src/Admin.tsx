import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {CheckCircle2, Copy, Link as LinkIcon, MessageSquareText} from 'lucide-react';
import {CONFIG} from './App.tsx';
import {PREFIXES, buildDisplayName, guestLink, type Prefix} from './guest.ts';

const C = {
  bg: '#FBF9F1',
  card: '#FFFFFF',
  text: '#4E5A48',
  muted: '#7C8676',
  accent: '#7E9970',
  accentDark: '#5D7552',
  line: 'rgba(126, 153, 112, 0.35)',
};

function buildMessage(displayName: string, link: string) {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${CONFIG.groom} & ${CONFIG.bride}`;
}

export default function Admin() {
  const [prefix, setPrefix] = useState<Prefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{displayName: string; link: string} | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    document.title = `Admin · ${CONFIG.bride} & ${CONFIG.groom}`;
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const generate = () => {
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) return;
    setGenerated({displayName, link: guestLink(window.location.origin, displayName)});
  };

  const copy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers that block the async clipboard API (e.g. non-HTTPS)
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setToast(message);
  };

  const message = generated ? buildMessage(generated.displayName, generated.link) : '';
  const label = 'mb-1.5 block text-[0.68rem] uppercase tracking-[0.18em]';
  const field = 'w-full rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2';
  const fieldStyle = {background: C.bg, border: `1px solid ${C.line}`, color: C.text, ['--tw-ring-color' as string]: 'rgba(126,153,112,0.35)'};
  const button =
    'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="min-h-screen px-4 py-10" style={{background: C.bg, color: C.text, fontFamily: '"Montserrat", sans-serif'}}>
      <div className="mx-auto w-full max-w-lg">
        <header className="mb-8 text-center">
          <p style={{fontFamily: '"Great Vibes", cursive', color: C.accent, fontSize: '2.6rem', lineHeight: 1.2}}>
            {CONFIG.bride} &amp; {CONFIG.groom}
          </p>
          <p className="mt-1 text-[0.7rem] uppercase tracking-[0.3em]" style={{color: C.muted}}>
            Invitation link generator
          </p>
        </header>

        <div className="rounded-3xl p-6 sm:p-8" style={{background: C.card, border: `1px solid ${C.line}`, boxShadow: '0 18px 40px -28px rgba(50,75,40,0.45)'}}>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              generate();
            }}
          >
            <div>
              <label htmlFor="prefix" className={label} style={{color: C.accent}}>
                Select prefix
              </label>
              <select id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value as Prefix)} className={field} style={fieldStyle}>
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guest" className={label} style={{color: C.accent}}>
                Guest name
              </label>
              <input
                id="guest"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Sanjaya"
                autoComplete="off"
                className={field}
                style={fieldStyle}
              />
              {guestName.trim() && (
                <p className="mt-2 text-xs" style={{color: C.muted}}>
                  Shown as: <span style={{color: C.text, fontWeight: 600}}>{buildDisplayName(prefix, guestName)}</span>
                </p>
              )}
            </div>

            <button type="submit" disabled={!guestName.trim()} className={button} style={{background: C.accent, color: '#fff'}}>
              <LinkIcon size={16} /> Generate link
            </button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && copy(generated.link, 'Link copied!')}
              className={button}
              style={{background: C.bg, color: C.accentDark, border: `1px solid ${C.line}`}}
            >
              <Copy size={15} /> Copy link only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => copy(message, 'Message copied!')}
              className={button}
              style={{background: C.accentDark, color: '#fff'}}
            >
              <MessageSquareText size={15} /> Copy full message
            </button>
          </div>

          {generated && (
            <motion.div className="mt-7 space-y-4" initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}}>
              <div>
                <p className={label} style={{color: C.accent}}>
                  Generated link
                </p>
                <a
                  href={generated.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all rounded-xl px-4 py-3 font-mono text-xs underline-offset-2 hover:underline"
                  style={{background: C.bg, border: `1px solid ${C.line}`, color: C.accentDark}}
                >
                  {generated.link}
                </a>
              </div>
              <div>
                <p className={label} style={{color: C.accent}}>
                  Website greeting
                </p>
                <p className="rounded-xl px-4 py-3 text-center italic" style={{background: C.bg, border: `1px solid ${C.line}`, fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem'}}>
                  We cordially invite <strong style={{color: C.accentDark}}>{generated.displayName}</strong> to celebrate our special day with us.
                </p>
              </div>
              <div>
                <p className={label} style={{color: C.accent}}>
                  WhatsApp message
                </p>
                <pre
                  className="whitespace-pre-wrap break-words rounded-xl px-4 py-3 text-[0.82rem] leading-relaxed"
                  style={{background: '#E7F0DE', border: `1px solid ${C.line}`, fontFamily: 'inherit', color: C.text}}
                >
                  {message}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide shadow-lg"
            style={{background: C.accentDark, color: '#fff'}}
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 12}}
          >
            <CheckCircle2 size={15} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
