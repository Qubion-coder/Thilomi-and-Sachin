import {useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ChevronDown, Heart, MapPin, Music, Phone, Send, VolumeX} from 'lucide-react';
import {readGuestFromUrl} from './guest.ts';

// Personalised guest name from the link, e.g. /Mr.%20Sanjaya -> "Mr. Sanjaya"
const GUEST = readGuestFromUrl();

// ---- Invitation details (edit here) ----
export const CONFIG = {
  bride: 'Thilomi',
  groom: 'Sachin',
  initials: ['T', 'S'],
  parents1: 'Mr. & Mrs. Wijeekoon',
  parents2: 'Mr. & Mrs. Basnayake',
  weekday: 'MONDAY',
  month: 'DECEMBER',
  day: '21',
  year: '2026',
  time: '10 AM',
  timeRange: '10 AM to 4 PM',
  coverDate: '21 . 12 . 2026',
  saveDate: '21 . 12 . 26',
  untilText: 'Until Monday, December 21, 2026',
  // Local time in Sri Lanka (+05:30)
  eventStart: '2026-12-21T10:00:00+05:30',
  eventEnd: '2026-12-21T16:00:00+05:30',
  venueName: "Earl's Regent Hotel",
  venueCity: 'Kandy',
  venueAddress: "Earl's Regent Hotel, Thennekumbura, Kandy",
  mapLink: 'https://maps.app.goo.gl/HFBPQg55CUNXCk1J6',
  timeline: [
    {time: '10.00 AM', title: 'Guest Arrival', icon: 'cocktail'},
    {time: '10.40 AM', title: 'Poruwa Ceremony', icon: 'rings'},
    {time: '11.30 AM', title: 'Wedding Reception', icon: 'camera'},
    {time: '1.00 PM', title: 'Lunch Buffet', icon: 'dinner'},
    {time: '3.40 PM', title: 'Going Away', icon: 'car'},
  ] as const,
  rsvpNote: 'Your presence would mean the world to us. Kindly let us know in advance.',
  rsvpSubNote: '',
  maxGuests: 10,
  // Google Apps Script web-app /exec URL (see code.ts) that saves RSVPs and wishes
  sheetEndpoint: 'https://script.google.com/macros/s/AKfycbzWuRmSOCZvqtJBO7byRCpYkyexUgkvLM9G2hHy9dXlPJ_0DA1lTH8GgKS_CT6h6W0noA/exec',
  // Background song: put the file at public/song.mp3
  song: '/song.mp3',
  contacts: [] as {name: string; phone: string}[],
};

const C = {
  bg: '#FBF9F1',
  text: '#4E5A48',
  muted: '#7C8676',
  gold: '#7E9970',
  goldDark: '#5D7552',
  line: 'rgba(126, 153, 112, 0.38)',
};

const F = {
  body: 'var(--font-sn-body), "Cormorant Garamond", Georgia, serif',
  display: 'var(--font-sn-display), "Great Vibes", cursive',
  marcellus: 'var(--font-marcellus), "Marcellus", serif',
  serif: 'var(--font-serif), "Playfair Display", serif',
  cinzel: 'var(--font-cinzel), "Cinzel", serif',
  montserrat: 'var(--font-montserrat), "Montserrat", sans-serif',
  mea: 'var(--font-mea), "Mea Culpa", cursive',
};

const glass: CSSProperties = {
  position: 'relative',
  background: 'linear-gradient(150deg,rgba(251,250,243,0.88) 0%,rgba(240,244,234,0.82) 100%)',
  backdropFilter: 'blur(11px)',
  WebkitBackdropFilter: 'blur(11px)',
  boxShadow: '0 18px 40px -24px rgba(50,75,40,0.5), inset 0 1px 0 rgba(255,255,255,0.65)',
  borderRadius: 24,
};

const pillButton: CSSProperties = {
  background: 'linear-gradient(145deg,#FBFAF4 0%,#E4EBDA 100%)',
  boxShadow:
    '-5px -5px 12px rgba(255,255,255,0.9), 6px 7px 16px rgba(120,140,110,0.22), inset 0 1px 1px rgba(255,255,255,0.7)',
  color: C.goldDark,
};

const goldText: CSSProperties = {
  fontFamily: F.display,
  background: 'linear-gradient(180deg, #A8BE9A 0%, #7E9970 52%, #5D7552 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: C.gold,
  fontWeight: 600,
};

function Reveal({children, className, style, y = 18}: {children: ReactNode; className?: string; style?: CSSProperties; y?: number}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{opacity: 0, y}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.2}}
      transition={{duration: 0.9, ease: [0.22, 1, 0.36, 1]}}
    >
      {children}
    </motion.div>
  );
}

function Divider({className = ''}: {className?: string}) {
  return (
    <div className={`relative z-[1] flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-12 sm:w-20" style={{background: `linear-gradient(90deg, transparent, ${C.gold})`}} />
      <span className="h-[6px] w-[6px] rotate-45 border" style={{borderColor: C.gold}} />
      <span className="h-px w-12 sm:w-20" style={{background: `linear-gradient(-90deg, transparent, ${C.gold})`}} />
    </div>
  );
}

function SectionTitle({eyebrow, first, accent}: {eyebrow: string; first: string; accent: string}) {
  const view = {once: true, amount: 0.6};
  return (
    <Reveal className="mb-12 text-center sm:mb-16">
      <span className="mb-3 block text-[0.72rem] uppercase tracking-[0.34em]" style={{fontFamily: F.montserrat, color: C.gold}}>
        {eyebrow}
      </span>
      <h2
        className="leading-tight"
        style={{fontFamily: F.cinzel, fontWeight: 600, color: C.text, fontSize: 'clamp(1.5rem,3.6vw,2.5rem)', letterSpacing: '0.07em'}}
      >
        {first} <span style={{color: C.gold}}>{accent}</span>
      </h2>
      <span className="mt-5 flex items-center justify-center gap-3" aria-hidden="true">
        <motion.span
          className="h-px origin-right"
          style={{width: 52, background: `linear-gradient(90deg, transparent, ${C.gold})`}}
          initial={{scaleX: 0}}
          whileInView={{scaleX: 1}}
          viewport={view}
          transition={{duration: 0.8, delay: 0.2}}
        />
        <motion.span
          style={{color: C.gold, fontSize: 12}}
          initial={{opacity: 0, scale: 0}}
          whileInView={{opacity: 1, scale: 1}}
          viewport={view}
          transition={{duration: 0.5, delay: 0.6}}
        >
          ✦
        </motion.span>
        <motion.span
          className="h-px origin-left"
          style={{width: 52, background: `linear-gradient(-90deg, transparent, ${C.gold})`}}
          initial={{scaleX: 0}}
          whileInView={{scaleX: 1}}
          viewport={view}
          transition={{duration: 0.8, delay: 0.2}}
        />
      </span>
    </Reveal>
  );
}

// Script initials, the second letter tucked down and to the right of the first
function Monogram({size, color}: {size: string; color?: string}) {
  const letter: CSSProperties = color
    ? {fontFamily: F.display, color, fontWeight: 400}
    : {...goldText, fontWeight: 400};
  return (
    <span className="relative inline-block select-none" style={{fontSize: size, lineHeight: 1, width: '1.3em', height: '1.1em'}} aria-hidden="true">
      <span className="absolute" style={{...letter, left: '0', top: '-0.08em'}}>
        {CONFIG.initials[0]}
      </span>
      <span className="absolute" style={{...letter, left: '0.6em', top: '0.2em'}}>
        {CONFIG.initials[1]}
      </span>
    </span>
  );
}

// The printed card inside the open envelope image (positions are % of the 1024x1536 image)
function EnvelopeCard() {
  const small: CSSProperties = {fontFamily: F.marcellus, color: C.text, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '1.3cqw', lineHeight: 1.5, whiteSpace: 'nowrap'};
  return (
    <div
      className="pointer-events-none absolute flex flex-col items-center justify-center text-center"
      style={{left: '34.8%', width: '30%', top: '53.6%', height: '25.4%'}}
    >
      <Monogram size="5.6cqw" />
      <p style={{...small, marginTop: '1.4cqw'}}>With hearts full of love and warmth,</p>
      <p style={small}>{CONFIG.parents1}</p>
      <p style={{...small, fontSize: '1.2cqw'}}>together with</p>
      <p style={small}>{CONFIG.parents2}</p>
      <p style={small}>invite you to celebrate the marriage of</p>
      <p className="whitespace-nowrap" style={{...goldText, fontWeight: 400, fontSize: '4.4cqw', lineHeight: 1.35}}>
        {CONFIG.bride} &amp; {CONFIG.groom}
      </p>
      <p style={small}>
        {CONFIG.weekday} | {CONFIG.month} {CONFIG.day} {CONFIG.year} | {CONFIG.time}
      </p>
      <p style={{...small, marginTop: '0.6cqw'}}>
        {CONFIG.venueName}, {CONFIG.venueCity}
      </p>
    </div>
  );
}

// ---------------- Cover / envelope ----------------

function Cover({onOpened}: {onOpened: () => void}) {
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opening) return;
    setOpening(true);
    window.dispatchEvent(new Event('invite:open'));
    window.setTimeout(onOpened, 2600);
  };

  return (
    <motion.div
      role="dialog"
      aria-label="Tap the seal to open your invitation"
      className="fixed inset-0 z-[600] flex flex-col items-center justify-center overflow-hidden"
      style={{backgroundColor: C.bg}}
      initial={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.9, ease: 'easeInOut'}}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 sm:hidden"
        style={{backgroundImage: 'url(/beeralu-frame/cover-bg-mobile.webp)', backgroundSize: 'cover', backgroundPosition: 'center'}}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{backgroundImage: 'url(/beeralu-frame/cover-bg-web.webp)', backgroundSize: 'cover', backgroundPosition: 'center'}}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{background: 'rgba(250,249,241,0.34)'}} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(250,249,241,0.95) 0%, rgba(250,249,241,0.82) 16%, rgba(250,249,241,0.3) 30%, rgba(250,249,241,0.08) 42%, rgba(250,249,241,0.08) 72%, rgba(250,249,241,0.55) 88%, rgba(250,249,241,0.92) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 62% 20% at 50% 13%, rgba(251,250,243,0.95) 0%, rgba(251,250,243,0.5) 45%, transparent 72%), radial-gradient(ellipse 40% 8% at 50% 95%, rgba(251,250,243,0.9) 0%, transparent 75%)',
        }}
      />

      <div
        className="absolute left-1/2 top-[6.5%] w-[86%] -translate-x-1/2 text-center"
        style={{opacity: opening ? 0 : 1, transition: 'opacity 0.6s ease 0.05s'}}
      >
        {GUEST && (
          <p
            className="mb-1.5 italic"
            style={{fontFamily: F.body, color: C.goldDark, fontSize: 'clamp(1.05rem,4.2vw,1.3rem)', textShadow: '0 1px 2px rgba(250,249,241,0.95)'}}
          >
            Dear {GUEST},
          </p>
        )}
        <p
          className="uppercase"
          style={{
            fontFamily: F.marcellus,
            color: C.text,
            letterSpacing: '0.34em',
            fontSize: 'clamp(0.6rem,1.7vw,0.8rem)',
            textShadow: '0 1px 2px rgba(250,249,241,0.95)',
          }}
        >
          You are invited
        </p>
        <p className="mt-2 whitespace-nowrap leading-[1.3]" style={{...goldText, fontSize: 'clamp(2rem,8.4vw,3.4rem)'}}>
          {CONFIG.bride} &amp; {CONFIG.groom}
        </p>
        <p
          className="mt-1.5 uppercase"
          style={{
            fontFamily: F.marcellus,
            color: C.text,
            letterSpacing: '0.22em',
            fontSize: 'clamp(0.62rem,1.8vw,0.82rem)',
            fontVariantNumeric: 'lining-nums',
            textShadow: '0 1px 2px rgba(250,249,241,0.95)',
          }}
        >
          {CONFIG.coverDate}
        </p>
      </div>

      <motion.button
        type="button"
        aria-label="Open the envelope"
        onClick={open}
        className="relative mt-[5vh] block cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          width: 'min(88vw, 480px, calc(82vh * 1024 / 1536))',
          aspectRatio: '1024 / 1536',
          filter: 'drop-shadow(0 34px 50px rgba(78,90,72,0.3))',
          containerType: 'inline-size',
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}
        initial={{opacity: 0, y: 24, scale: 0.97}}
        animate={opening ? {opacity: 1, y: 0, scale: 1.04} : {opacity: 1, y: 0, scale: 1}}
        whileHover={opening ? undefined : {scale: 1.015}}
        whileTap={opening ? undefined : {scale: 0.985}}
        transition={{duration: 0.9, ease: [0.22, 1, 0.36, 1]}}
      >
        <div className="absolute inset-0 transition-opacity duration-700 ease-out" style={{opacity: opening ? 0 : 1}}>
          <img
            src="/beeralu-frame/envelope-closed.webp"
            alt=""
            aria-hidden="true"
            draggable={false}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full select-none object-contain"
          />
          {/* Seal sticker monogram */}
          <span className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{left: '48.6%', top: '79.9%'}}>
            <Monogram size="6.4cqw" color={C.text} />
          </span>
        </div>
        <div className="absolute inset-0 transition-opacity duration-700 ease-out" style={{opacity: opening ? 1 : 0}}>
          <img
            src="/beeralu-frame/envelope-open.webp"
            alt={`${CONFIG.bride} & ${CONFIG.groom} wedding invitation`}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-contain"
          />
          <EnvelopeCard />
        </div>
      </motion.button>

      <motion.p
        aria-hidden="true"
        className="absolute bottom-[6%] left-1/2 -translate-x-1/2 whitespace-nowrap uppercase"
        style={{
          fontFamily: F.marcellus,
          color: C.text,
          letterSpacing: '0.32em',
          fontSize: 'clamp(0.6rem,1.7vw,0.78rem)',
          textShadow: '0 1px 2px rgba(250,249,241,0.95)',
        }}
        initial={{opacity: 0}}
        animate={opening ? {opacity: 0} : {opacity: [0.35, 1, 0.35]}}
        transition={opening ? {duration: 0.4} : {duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8}}
      >
        Tap to open
      </motion.p>
    </motion.div>
  );
}

// ---------------- Hero ----------------

function Hero() {
  const script: CSSProperties = {
    fontFamily: F.body,
    fontStyle: 'italic',
    color: C.muted,
    letterSpacing: '0.02em',
    lineHeight: 1.45,
    textWrap: 'balance',
  };
  const sideLabel: CSSProperties = {
    fontFamily: F.marcellus,
    color: C.text,
    letterSpacing: '0.05em',
    fontSize: 'clamp(0.56rem,2.5vw,0.92rem)',
  };
  const vline: CSSProperties = {
    background: 'linear-gradient(rgba(126, 153, 112, 0), rgba(126, 153, 112, 0.55), rgba(126, 153, 112, 0))',
  };

  return (
    <section id="hero" className="relative mx-auto max-w-2xl px-6 pb-12 pt-12 text-center sm:pb-16 sm:pt-16">
      <Reveal className="flex flex-col items-center">
        <div className="mx-auto mb-9" style={{filter: 'drop-shadow(0 2px 6px rgba(70,95,60,0.18))'}}>
          <Monogram size="clamp(4.2rem,19vw,6.4rem)" />
        </div>
        {GUEST && (
          <div className="mb-9 flex flex-col items-center">
            <p className="max-w-[28ch] text-[1.02rem] sm:text-[1.15rem]" style={{...script, color: C.text}}>
              We cordially invite{' '}
              <span
                className="not-italic"
                style={{
                  ...goldText,
                  fontWeight: 400,
                  fontSize: GUEST.length > 22 ? '1.3em' : GUEST.length > 14 ? '1.5em' : '1.7em',
                  lineHeight: 1.3,
                  display: 'block',
                  whiteSpace: GUEST.length > 28 ? 'normal' : 'nowrap',
                }}
              >
                {GUEST}
              </span>
              to celebrate our special day with us.
            </p>
            <Divider className="mt-5" />
          </div>
        )}
        <p className="text-[0.98rem] sm:text-[1.08rem]" style={script}>
          With hearts full of love and warmth,
        </p>
        <div
          className="my-6 flex flex-col gap-1.5 text-[0.72rem] uppercase sm:text-[0.82rem]"
          style={{fontFamily: F.marcellus, color: C.text, letterSpacing: '0.1em', lineHeight: 1.5, textWrap: 'balance'}}
        >
          <p>{CONFIG.parents1}</p>
          <p
            className="text-[0.66rem] normal-case italic sm:text-[0.74rem]"
            style={{fontFamily: F.body, color: C.muted, letterSpacing: '0.04em'}}
          >
            together with
          </p>
          <p>{CONFIG.parents2}</p>
        </div>
        <p className="text-[0.98rem] sm:text-[1.08rem]" style={script}>
          invite you to celebrate the marriage of
        </p>
        <h1 className="my-6 leading-[1.35]" style={{...goldText, fontSize: 'clamp(1.85rem,8vw,5rem)', textWrap: 'nowrap'}}>
          {CONFIG.bride} <span style={{fontSize: '0.82em'}}>&amp;</span> {CONFIG.groom}
        </h1>

        <div className="mx-auto my-2 flex w-full items-stretch justify-center gap-3 sm:gap-4">
          <span className="self-center whitespace-nowrap uppercase" style={sideLabel}>
            {CONFIG.weekday}
          </span>
          <span aria-hidden="true" className="w-px self-stretch" style={vline} />
          <span className="flex flex-col items-center justify-center leading-none">
            <span className="uppercase" style={{fontFamily: F.marcellus, color: C.gold, letterSpacing: '0.16em', fontSize: '0.7rem'}}>
              {CONFIG.month}
            </span>
            <span className="my-1.5" style={{fontFamily: F.serif, color: C.text, fontWeight: 600, fontSize: 'clamp(2rem,8.6vw,3.4rem)'}}>
              {CONFIG.day}
            </span>
            <span style={{fontFamily: F.marcellus, color: C.text, letterSpacing: '0.14em', fontSize: '0.78rem'}}>{CONFIG.year}</span>
          </span>
          <span aria-hidden="true" className="w-px self-stretch" style={vline} />
          <span className="self-center whitespace-nowrap uppercase" style={sideLabel}>
            {CONFIG.time}
          </span>
        </div>

        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mx-auto mb-3 mt-10 h-7 w-7"
          fill="none"
          stroke={C.gold}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.5 9c0 6.5-8.5 14.5-8.5 14.5S3.5 15.5 3.5 9a8.5 8.5 0 1 1 17 0Z" />
          <circle cx="12" cy="9" r="4.5" />
        </svg>
        <div
          className="flex flex-col gap-1 uppercase"
          style={{fontFamily: F.marcellus, color: C.text, letterSpacing: '0.12em', fontSize: 'clamp(0.85rem,3vw,1.05rem)'}}
        >
          <p style={{fontWeight: 700}}>{CONFIG.venueName}</p>
          <p>{CONFIG.venueCity}</p>
        </div>
        <p className="mt-4 text-[0.95rem] italic" style={{fontFamily: F.body, color: C.muted}}>
          {CONFIG.timeRange}
        </p>
      </Reveal>
    </section>
  );
}

// ---------------- Countdown ----------------

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function CountdownTile({value, label}: {value: number; label: string}) {
  const text = String(value).padStart(2, '0');
  return (
    <div className="flex min-w-0 flex-1" style={{maxWidth: 92}}>
      <div
        className="relative flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-[18px]"
        style={{
          background: 'linear-gradient(150deg,rgba(251,250,243,0.88) 0%,rgba(240,244,234,0.82) 100%)',
          backdropFilter: 'blur(11px)',
          WebkitBackdropFilter: 'blur(11px)',
          boxShadow: '0 14px 30px -20px rgba(50,75,40,0.5), inset 0 1px 0 rgba(255,255,255,0.65)',
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[12px]"
          style={{inset: 6, border: '1px solid rgba(126, 153, 112, 0.4)'}}
        />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="relative z-[1] tabular-nums leading-none"
            style={{fontFamily: F.serif, fontWeight: 600, fontSize: 'clamp(1.15rem,5vw,2.15rem)', color: C.gold}}
            initial={{opacity: 0.5, y: -4}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 4}}
            transition={{duration: 0.35}}
          >
            {text}
          </motion.span>
        </AnimatePresence>
        <span
          className="relative z-[1] uppercase"
          style={{fontFamily: F.marcellus, letterSpacing: '0.05em', fontSize: 'clamp(0.42rem,1.9vw,0.62rem)', color: C.muted}}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function Countdown() {
  const target = new Date(CONFIG.eventStart).getTime();
  const [left, setLeft] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(getRemaining(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return (
    <section id="countdown" className="mx-auto max-w-6xl px-2.5 py-14 text-center sm:px-7 sm:py-20">
      <SectionTitle eyebrow="Counting down to forever" first="THE" accent="COUNTDOWN" />
      <Reveal className="mx-auto flex max-w-md justify-center gap-1.5 sm:gap-3.5">
        <CountdownTile value={left.days} label="Days" />
        <CountdownTile value={left.hours} label="Hours" />
        <CountdownTile value={left.minutes} label="Minutes" />
        <CountdownTile value={left.seconds} label="Seconds" />
      </Reveal>
      <p className="mt-8 text-[0.7rem] uppercase tracking-[0.28em]" style={{fontFamily: F.montserrat, color: C.muted}}>
        {CONFIG.untilText}
      </p>
    </section>
  );
}

// ---------------- Events + Add to calendar ----------------

function toIcsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function AddToCalendar() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const title = `${CONFIG.bride} & ${CONFIG.groom} Wedding`;
  const location = CONFIG.venueAddress;
  const details = CONFIG.timeline.map((t) => `${t.time} ${t.title}`).join(' · ');
  const start = toIcsDate(CONFIG.eventStart);
  const end = toIcsDate(CONFIG.eventEnd);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${encodeURIComponent(new Date(CONFIG.eventStart).toISOString())}&enddt=${encodeURIComponent(new Date(CONFIG.eventEnd).toISOString())}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

  const downloadIcs = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `UID:${start}-${CONFIG.bride}-${CONFIG.groom}@invitation`,
      `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      `LOCATION:${location.replace(/,/g, '\\,')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], {type: 'text/calendar'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding.ics';
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const itemClass = 'block w-full px-5 py-3 text-left text-base transition-colors hover:bg-white/50';
  const itemStyle: CSSProperties = {fontFamily: F.body, color: C.text, borderTop: '1px solid rgba(126, 153, 112, 0.2)'};

  return (
    <div className="mx-auto mt-6 max-w-md" ref={wrapRef}>
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(150deg,rgba(251,250,243,0.88) 0%,rgba(240,244,234,0.82) 100%)',
          border: '1px solid rgba(126, 153, 112, 0.4)',
          boxShadow: '0 18px 38px -28px rgba(93, 117, 82, 0.35)',
        }}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-white/40 focus:outline-none sm:px-5"
        >
          <span
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            style={{background: 'linear-gradient(145deg,#FBFAF4,#E4EBDA)', color: C.gold}}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v4M16 3v4" />
              <path d="M12 18c-2-1.3-3.4-2.6-3.4-4a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 1.4-1.4 2.7-3.4 4Z" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg leading-tight" style={{fontFamily: F.body, color: C.text}}>
              Add to Calendar
            </span>
            <motion.span
              className="mt-0.5 block text-xs"
              style={{color: 'rgba(78, 90, 72, 0.65)'}}
              initial={{opacity: 0, y: 4}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, delay: 0.3}}
            >
              Save the date to your calendar
            </motion.span>
          </span>
          <span
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
            style={{backgroundColor: 'rgba(93, 117, 82, 0.06)'}}
            aria-hidden="true"
          >
            <ChevronDown
              className="h-4 w-4 transition-transform duration-200"
              style={{color: C.goldDark, transform: open ? 'rotate(180deg)' : 'none'}}
            />
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              role="menu"
              initial={{height: 0, opacity: 0}}
              animate={{height: 'auto', opacity: 1}}
              exit={{height: 0, opacity: 0}}
              transition={{duration: 0.25}}
            >
              <a role="menuitem" href={google} target="_blank" rel="noopener noreferrer" className={itemClass} style={itemStyle} onClick={() => setOpen(false)}>
                Google Calendar
              </a>
              <button role="menuitem" type="button" className={itemClass} style={itemStyle} onClick={downloadIcs}>
                Apple Calendar
              </button>
              <a role="menuitem" href={outlook} target="_blank" rel="noopener noreferrer" className={itemClass} style={itemStyle} onClick={() => setOpen(false)}>
                Outlook
              </a>
              <button role="menuitem" type="button" className={itemClass} style={itemStyle} onClick={downloadIcs}>
                Download .ics file
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

type TimelineIcon = (typeof CONFIG.timeline)[number]['icon'];

const smallHeart = (cx: number, cy: number) =>
  `M${cx} ${cy + 3.4}c-2-1.3-3.4-2.6-3.4-4a1.6 1.6 0 0 1 3.4-.9 1.6 1.6 0 0 1 3.4.9c0 1.4-1.4 2.7-3.4 4Z`;

function ProgramIcon({name}: {name: TimelineIcon}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[clamp(34px,10vw,48px)] w-[clamp(34px,10vw,48px)]"
      style={{color: C.text}}
      aria-hidden="true"
    >
      {name === 'cocktail' && (
        <>
          <path d="M10 11h28L24 27Z" />
          <path d="M24 27v13M17 40h14" />
          <path d="M34 5l-7 12" />
          <circle cx="29.5" cy="13.5" r="2.4" />
        </>
      )}
      {name === 'rings' && (
        <>
          <circle cx="18.5" cy="31" r="10" />
          <circle cx="18.5" cy="31" r="7.6" />
          <circle cx="29.5" cy="31" r="10" />
          <circle cx="29.5" cy="31" r="7.6" />
          <path d={smallHeart(24, 10)} />
        </>
      )}
      {name === 'camera' && (
        <>
          <rect x="6" y="15" width="36" height="24" rx="4" />
          <path d="M17 15l3-5h8l3 5" />
          <path d="M10.5 19.5h4" />
          <circle cx="24" cy="27" r="7.5" />
          <path d={smallHeart(24, 26)} />
        </>
      )}
      {name === 'dinner' && (
        <>
          <circle cx="24" cy="25" r="11" />
          <circle cx="24" cy="25" r="7.5" />
          <path d="M7 10v7a3 3 0 0 0 3 3v19M10 10v7M13 10v7a3 3 0 0 1-3 3" />
          <path d="M40 39V10c-3 2.5-4.2 7-4.2 12.5H40" />
        </>
      )}
      {name === 'car' && (
        <>
          <path d="M5 33v-5c0-2 1-3.2 3-3.6l5-1.1 4.2-6.2c.9-1.4 2.1-2.1 3.8-2.1h7.6c1.7 0 2.9.7 3.8 2.1l4.2 6.2 4.4.9c2 .4 3 1.6 3 3.6V33" />
          <path d="M14.5 23.3h19" />
          <circle cx="13.5" cy="33" r="3.5" />
          <circle cx="34.5" cy="33" r="3.5" />
          <path d="M5 33h5M17 33h14M38 33h5" />
          <path d={smallHeart(41, 7)} />
          <path d={smallHeart(33.5, 3.5)} />
        </>
      )}
    </svg>
  );
}

function Timeline() {
  return (
    <div className="mx-auto max-w-md">
      <Reveal className="mb-10 mt-8 text-center">
        <div className="relative inline-block">
          <span
            className="absolute left-[-0.35em] top-[-0.62em] select-none"
            style={{fontFamily: F.display, color: C.gold, fontSize: 'clamp(2.6rem,10vw,3.6rem)', lineHeight: 1, opacity: 0.85}}
            aria-hidden="true"
          >
            The
          </span>
          <h2
            className="relative pl-6"
            style={{fontFamily: F.cinzel, fontWeight: 600, color: C.text, fontSize: 'clamp(1.5rem,6vw,2.4rem)', letterSpacing: '0.08em'}}
          >
            <span className="sr-only">The </span>PROGRAM
          </h2>
        </div>
      </Reveal>

      <div className="relative">
        <motion.span
          aria-hidden="true"
          className="absolute bottom-2 left-1/2 top-2 w-px origin-top -translate-x-1/2"
          style={{background: `linear-gradient(${C.line}, ${C.gold} 12%, ${C.gold} 88%, ${C.line})`}}
          initial={{scaleY: 0}}
          whileInView={{scaleY: 1}}
          viewport={{once: true, amount: 0.1}}
          transition={{duration: 1.6, ease: 'easeInOut'}}
        />
        <ol className="flex flex-col gap-7 sm:gap-9">
          {CONFIG.timeline.map((item, i) => {
            const textLeft = i % 2 === 0;
            const text = (
              <div className={`flex flex-col ${textLeft ? 'items-end text-right' : 'items-start text-left'}`}>
                <span style={{fontFamily: F.body, color: C.text, fontSize: 'clamp(1.15rem,4.4vw,1.5rem)', lineHeight: 1.1, fontWeight: 500}}>
                  {item.time}
                </span>
                <span
                  aria-hidden="true"
                  className="my-1 h-px w-full max-w-[7.5rem]"
                  style={{background: textLeft ? `linear-gradient(90deg, transparent, ${C.gold})` : `linear-gradient(-90deg, transparent, ${C.gold})`}}
                />
                <span
                  className="uppercase"
                  style={{fontFamily: F.marcellus, color: C.goldDark, fontSize: 'clamp(0.6rem,2.3vw,0.78rem)', letterSpacing: '0.12em', lineHeight: 1.35}}
                >
                  {item.title}
                </span>
              </div>
            );
            const icon = (
              <div className={`flex ${textLeft ? 'justify-start' : 'justify-end'}`}>
                <ProgramIcon name={item.icon} />
              </div>
            );
            return (
              <motion.li
                key={item.title}
                className="grid items-center"
                style={{gridTemplateColumns: '1fr 28px 1fr'}}
                initial={{opacity: 0, y: 16}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.5}}
                transition={{duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
              >
                {textLeft ? text : icon}
                <span className="flex justify-center" aria-hidden="true">
                  <span
                    className="block h-3.5 w-3.5 rounded-full"
                    style={{background: C.gold, boxShadow: `0 0 0 4px ${C.bg}, 0 0 0 5px ${C.line}`}}
                  />
                </span>
                {textLeft ? icon : text}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Events() {
  return (
    <section id="events" className="mx-auto max-w-6xl px-3 py-14 text-center sm:px-7 sm:py-20">
      <Timeline />
      <AddToCalendar />
    </section>
  );
}

// ---------------- Venue ----------------

function Venue() {
  const mapQuery = encodeURIComponent(CONFIG.venueAddress);
  return (
    <section id="venue" className="mx-auto max-w-6xl px-6 py-14 text-center sm:px-7 sm:py-20">
      <SectionTitle eyebrow="How to find us" first="THE" accent="VENUE" />
      <Reveal className="mx-auto flex max-w-md flex-col items-center gap-5 px-3.5 py-8 sm:px-8 sm:py-9" style={glass}>
        <span aria-hidden="true" className="pointer-events-none absolute" style={{inset: 8, borderRadius: 20, border: `1px solid ${C.line}`}} />
        <MapPin className="relative z-[1] h-9 w-9" strokeWidth={1.2} style={{color: C.gold}} aria-hidden="true" />
        <div className="relative z-[1] flex flex-col items-center gap-1.5">
          <h3
            className="uppercase"
            style={{fontFamily: F.marcellus, color: C.text, letterSpacing: '0.18em', fontSize: 'clamp(1.05rem,4vw,1.5rem)'}}
          >
            {CONFIG.venueName}
          </h3>
          <span className="uppercase" style={{fontFamily: F.marcellus, color: C.gold, letterSpacing: '0.22em', fontSize: '0.78rem'}}>
            {CONFIG.venueCity}
          </span>
        </div>
        <Divider />
        <p className="relative z-[1] max-w-[34ch]" style={{fontFamily: F.body, color: C.text, fontSize: '1.05rem'}}>
          {CONFIG.venueAddress}
        </p>
        <div
          className="relative z-[1] w-full overflow-hidden rounded-[16px]"
          style={{border: '1px solid rgba(126, 153, 112, 0.35)', aspectRatio: '4 / 3'}}
        >
          <iframe
            title={`Map of ${CONFIG.venueName}, ${CONFIG.venueCity}`}
            src={`https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
            style={{filter: 'grayscale(0.15) saturate(0.92)'}}
          />
        </div>
        <a
          href={CONFIG.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-[1] inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.15em] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
          style={{...pillButton, fontFamily: F.montserrat}}
        >
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" /> View on Map
        </a>
      </Reveal>
    </section>
  );
}

// ---------------- RSVP ----------------

function Rsvp() {
  const [name, setName] = useState(GUEST);
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null);
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [hint, setHint] = useState('');

  const label: CSSProperties = {fontFamily: F.montserrat, color: C.gold};
  const choice = (active: boolean): CSSProperties => ({
    fontFamily: F.marcellus,
    letterSpacing: '0.08em',
    fontSize: '0.6rem',
    color: active ? '#FBF9F1' : C.muted,
    background: active ? 'linear-gradient(145deg,#A8BE9A,#5D7552)' : 'linear-gradient(145deg,#FBFAF4,#E4EBDA)',
    boxShadow: active
      ? 'inset 2px 2px 6px rgba(40,60,35,0.35), 0 1px 0 rgba(255,255,255,0.7)'
      : '-4px -4px 10px rgba(255,255,255,0.9), 5px 6px 13px rgba(120,140,110,0.2), inset 0 1px 1px rgba(255,255,255,0.7)',
  });
  const stepper: CSSProperties = {background: 'rgba(78, 90, 72, 0.1)', color: C.text, border: '1px solid rgba(126, 153, 112, 0.5)'};

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!attending) {
      setHint('Please let us know if you will attend.');
      return;
    }
    setHint('');
    setStatus('sending');
    try {
      await sendToSheet({
        type: 'rsvp',
        name: name.trim(),
        attendance: attending,
        guests: attending === 'yes' ? guests : 0,
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="rsvp" className="mx-auto max-w-6xl px-6 py-14 text-center sm:px-7 sm:py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <span className="mb-3 block text-[0.72rem] uppercase tracking-[0.34em]" style={{fontFamily: F.montserrat, color: C.gold}}>
          Kindly reply
        </span>
        <h2
          className="leading-tight"
          style={{fontFamily: F.cinzel, color: C.gold, fontWeight: 600, fontSize: 'clamp(1.9rem,5vw,2.9rem)', letterSpacing: '0.1em'}}
        >
          RSVP
        </h2>
        <Divider className="mb-8 mt-5" />
        <p
          className="mx-auto mb-8 max-w-[34ch] text-[1.05rem] italic"
          style={{fontFamily: F.body, color: C.text, textWrap: 'balance'}}
        >
          {CONFIG.rsvpNote}
        </p>
        {CONFIG.rsvpSubNote && (
          <p className="-mt-5 mb-8 text-[0.7rem] uppercase tracking-[0.26em]" style={{fontFamily: F.montserrat, color: C.gold}}>
            {CONFIG.rsvpSubNote}
          </p>
        )}

        <form onSubmit={submit} className="relative mx-auto max-w-md px-4 pb-8 pt-8 text-left sm:px-9 sm:pb-9 sm:pt-9" style={glass}>
          <span aria-hidden="true" className="pointer-events-none absolute" style={{inset: 8, borderRadius: 20, border: `1px solid ${C.line}`}} />

          {status === 'done' ? (
            <motion.div
              className="relative z-[1] flex flex-col items-center gap-3 py-6 text-center"
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
            >
              <Heart className="h-7 w-7" style={{color: C.gold, fill: C.gold}} aria-hidden="true" />
              <p style={{...goldText, fontSize: '2rem'}}>Thank you{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}</p>
              <p className="italic" style={{fontFamily: F.body, color: C.text, fontSize: '1.05rem'}}>
                {attending === 'yes' ? 'We can’t wait to celebrate with you.' : 'You will be missed. Thank you for letting us know.'}
              </p>
            </motion.div>
          ) : (
            <>
              <div className="relative z-[1] mb-5 flex flex-col gap-1.5">
                <label htmlFor="lv-name" className="text-[0.68rem] uppercase tracking-[0.18em]" style={label}>
                  Full name
                </label>
                <input
                  id="lv-name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 focus:outline-none"
                  style={{
                    fontFamily: F.body,
                    background: C.bg,
                    border: '1px solid rgba(126, 153, 112, 0.45)',
                    borderRadius: 10,
                    color: C.text,
                    fontSize: '1.05rem',
                  }}
                />
              </div>

              <div className="relative z-[1] mb-5">
                <p className="mb-2.5 text-[0.68rem] uppercase tracking-[0.18em]" style={label}>
                  Will you attend?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending('yes')}
                    aria-pressed={attending === 'yes'}
                    className="flex min-w-0 flex-1 items-center justify-center rounded-full px-3 py-3.5 text-center uppercase leading-tight transition-all"
                    style={choice(attending === 'yes')}
                  >
                    Joyfully accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending('no')}
                    aria-pressed={attending === 'no'}
                    className="flex min-w-0 flex-1 items-center justify-center rounded-full px-3 py-3.5 text-center uppercase leading-tight transition-all"
                    style={choice(attending === 'no')}
                  >
                    Regretfully decline
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {attending !== 'no' && (
                  <motion.div
                    className="relative z-[1] mb-5 overflow-hidden"
                    initial={{height: 0, opacity: 0}}
                    animate={{height: 'auto', opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                  >
                    <p className="mb-2.5 text-[0.68rem] uppercase tracking-[0.18em]" style={label}>
                      Number of guests
                    </p>
                    <div className="flex items-center justify-center gap-6">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="grid h-11 w-11 place-items-center rounded-full text-xl transition-all hover:opacity-80 active:scale-90"
                        style={stepper}
                        aria-label="Decrease guest count"
                      >
                        -
                      </button>
                      <span
                        className="leading-none"
                        style={{fontFamily: F.serif, color: C.text, fontSize: '2.6rem', minWidth: '3rem', textAlign: 'center'}}
                      >
                        {guests}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(CONFIG.maxGuests, g + 1))}
                        disabled={guests >= CONFIG.maxGuests}
                        className="grid h-11 w-11 place-items-center rounded-full text-xl transition-all hover:opacity-80 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
                        style={stepper}
                        aria-label="Increase guest count"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {(hint || status === 'error') && (
                <p className="relative z-[1] mb-3 text-center text-sm italic" style={{fontFamily: F.body, color: '#9A5B4B'}}>
                  {hint || 'Something went wrong. Please try again.'}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="relative z-[1] mx-auto mt-1 flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.15em] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
                style={{...pillButton, fontFamily: F.marcellus}}
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                {status === 'sending' ? 'Sending…' : 'Send our RSVP'}
              </button>
            </>
          )}
        </form>
      </Reveal>
    </section>
  );
}

// ---------------- Wishes ----------------

type Wish = {name: string; message: string};

// Sent as a form field so the request stays "simple" and needs no CORS preflight
async function sendToSheet(payload: Record<string, unknown>) {
  if (!CONFIG.sheetEndpoint) return;
  const body = new URLSearchParams({payload: JSON.stringify({...payload, submittedAt: new Date().toISOString()})});
  await fetch(CONFIG.sheetEndpoint, {method: 'POST', mode: 'no-cors', body});
}

function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  useEffect(() => {
    if (!CONFIG.sheetEndpoint) return;
    fetch(`${CONFIG.sheetEndpoint}?type=wishes`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.wishes)) setWishes(d.wishes);
      })
      .catch(() => {});
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const wish = {name: name.trim() || 'A friend', message: message.trim()};
    if (!wish.message) return;
    setStatus('sending');
    try {
      await sendToSheet({type: 'wish', ...wish});
      setWishes((w) => [wish, ...w]);
      setMessage('');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const label: CSSProperties = {fontFamily: F.montserrat, color: C.gold};
  const field: CSSProperties = {
    fontFamily: F.body,
    background: C.bg,
    border: '1px solid rgba(126, 153, 112, 0.45)',
    borderRadius: 10,
    color: C.text,
    fontSize: '1.05rem',
  };

  return (
    <section id="wishes" className="mx-auto max-w-6xl px-6 py-14 text-center sm:px-7 sm:py-20">
      <SectionTitle eyebrow="Leave a little love" first="YOUR" accent="WISHES" />
      <Reveal className="mx-auto max-w-md">
        <form onSubmit={submit} className="relative px-4 pb-8 pt-8 text-left sm:px-9 sm:pb-9 sm:pt-9" style={glass}>
          <span aria-hidden="true" className="pointer-events-none absolute" style={{inset: 8, borderRadius: 20, border: `1px solid ${C.line}`}} />
          <div className="relative z-[1] mb-5 flex flex-col gap-1.5">
            <label htmlFor="wish-name" className="text-[0.68rem] uppercase tracking-[0.18em]" style={label}>
              Your name
            </label>
            <input
              id="wish-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none"
              style={field}
            />
          </div>
          <div className="relative z-[1] mb-5 flex flex-col gap-1.5">
            <label htmlFor="wish-message" className="text-[0.68rem] uppercase tracking-[0.18em]" style={label}>
              Your wishes
            </label>
            <textarea
              id="wish-message"
              required
              rows={4}
              maxLength={1000}
              placeholder="Write a message for the couple…"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (status !== 'sending') setStatus('idle');
              }}
              className="w-full resize-none px-4 py-3 focus:outline-none"
              style={field}
            />
          </div>
          {status === 'done' && (
            <p className="relative z-[1] mb-3 text-center italic" style={{fontFamily: F.body, color: C.goldDark}}>
              Thank you for your lovely wishes!
            </p>
          )}
          {status === 'error' && (
            <p className="relative z-[1] mb-3 text-center text-sm italic" style={{fontFamily: F.body, color: '#9A5B4B'}}>
              Something went wrong. Please try again.
            </p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="relative z-[1] mx-auto mt-1 flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.15em] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
            style={{...pillButton, fontFamily: F.marcellus}}
          >
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            {status === 'sending' ? 'Sending…' : 'Send wishes'}
          </button>
        </form>

        {wishes.length > 0 && (
          <div className="beeralu-scroll mt-6 flex max-h-[420px] flex-col gap-3 overflow-y-auto text-left">
            {wishes.map((w, i) => (
              <motion.div
                key={`${w.name}-${i}-${w.message.slice(0, 12)}`}
                className="px-5 py-4"
                style={{...glass, borderRadius: 18}}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: Math.min(i, 6) * 0.05}}
              >
                <p className="italic" style={{fontFamily: F.body, color: C.text, fontSize: '1.05rem', lineHeight: 1.5, whiteSpace: 'pre-line'}}>
                  “{w.message}”
                </p>
                <p className="mt-2 text-[0.66rem] uppercase tracking-[0.18em]" style={{fontFamily: F.montserrat, color: C.gold}}>
                  — {w.name}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}

// ---------------- Footer ----------------

function Footer() {
  return (
    <section id="footer" className="mx-auto max-w-6xl px-6 py-12 sm:px-7 sm:py-20">
      <Reveal
        className="relative overflow-hidden px-4 py-12 text-center sm:px-16 sm:py-16"
        style={{
          ...glass,
          color: C.text,
          borderRadius: 'clamp(40px,8vw,90px) clamp(40px,8vw,90px) 30px 30px',
          border: '1px solid rgba(126, 153, 112, 0.3)',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 sm:inset-5"
          style={{borderRadius: 'clamp(30px,7vw,78px) clamp(30px,7vw,78px) 20px 20px', border: '1px solid rgba(126, 153, 112, 0.28)'}}
        />
        <div className="relative">
          <div className="text-[0.82rem] uppercase tracking-[0.4em]" style={{fontFamily: F.montserrat, color: C.gold}}>
            Save the date
          </div>
          <div
            className="my-3.5 whitespace-nowrap"
            style={{fontFamily: F.serif, fontWeight: 500, fontSize: 'clamp(1.6rem,7.2vw,5rem)', lineHeight: 1, letterSpacing: '0.04em', color: C.text}}
          >
            {CONFIG.saveDate}
          </div>
          <div className="mb-5" style={{fontFamily: F.mea, color: C.gold, fontSize: 'clamp(1.4rem,5vw,2.5rem)', textWrap: 'balance'}}>
            With love &amp; gratitude.
          </div>
          <div className="mb-7 mt-3 whitespace-nowrap leading-[1.35]" style={{...goldText, fontSize: 'clamp(1.4rem,6vw,2.1rem)'}}>
            {CONFIG.bride} &amp; {CONFIG.groom}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {CONFIG.contacts.map((c) => (
              <a
                key={c.phone}
                href={`tel:${c.phone}`}
                aria-label={`Call ${c.name}`}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.13em] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 sm:px-6"
                style={{...pillButton, fontFamily: F.montserrat}}
              >
                <Phone className="h-3.5 w-3.5" style={{color: C.gold}} aria-hidden="true" /> {c.name}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ---------------- Background music ----------------

function MusicToggle({visible}: {visible: boolean}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // The envelope tap is a user gesture, so browsers allow playback to start here
    const start = () => {
      audioRef.current?.play().catch(() => {});
    };
    window.addEventListener('invite:open', start);
    return () => window.removeEventListener('invite:open', start);
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={CONFIG.song}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setAvailable(false)}
      />
      <AnimatePresence>
        {visible && available && (
          <motion.button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause music' : 'Play music'}
            className="fixed bottom-4 right-4 z-[500] grid h-11 w-11 place-items-center rounded-full"
            style={pillButton}
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0}}
          >
            <motion.span
              className="grid place-items-center"
              animate={playing ? {rotate: 360} : {rotate: 0}}
              transition={playing ? {duration: 6, repeat: Infinity, ease: 'linear'} : {duration: 0.3}}
            >
              {playing ? <Music className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------- App ----------------

export default function App() {
  const [coverOpen, setCoverOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!coverOpen) scrollRef.current?.scrollTo({top: 0});
  }, [coverOpen]);

  return (
    <>
      <div
        className="fixed inset-0 w-full overflow-hidden"
        style={{
          backgroundColor: C.bg,
          color: C.text,
          fontFamily: F.body,
          fontSize: 17,
          lineHeight: 1.6,
          backgroundImage:
            'radial-gradient(1200px 600px at 82% -6%, rgba(126, 153, 112, 0.1), transparent 60%), radial-gradient(900px 520px at -12% 26%, rgba(126, 153, 112, 0.12), transparent 60%)',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          isolation: 'isolate',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 hidden sm:block"
          style={{
            zIndex: -1,
            backgroundImage: 'url(/beeralu-frame/frame-web.webp)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 sm:hidden"
          style={{
            zIndex: -1,
            backgroundImage: 'url(/beeralu-frame/frame-mobile.webp)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0" style={{zIndex: 2}}>
          <div className="absolute bottom-[7.5%] left-[17.5%] right-[19%] top-[8.5%] rounded-[22px] sm:bottom-[12.5%] sm:left-[10%] sm:right-[12%] sm:top-[15%] sm:rounded-[32px]">
            <div
              ref={scrollRef}
              className="beeralu-scroll relative h-full overflow-y-auto overflow-x-hidden rounded-[22px] sm:rounded-[32px]"
              style={{WebkitOverflowScrolling: 'touch'}}
            >
              {!coverOpen && (
                <div className="relative" style={{zIndex: 2}}>
                  <Hero />
                  <Countdown />
                  <Events />
                  <Venue />
                  <Rsvp />
                  <Wishes />
                  <Footer />
                  <div className="px-4 py-7 text-center">
                    <p className="text-[0.7rem] tracking-wide" style={{color: C.muted}}>
                      Created with <Heart className="-mt-0.5 inline h-3 w-3" style={{color: C.gold, fill: C.gold}} aria-hidden="true" /> by{' '}
                      <span className="tracking-[0.2em]" style={{color: C.gold}}>
                        INVITEMINT
                      </span>
                    </p>
                    <p className="mx-auto mt-2 max-w-[34ch] text-xs tracking-wider" style={{fontFamily: F.montserrat, color: C.goldDark}}>
                      Want a beautiful wedding website like this? Create yours with{' '}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://wa.me/94707819074"
                        className="font-semibold underline underline-offset-2 transition-colors hover:text-[#4E5A48]"
                        style={{color: C.gold}}
                      >
                        invitemint
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>{coverOpen && <Cover onOpened={() => setCoverOpen(false)} />}</AnimatePresence>
      <MusicToggle visible={!coverOpen} />
    </>
  );
}
