/**
 * ITU-T E.164 country calling codes.
 *
 * Stored as tuples rather than objects because the list is long and the shape is
 * uniform — `[ISO 3166-1 alpha-2, dial code, English name]`. Sorted by name so the
 * picker reads alphabetically without sorting at runtime.
 *
 * Several codes are shared: +1 covers the NANP (US, Canada and twenty Caribbean
 * territories), +7 covers Russia and Kazakhstan, +262 covers Réunion and Mayotte.
 * That is why the ISO code, not the dial code, is the identity here.
 *
 * No validation is built on this — a stored phone number is whatever the user's
 * contact actually is, and national numbering plans are not worth encoding for a
 * password manager's notes field.
 */
type CountryTuple = readonly [iso: string, dial: string, name: string];

const COUNTRIES: readonly CountryTuple[] = [
  ['AF', '+93', 'Afghanistan'],
  ['AL', '+355', 'Albania'],
  ['DZ', '+213', 'Algeria'],
  ['AS', '+1', 'American Samoa'],
  ['AD', '+376', 'Andorra'],
  ['AO', '+244', 'Angola'],
  ['AI', '+1', 'Anguilla'],
  ['AG', '+1', 'Antigua and Barbuda'],
  ['AR', '+54', 'Argentina'],
  ['AM', '+374', 'Armenia'],
  ['AW', '+297', 'Aruba'],
  ['AU', '+61', 'Australia'],
  ['AT', '+43', 'Austria'],
  ['AZ', '+994', 'Azerbaijan'],
  ['BS', '+1', 'Bahamas'],
  ['BH', '+973', 'Bahrain'],
  ['BD', '+880', 'Bangladesh'],
  ['BB', '+1', 'Barbados'],
  ['BY', '+375', 'Belarus'],
  ['BE', '+32', 'Belgium'],
  ['BZ', '+501', 'Belize'],
  ['BJ', '+229', 'Benin'],
  ['BM', '+1', 'Bermuda'],
  ['BT', '+975', 'Bhutan'],
  ['BO', '+591', 'Bolivia'],
  ['BA', '+387', 'Bosnia and Herzegovina'],
  ['BW', '+267', 'Botswana'],
  ['BR', '+55', 'Brazil'],
  ['IO', '+246', 'British Indian Ocean Territory'],
  ['VG', '+1', 'British Virgin Islands'],
  ['BN', '+673', 'Brunei'],
  ['BG', '+359', 'Bulgaria'],
  ['BF', '+226', 'Burkina Faso'],
  ['BI', '+257', 'Burundi'],
  ['KH', '+855', 'Cambodia'],
  ['CM', '+237', 'Cameroon'],
  ['CA', '+1', 'Canada'],
  ['CV', '+238', 'Cape Verde'],
  ['KY', '+1', 'Cayman Islands'],
  ['CF', '+236', 'Central African Republic'],
  ['TD', '+235', 'Chad'],
  ['CL', '+56', 'Chile'],
  ['CN', '+86', 'China'],
  ['CX', '+61', 'Christmas Island'],
  ['CC', '+61', 'Cocos (Keeling) Islands'],
  ['CO', '+57', 'Colombia'],
  ['KM', '+269', 'Comoros'],
  ['CG', '+242', 'Congo — Brazzaville'],
  ['CD', '+243', 'Congo — Kinshasa'],
  ['CK', '+682', 'Cook Islands'],
  ['CR', '+506', 'Costa Rica'],
  ['CI', '+225', 'Côte d’Ivoire'],
  ['HR', '+385', 'Croatia'],
  ['CU', '+53', 'Cuba'],
  ['CW', '+599', 'Curaçao'],
  ['CY', '+357', 'Cyprus'],
  ['CZ', '+420', 'Czechia'],
  ['DK', '+45', 'Denmark'],
  ['DJ', '+253', 'Djibouti'],
  ['DM', '+1', 'Dominica'],
  ['DO', '+1', 'Dominican Republic'],
  ['EC', '+593', 'Ecuador'],
  ['EG', '+20', 'Egypt'],
  ['SV', '+503', 'El Salvador'],
  ['GQ', '+240', 'Equatorial Guinea'],
  ['ER', '+291', 'Eritrea'],
  ['EE', '+372', 'Estonia'],
  ['SZ', '+268', 'Eswatini'],
  ['ET', '+251', 'Ethiopia'],
  ['FK', '+500', 'Falkland Islands'],
  ['FO', '+298', 'Faroe Islands'],
  ['FJ', '+679', 'Fiji'],
  ['FI', '+358', 'Finland'],
  ['FR', '+33', 'France'],
  ['GF', '+594', 'French Guiana'],
  ['PF', '+689', 'French Polynesia'],
  ['GA', '+241', 'Gabon'],
  ['GM', '+220', 'Gambia'],
  ['GE', '+995', 'Georgia'],
  ['DE', '+49', 'Germany'],
  ['GH', '+233', 'Ghana'],
  ['GI', '+350', 'Gibraltar'],
  ['GR', '+30', 'Greece'],
  ['GL', '+299', 'Greenland'],
  ['GD', '+1', 'Grenada'],
  ['GP', '+590', 'Guadeloupe'],
  ['GU', '+1', 'Guam'],
  ['GT', '+502', 'Guatemala'],
  ['GG', '+44', 'Guernsey'],
  ['GN', '+224', 'Guinea'],
  ['GW', '+245', 'Guinea-Bissau'],
  ['GY', '+592', 'Guyana'],
  ['HT', '+509', 'Haiti'],
  ['HN', '+504', 'Honduras'],
  ['HK', '+852', 'Hong Kong'],
  ['HU', '+36', 'Hungary'],
  ['IS', '+354', 'Iceland'],
  ['IN', '+91', 'India'],
  ['ID', '+62', 'Indonesia'],
  ['IR', '+98', 'Iran'],
  ['IQ', '+964', 'Iraq'],
  ['IE', '+353', 'Ireland'],
  ['IM', '+44', 'Isle of Man'],
  ['IL', '+972', 'Israel'],
  ['IT', '+39', 'Italy'],
  ['JM', '+1', 'Jamaica'],
  ['JP', '+81', 'Japan'],
  ['JE', '+44', 'Jersey'],
  ['JO', '+962', 'Jordan'],
  ['KZ', '+7', 'Kazakhstan'],
  ['KE', '+254', 'Kenya'],
  ['KI', '+686', 'Kiribati'],
  ['KW', '+965', 'Kuwait'],
  ['KG', '+996', 'Kyrgyzstan'],
  ['LA', '+856', 'Laos'],
  ['LV', '+371', 'Latvia'],
  ['LB', '+961', 'Lebanon'],
  ['LS', '+266', 'Lesotho'],
  ['LR', '+231', 'Liberia'],
  ['LY', '+218', 'Libya'],
  ['LI', '+423', 'Liechtenstein'],
  ['LT', '+370', 'Lithuania'],
  ['LU', '+352', 'Luxembourg'],
  ['MO', '+853', 'Macao'],
  ['MG', '+261', 'Madagascar'],
  ['MW', '+265', 'Malawi'],
  ['MY', '+60', 'Malaysia'],
  ['MV', '+960', 'Maldives'],
  ['ML', '+223', 'Mali'],
  ['MT', '+356', 'Malta'],
  ['MH', '+692', 'Marshall Islands'],
  ['MQ', '+596', 'Martinique'],
  ['MR', '+222', 'Mauritania'],
  ['MU', '+230', 'Mauritius'],
  ['YT', '+262', 'Mayotte'],
  ['MX', '+52', 'Mexico'],
  ['FM', '+691', 'Micronesia'],
  ['MD', '+373', 'Moldova'],
  ['MC', '+377', 'Monaco'],
  ['MN', '+976', 'Mongolia'],
  ['ME', '+382', 'Montenegro'],
  ['MS', '+1', 'Montserrat'],
  ['MA', '+212', 'Morocco'],
  ['MZ', '+258', 'Mozambique'],
  ['MM', '+95', 'Myanmar'],
  ['NA', '+264', 'Namibia'],
  ['NR', '+674', 'Nauru'],
  ['NP', '+977', 'Nepal'],
  ['NL', '+31', 'Netherlands'],
  ['NC', '+687', 'New Caledonia'],
  ['NZ', '+64', 'New Zealand'],
  ['NI', '+505', 'Nicaragua'],
  ['NE', '+227', 'Niger'],
  ['NG', '+234', 'Nigeria'],
  ['NU', '+683', 'Niue'],
  ['NF', '+672', 'Norfolk Island'],
  ['KP', '+850', 'North Korea'],
  ['MK', '+389', 'North Macedonia'],
  ['MP', '+1', 'Northern Mariana Islands'],
  ['NO', '+47', 'Norway'],
  ['OM', '+968', 'Oman'],
  ['PK', '+92', 'Pakistan'],
  ['PW', '+680', 'Palau'],
  ['PS', '+970', 'Palestine'],
  ['PA', '+507', 'Panama'],
  ['PG', '+675', 'Papua New Guinea'],
  ['PY', '+595', 'Paraguay'],
  ['PE', '+51', 'Peru'],
  ['PH', '+63', 'Philippines'],
  ['PL', '+48', 'Poland'],
  ['PT', '+351', 'Portugal'],
  ['PR', '+1', 'Puerto Rico'],
  ['QA', '+974', 'Qatar'],
  ['RE', '+262', 'Réunion'],
  ['RO', '+40', 'Romania'],
  ['RU', '+7', 'Russia'],
  ['RW', '+250', 'Rwanda'],
  ['BL', '+590', 'Saint Barthélemy'],
  ['SH', '+290', 'Saint Helena'],
  ['KN', '+1', 'Saint Kitts and Nevis'],
  ['LC', '+1', 'Saint Lucia'],
  ['MF', '+590', 'Saint Martin'],
  ['PM', '+508', 'Saint Pierre and Miquelon'],
  ['VC', '+1', 'Saint Vincent and the Grenadines'],
  ['WS', '+685', 'Samoa'],
  ['SM', '+378', 'San Marino'],
  ['ST', '+239', 'São Tomé and Príncipe'],
  ['SA', '+966', 'Saudi Arabia'],
  ['SN', '+221', 'Senegal'],
  ['RS', '+381', 'Serbia'],
  ['SC', '+248', 'Seychelles'],
  ['SL', '+232', 'Sierra Leone'],
  ['SG', '+65', 'Singapore'],
  ['SX', '+1', 'Sint Maarten'],
  ['SK', '+421', 'Slovakia'],
  ['SI', '+386', 'Slovenia'],
  ['SB', '+677', 'Solomon Islands'],
  ['SO', '+252', 'Somalia'],
  ['ZA', '+27', 'South Africa'],
  ['KR', '+82', 'South Korea'],
  ['SS', '+211', 'South Sudan'],
  ['ES', '+34', 'Spain'],
  ['LK', '+94', 'Sri Lanka'],
  ['SD', '+249', 'Sudan'],
  ['SR', '+597', 'Suriname'],
  ['SE', '+46', 'Sweden'],
  ['CH', '+41', 'Switzerland'],
  ['SY', '+963', 'Syria'],
  ['TW', '+886', 'Taiwan'],
  ['TJ', '+992', 'Tajikistan'],
  ['TZ', '+255', 'Tanzania'],
  ['TH', '+66', 'Thailand'],
  ['TL', '+670', 'Timor-Leste'],
  ['TG', '+228', 'Togo'],
  ['TK', '+690', 'Tokelau'],
  ['TO', '+676', 'Tonga'],
  ['TT', '+1', 'Trinidad and Tobago'],
  ['TN', '+216', 'Tunisia'],
  ['TR', '+90', 'Türkiye'],
  ['TM', '+993', 'Turkmenistan'],
  ['TC', '+1', 'Turks and Caicos Islands'],
  ['TV', '+688', 'Tuvalu'],
  ['UG', '+256', 'Uganda'],
  ['UA', '+380', 'Ukraine'],
  ['AE', '+971', 'United Arab Emirates'],
  ['GB', '+44', 'United Kingdom'],
  ['US', '+1', 'United States'],
  ['UY', '+598', 'Uruguay'],
  ['UZ', '+998', 'Uzbekistan'],
  ['VU', '+678', 'Vanuatu'],
  ['VA', '+39', 'Vatican City'],
  ['VE', '+58', 'Venezuela'],
  ['VN', '+84', 'Vietnam'],
  ['VI', '+1', 'U.S. Virgin Islands'],
  ['WF', '+681', 'Wallis and Futuna'],
  ['EH', '+212', 'Western Sahara'],
  ['YE', '+967', 'Yemen'],
  ['ZM', '+260', 'Zambia'],
  ['ZW', '+263', 'Zimbabwe'],
];

export interface Country {
  /** ISO 3166-1 alpha-2 — the identity, since dial codes are shared. */
  iso: string;
  /** E.164 calling code, with the leading `+`. */
  dial: string;
  /** English name — kept as the universal fallback; see `countryName()` for the shown one. */
  name: string;
  /** `🇫🇷` — derived from the ISO code's regional indicator symbols. */
  flag: string;
}

/** `US` -> `🇺🇸`: two regional indicator symbols, offset from 'A' to U+1F1E6. */
function flagOf(iso: string): string {
  return String.fromCodePoint(...[...iso].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export const COUNTRY_CODES: readonly Country[] = COUNTRIES.map(([iso, dial, name]) => ({
  iso,
  dial,
  name,
  flag: flagOf(iso),
}));

/** Looks a country up by its ISO code. */
export function countryByIso(iso: string): Country | undefined {
  return COUNTRY_CODES.find((country) => country.iso === iso);
}

/**
 * `Intl.DisplayNames` instances, one per locale — building one does its own
 * (non-trivial) locale-data lookup, so it is worth keeping around rather than
 * constructing it fresh for every country the picker renders.
 */
const regionDisplayNamesCache = new Map<string, Intl.DisplayNames>();

function regionDisplayNames(locale: string): Intl.DisplayNames | undefined {
  let names = regionDisplayNamesCache.get(locale);
  if (!names) {
    try {
      names = new Intl.DisplayNames([locale], { type: 'region' });
      regionDisplayNamesCache.set(locale, names);
    } catch {
      // A locale/environment `Intl.DisplayNames` doesn't recognise — falls
      // through to `country.name` (English) at the call site.
      return undefined;
    }
  }
  return names;
}

/**
 * A country's name in the interface's current language.
 *
 * Sourced from the browser's own CLDR data via `Intl.DisplayNames` rather
 * than a hand-maintained translation table: it is the same data a phone or a
 * desktop OS's own region picker draws from, already covers every locale this
 * app ships (and any it adds later) for free, and needing ~240 entries × 5
 * languages by hand is exactly the kind of dataset that data source exists to
 * avoid. Falls back to `country.name` (English) for the rare code it doesn't
 * recognise, or in an environment without `Intl.DisplayNames` at all.
 */
export function countryName(country: Country, locale: string): string {
  return regionDisplayNames(locale)?.of(country.iso) ?? country.name;
}

/**
 * Which country to show for a dial code that several share.
 *
 * `+44` matches the UK, Guernsey, Jersey and the Isle of Man; `+1` matches the US and
 * twenty-odd NANP territories. Without a tie-break the answer depends on array order,
 * which is how a UK number came up as Guernsey.
 */
const PRIMARY_FOR_DIAL: Record<string, string> = {
  '+1': 'US',
  '+7': 'RU',
  '+39': 'IT',
  '+44': 'GB',
  '+47': 'NO',
  '+61': 'AU',
  '+212': 'MA',
  '+262': 'RE',
  '+590': 'GP',
  '+599': 'CW',
};

/**
 * Best guess at which country a stored number belongs to, by longest matching dial
 * code, preferring the primary country where one is shared. Only ever used to
 * preselect the picker — it never rewrites the number.
 */
export function countryFromNumber(value: string): Country | undefined {
  const normalized = value.replace(/[^\d+]/g, '');
  if (!normalized.startsWith('+')) {
    return undefined;
  }

  const matches = COUNTRY_CODES.filter((country) => normalized.startsWith(country.dial)).sort(
    (a, b) => b.dial.length - a.dial.length,
  );
  const longest = matches[0]?.dial;
  const sharing = matches.filter((country) => country.dial === longest);

  if (sharing.length <= 1) {
    return sharing[0];
  }

  const primary = PRIMARY_FOR_DIAL[longest];
  return sharing.find((country) => country.iso === primary) ?? sharing[0];
}
