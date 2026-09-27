import realEstateImg from './assets/contract/real estate.jpg'
import businessImg   from './assets/contract/business.jpg'
import civilImg      from './assets/contract/Civil.jpg'

export const SECTORS = [
  {
    slug: 'real-estate',
    menuLabel: 'Real Estate Law',
    comingSoon: false,
    eyebrow: 'Shops, offices, homes, and land',
    headline: "Renting or buying a place? We'll read the lease with you.",
    subhead:
      "You do not need to know legal words. If a landlord, seller, or agent sent you a long PDF, upload it. We'll tell you who pays, who can kick you out, and what happens if your business is slower than you hoped.",
    dropdownBlurb: 'Leases, shop rentals, and buying papers — explained like a friend, not a lawyer.',
    mobileCard: 'Upload a lease or purchase PDF. We flag rent jumps, repair bills, deposits, and whether you can leave early.',
    img: realEstateImg,
    buttonCta: 'Check my lease or purchase PDF',
    whatThisIs:
      'Real estate papers are anything you sign about a place: a shop, office, warehouse, apartment, house, or land. They decide the rent, who fixes things, whether you can leave, and what you lose if you walk away.',
    whenYouNeedThis: [
      'You found your first shop or office and the landlord sent a lease',
      'You are renting a room, stall, or shared workspace for the business',
      'You are buying a small property and they sent a purchase agreement',
      'They added "a few extra pages" the night before you move in',
      'You want your deposit back and the contract looks messy',
    ],
    uploadThese: [
      'Shop, office, or warehouse lease',
      'Home or apartment rental',
      'Purchase / sale agreement (buying)',
      'Extra pages they call an addendum',
      'Building or HOA rules, if they gave you any',
    ],
    weLookFor: [
      { title: 'Rent surprises',          plain: 'Can they raise the rent whenever they want, or only once a year with notice?' },
      { title: 'Who pays when it breaks', plain: 'If the AC dies or the roof leaks, is that your bill or theirs?' },
      { title: 'Getting out early',       plain: 'If the business does not work, can you leave — or are you stuck paying for years?' },
      { title: 'Your deposit',            plain: 'How easy is it to get that money back, and what excuses can they use to keep it?' },
      { title: 'Quiet auto-renew',        plain: 'If you forget to cancel, does the lease secretly start again for another full year?' },
      { title: "Blame that isn't yours",  plain: 'Are you on the hook if a customer slips, or if the building itself is unsafe?' },
    ],
    glossary: [
      { word: 'Lease',               means: 'The rental contract. You pay to use the place for a set time.' },
      { word: 'Landlord / Lessor',   means: 'The person or company that owns the place.' },
      { word: 'Tenant / Lessee',     means: 'You — the one renting.' },
      { word: 'Term',                means: 'How long the deal lasts (for example, 12 months).' },
      { word: 'Deposit',             means: 'Money you hand over up front. You should get it back if you leave the place in good shape.' },
      { word: 'Addendum',            means: 'Extra pages added later. They still count. Read them.' },
      { word: 'Default',             means: 'You broke a rule in the contract (late rent is the usual one).' },
      { word: 'Indemnify',           means: 'You promise to cover their costs if something goes wrong. This can get expensive.' },
    ],
    sampleOverall:
      'This lease is usable, but three parts are unfair for a brand-new business. Ask to change those before you sign. Do not skip the auto-renew line.',
    sampleFindings: [
      {
        level: 'stop',
        title: 'It renews for a full year if you forget to cancel',
        plain:
          'If you do not send a letter 90 days before the end date, the lease starts again for 12 months. New businesses change plans. This clause can trap you.',
        sayThis: 'Please change the renewal so the lease ends unless we both agree in writing to continue.',
      },
      {
        level: 'ask',
        title: 'You pay for almost every repair',
        plain:
          'The contract says you fix plumbing, electrical, and the HVAC, even if it was old when you moved in. That is a landlord job on most first leases.',
        sayThis: 'Please keep major building systems (roof, structure, plumbing, electrical, HVAC) as the landlord\'s responsibility.',
      },
      {
        level: 'ask',
        title: 'Rent can jump with little warning',
        plain:
          'After year one, they can raise rent "at their discretion." There is no cap and only 15 days\' notice.',
        sayThis: 'Please cap any increase (for example, 5% per year) and give 60 days\' written notice.',
      },
      {
        level: 'watch',
        title: 'You cannot sublet the extra room',
        plain:
          'If you want a roommate-business or to rent a desk, you need their written okay. That is common. Just know you cannot do it on your own.',
        sayThis: 'Please allow subletting of unused space with reasonable written approval, not to be unreasonably withheld.',
      },
    ],
    faqs: [
      { q: 'I have never signed a lease. Is this still for me?',        a: 'Yes. This page is written for first-time renters and buyers. We avoid legal talk, or we translate it.' },
      { q: 'The landlord said "this is standard." Should I still check it?', a: 'Yes. "Standard" often means standard for them. A 10-minute check can save a year of rent you cannot afford.' },
      { q: 'What if I already signed?',                                  a: 'You can still upload it. You will see what you already agreed to, so you know your rights if something goes wrong.' },
      { q: 'Do you replace a lawyer?',                                   a: 'No. We help you see the risks in plain English. For a big purchase or a long lease, take the report to a lawyer.' },
    ],
  },
  {
    slug: 'business',
    menuLabel: 'Business & Commercial Law',
    comingSoon: false,
    eyebrow: 'Vendors, clients, partners, and first deals',
    headline: "Your first business deal shouldn't be a trap.",
    subhead:
      "Someone sent a contract because they want you to buy, sell, partner, or stay quiet. You do not have to pretend you understand it. Upload the PDF. We'll say, in normal words, who has the power and where you can get hurt.",
    dropdownBlurb: 'Supplier deals, client contracts, NDAs, and partner papers — in everyday language.',
    mobileCard: 'Upload a vendor, client, or partner PDF. We flag cancel rules, who owns the work, auto-renew, and hidden blame.',
    img: businessImg,
    buttonCta: 'Check my business contract',
    whatThisIs:
      'Business and commercial papers are the deals you make to run the company: buying from a supplier, hiring a freelancer, signing up a customer, partnering with a friend, or promising not to share a secret. These papers decide who gets paid, who owns the work, and who is in trouble if something fails.',
    whenYouNeedThis: [
      'A supplier sent "our standard terms" and wants a signature this week',
      'You hired a designer, developer, or marketer and they sent an agreement',
      'A customer wants you to sign their paperwork before they pay',
      'A possible partner said "let\'s put this in writing"',
      'Someone asked you to sign an NDA before a meeting',
      'A software or tools company auto-renews you every year',
    ],
    uploadThese: [
      'Vendor / supplier agreement',
      'Service contract or statement of work (SOW)',
      'Freelance or agency agreement',
      'NDA (non-disclosure / secrecy paper)',
      'Partnership or joint-venture draft',
      'Client\'s "master service agreement"',
    ],
    weLookFor: [
      { title: 'Who can walk away',          plain: 'Can they cancel you in 7 days, while you are locked in for a year?' },
      { title: 'Paying for bad work',        plain: 'Do you still have to pay the full amount if they deliver late or poorly?' },
      { title: 'Who owns what you paid for', plain: 'If you paid for a logo, website, or design, do you actually own it — or do they?' },
      { title: 'Auto-renew and price jumps', plain: 'Does the contract quietly restart, maybe at a higher price, if you miss a date?' },
      { title: 'Unlimited blame',            plain: 'If something goes wrong, can they come after your whole business with no cap?' },
      { title: 'Your name and customers',    plain: 'Can they use your brand, or take your customer list, after the deal ends?' },
    ],
    glossary: [
      { word: 'Vendor / Supplier',         means: 'The company you buy from.' },
      { word: 'SOW (Statement of Work)',   means: 'The page that lists what they will actually do, by when.' },
      { word: 'NDA',                       means: 'A promise not to share secrets. Fine if it goes both ways. Risky if only you are silenced.' },
      { word: 'Indemnity',                 means: 'You agree to cover their legal bills. Dangerous if it has no limit.' },
      { word: 'Liability cap',             means: 'A ceiling on how much you can be forced to pay. You want one.' },
      { word: 'IP (Intellectual Property)',means: 'The work product: logo, code, writing, photos. Make sure you own what you paid for.' },
      { word: 'Auto-renew',                means: 'The deal starts again on its own. Easy to miss. Easy to overpay.' },
      { word: 'Net 30 / Net 60',           means: 'They pay you 30 or 60 days after the invoice. Longer = harder on a new business.' },
    ],
    sampleOverall:
      'This supplier contract is written for them, not for you. Two clauses should be changed before you sign. The rest is normal for a first vendor deal.',
    sampleFindings: [
      {
        level: 'stop',
        title: 'No limit on what they can claim from you',
        plain:
          'If anything goes wrong, they can demand unlimited money — even more than you ever paid them. A new business should never agree to that.',
        sayThis: 'Please add a liability cap equal to the fees we paid in the last 12 months, and exclude indirect damages.',
      },
      {
        level: 'ask',
        title: 'They own the work you paid for',
        plain:
          'The contract says they keep the copyright on everything they create, even after you pay. You would be renting your own website.',
        sayThis: 'Please confirm that all work product is ours once the invoice is paid.',
      },
      {
        level: 'ask',
        title: 'They can cancel. You cannot.',
        plain:
          'They may end the deal with 14 days\' notice. You must stay for 12 months or pay the rest in full.',
        sayThis: 'Please make termination mutual: either side can end with 30 days\' written notice.',
      },
      {
        level: 'watch',
        title: 'Invoices are due in 7 days',
        plain:
          'Fast payment is not evil, but it is tight for a new company. Ask for Net 15 or Net 30 if cash is tight.',
        sayThis: 'Please change payment terms to Net 15.',
      },
    ],
    faqs: [
      { q: 'I just started. Do I really need to check every PDF?',    a: 'You do not need a lawyer for every small thing. You do need a plain-English read of anything that auto-renews, takes your money, or takes your work.' },
      { q: 'They said the contract is non-negotiable.',               a: 'Many companies still change a line if you ask calmly. Use the "say this" sentences. If they refuse a stop-level clause, walk away or get a lawyer.' },
      { q: 'What is the one thing I should never skip?',             a: 'Who owns the work, who can cancel, and whether your costs have a ceiling. Those three decide if a deal can sink a new business.' },
      { q: 'Can I use this for a handshake partnership?',            a: 'If it is written down, yes. If it is only a chat, get it in a PDF first — even a simple one — then check it.' },
    ],
  },
  {
    slug: 'civil-litigation',
    menuLabel: 'Civil Litigation',
    comingSoon: false,
    eyebrow: 'Settlements, releases, and "just sign this"',
    headline: 'If they want you to "settle," read it before you sign.',
    subhead:
      'A settlement is a deal to end a fight. It can also take away rights you did not mean to give up. Upload the PDF. We\'ll tell you what you are paying, what you are promising, and what you can never bring up again.',
    dropdownBlurb: "Settlement papers and releases — what you're giving up, in plain words.",
    mobileCard: 'Upload a settlement or release. We explain what you give up, what you still owe, and what you must never say.',
    img: civilImg,
    buttonCta: 'Check my settlement PDF',
    whatThisIs:
      'Civil litigation papers are the documents that start, pause, or end a disagreement that is not a crime: a customer fight, an unpaid invoice, a partnership breakup, or a "sign this and we won\'t sue." The most common one a new owner sees is a settlement or a release.',
    whenYouNeedThis: [
      'A customer wants a refund plus a signed paper',
      'A vendor says "sign this and we drop it"',
      'You are ending a messy partnership',
      'Someone sent a "mutual release"',
      'You were asked to never talk about what happened',
    ],
    uploadThese: [
      'Settlement agreement',
      'Release of claims (sometimes called a waiver)',
      'Mutual release',
      'Consent or stipulated dismissal',
      'Mediation or arbitration agreement',
    ],
    weLookFor: [
      { title: 'What you are giving up',  plain: 'Does this paper end only this fight, or every possible claim you might have?' },
      { title: 'What you still have to pay', plain: 'Are you paying them, are they paying you, and is the number final?' },
      { title: 'Gag clauses',             plain: 'Are you banned from warning others, leaving a review, or even mentioning the dispute?' },
      { title: 'One-sided peace',         plain: 'Do you release them, while they can still come after you later?' },
      { title: "If they don't pay",       plain: 'If they miss the settlement payment, can you actually enforce it?' },
      { title: 'Admission of fault',      plain: 'Does the paper make it sound like you did something wrong, even if you did not?' },
    ],
    glossary: [
      { word: 'Settlement',        means: 'A deal to end the fight without a full court case.' },
      { word: 'Release',           means: 'You give up the right to sue about certain things.' },
      { word: 'Mutual',            means: 'Both sides give something up. If it is not mutual, only you are letting go.' },
      { word: 'Without admission', means: 'Nobody is saying "I was wrong." Good language to keep.' },
      { word: 'Confidentiality',   means: 'You must keep the fight (and often the money) secret.' },
      { word: 'Non-disparagement', means: 'You cannot say bad things about them — even if true. Reviews can get you in trouble.' },
      { word: 'Arbitration',       means: 'A private judge instead of court. Faster, but harder to appeal.' },
      { word: 'Consideration',     means: 'What you get in return (usually money). If you get nothing, be careful.' },
    ],
    sampleOverall:
      'This settlement ends the current dispute, which is useful. It also tries to silence you and waive claims you have not even thought of. Ask to narrow those two parts.',
    sampleFindings: [
      {
        level: 'stop',
        title: 'You give up claims you do not even know about',
        plain:
          'The release covers "any and all claims, known or unknown." That can wipe rights that have nothing to do with this customer fight.',
        sayThis: 'Please limit the release to claims arising from this specific dispute and invoice dates, not all claims forever.',
      },
      {
        level: 'ask',
        title: 'Only you are silenced',
        plain:
          'You cannot leave a review or mention the matter. They can still talk about you. That is not a fair peace.',
        sayThis: 'Please make confidentiality and non-disparagement mutual, or remove them.',
      },
      {
        level: 'ask',
        title: 'If they miss the payment, you start from zero',
        plain:
          'There is no late-fee, no confession of judgment, and no timeline. A missed payment would mean another fight.',
        sayThis: 'Please add a payment date, a late fee, and the right to enter judgment if payment is missed.',
      },
      {
        level: 'watch',
        title: 'The paper says nobody admits fault',
        plain:
          'This is actually good. It means signing is not the same as saying you were wrong. Keep this line.',
        sayThis: 'We agree to keep the "no admission of liability" sentence as written.',
      },
    ],
    faqs: [
      { q: 'I am scared. Does uploading this make the fight worse?', a: 'No. You are only reading your own paper. Nothing is sent to the other side.' },
      { q: 'They gave me 24 hours to sign.',                         a: 'Pressure is a tactic. A fair settlement can wait a day. If a clause is marked "pause," do not rush.' },
      { q: 'Is a settlement always bad?',                            a: 'No. Many settlements are how small businesses end a headache. The goal is a clean, fair ending — not a new trap.' },
      { q: 'Should I still get a lawyer?',                           a: 'If money is large, if they threaten court, or if you see a "pause" finding, yes. Take this report with you. It saves time.' },
    ],
  },
  {
    slug: 'employment',
    menuLabel: 'Employment Law (Coming soon)',
    comingSoon: true,
    eyebrow: 'Hiring your first person',
    headline: 'Hiring is next. This section is almost ready.',
    subhead:
      'Offer letters, contractor agreements, and first-employee papers need their own careful check. We are building this so a new owner can hire without copying a random template from the internet.',
    dropdownBlurb: 'Offer letters and first-hire papers — coming soon.',
    mobileCard: 'Employment contracts are next.',
    img: null,
    buttonCta: 'Notify me when this opens',
    whatThisIs: 'Employment papers are what you sign when you hire help.',
    whenYouNeedThis: [],
    uploadThese: [],
    weLookFor: [],
    glossary: [],
    sampleOverall: '',
    sampleFindings: [],
    faqs: [
      { q: 'When will this be ready?',                   a: 'Soon. The three sectors above work today. Employment is next.' },
      { q: 'Can I still check a contractor agreement now?', a: 'Yes — use Business & Commercial Law. That sector covers freelancer and vendor papers today.' },
    ],
  },
]
