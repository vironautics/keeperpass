/**
 * The searchable catalogue behind the item icon picker: every icon Font
 * Awesome ships free in its Solid weight, with the same name/label/search
 * terms fontawesome.com itself searches against.
 *
 * Generated — run `npm run icons:catalog` after replacing
 * `tools/fontawesome-metadata/icons.json` with a newer Font Awesome Free
 * metadata release. See `tools/generate-icon-catalog.mjs` for why this is
 * a separate catalogue from `icon-glyphs.ts`.
 */
export interface CatalogIcon {
  /** Font Awesome's own icon name, e.g. `lock`. */
  readonly name: string;
  /** Human-readable display name, e.g. "Lock". */
  readonly label: string;
  /** Hex code point in the Solid face, e.g. `f023`. */
  readonly unicode: string;
  /** Search aliases, e.g. `padlock`, `secure` for `lock`. */
  readonly terms: readonly string[];
}

export const ICON_CATALOG: readonly CatalogIcon[] = [
  {
    "name": "0",
    "label": "0",
    "unicode": "30",
    "terms": [
      "Digit Zero",
      "nada",
      "none",
      "zero",
      "zilch"
    ]
  },
  {
    "name": "1",
    "label": "1",
    "unicode": "31",
    "terms": [
      "Digit One",
      "one"
    ]
  },
  {
    "name": "2",
    "label": "2",
    "unicode": "32",
    "terms": [
      "Digit Two",
      "two"
    ]
  },
  {
    "name": "3",
    "label": "3",
    "unicode": "33",
    "terms": [
      "Digit Three",
      "three"
    ]
  },
  {
    "name": "4",
    "label": "4",
    "unicode": "34",
    "terms": [
      "Digit Four",
      "four"
    ]
  },
  {
    "name": "5",
    "label": "5",
    "unicode": "35",
    "terms": [
      "Digit Five",
      "five"
    ]
  },
  {
    "name": "6",
    "label": "6",
    "unicode": "36",
    "terms": [
      "Digit Six",
      "six"
    ]
  },
  {
    "name": "7",
    "label": "7",
    "unicode": "37",
    "terms": [
      "Digit Seven",
      "seven"
    ]
  },
  {
    "name": "8",
    "label": "8",
    "unicode": "38",
    "terms": [
      "Digit Eight",
      "eight"
    ]
  },
  {
    "name": "9",
    "label": "9",
    "unicode": "39",
    "terms": [
      "Digit Nine",
      "nine"
    ]
  },
  {
    "name": "a",
    "label": "A",
    "unicode": "41",
    "terms": [
      "Latin Capital Letter A",
      "Latin Small Letter A",
      "letter"
    ]
  },
  {
    "name": "address-book",
    "label": "Address Book",
    "unicode": "f2b9",
    "terms": [
      "contact",
      "directory",
      "employee",
      "index",
      "little black book",
      "portfolio",
      "rolodex",
      "uer",
      "username"
    ]
  },
  {
    "name": "address-card",
    "label": "Address Card",
    "unicode": "f2bb",
    "terms": [
      "about",
      "contact",
      "employee",
      "id",
      "identification",
      "portfolio",
      "postcard",
      "profile",
      "registration",
      "uer",
      "username"
    ]
  },
  {
    "name": "align-center",
    "label": "Align Center",
    "unicode": "f037",
    "terms": [
      "format",
      "middle",
      "paragraph",
      "text"
    ]
  },
  {
    "name": "align-justify",
    "label": "Align Justify",
    "unicode": "f039",
    "terms": [
      "format",
      "paragraph",
      "text"
    ]
  },
  {
    "name": "align-left",
    "label": "Align Left",
    "unicode": "f036",
    "terms": [
      "format",
      "paragraph",
      "text"
    ]
  },
  {
    "name": "align-right",
    "label": "Align Right",
    "unicode": "f038",
    "terms": [
      "format",
      "paragraph",
      "text"
    ]
  },
  {
    "name": "anchor",
    "label": "Anchor",
    "unicode": "f13d",
    "terms": [
      "anchor",
      "berth",
      "boat",
      "dock",
      "embed",
      "link",
      "maritime",
      "moor",
      "port",
      "secure",
      "ship",
      "tool"
    ]
  },
  {
    "name": "anchor-circle-check",
    "label": "Anchor Circle Check",
    "unicode": "e4aa",
    "terms": [
      "enable",
      "marina",
      "not affected",
      "ok",
      "okay",
      "port",
      "validate",
      "working"
    ]
  },
  {
    "name": "anchor-circle-exclamation",
    "label": "Anchor Circle Exclamation",
    "unicode": "e4ab",
    "terms": [
      "affected",
      "failed",
      "marina",
      "port"
    ]
  },
  {
    "name": "anchor-circle-xmark",
    "label": "Anchor Circle Xmark",
    "unicode": "e4ac",
    "terms": [
      "destroy",
      "marina",
      "port",
      "uncheck"
    ]
  },
  {
    "name": "anchor-lock",
    "label": "Anchor Lock",
    "unicode": "e4ad",
    "terms": [
      "closed",
      "lockdown",
      "marina",
      "padlock",
      "port",
      "privacy",
      "quarantine"
    ]
  },
  {
    "name": "angle-down",
    "label": "Angle Down",
    "unicode": "f107",
    "terms": [
      "Down Arrowhead",
      "arrow",
      "caret",
      "download",
      "expand",
      "insert"
    ]
  },
  {
    "name": "angle-left",
    "label": "Angle Left",
    "unicode": "f104",
    "terms": [
      "Single Left-Pointing Angle Quotation Mark",
      "arrow",
      "back",
      "caret",
      "less",
      "previous"
    ]
  },
  {
    "name": "angle-right",
    "label": "Angle Right",
    "unicode": "f105",
    "terms": [
      "Single Right-Pointing Angle Quotation Mark",
      "arrow",
      "care",
      "forward",
      "more",
      "next"
    ]
  },
  {
    "name": "angle-up",
    "label": "Angle Up",
    "unicode": "f106",
    "terms": [
      "Up Arrowhead",
      "arrow",
      "caret",
      "collapse",
      "upgrade",
      "upload"
    ]
  },
  {
    "name": "angles-down",
    "label": "Angles Down",
    "unicode": "f103",
    "terms": [
      "arrows",
      "caret",
      "download",
      "expand"
    ]
  },
  {
    "name": "angles-left",
    "label": "Angles Left",
    "unicode": "f100",
    "terms": [
      "Left-Pointing Double Angle Quotation Mark",
      "arrows",
      "back",
      "caret",
      "laquo",
      "previous",
      "quote"
    ]
  },
  {
    "name": "angles-right",
    "label": "Angles Right",
    "unicode": "f101",
    "terms": [
      "Right-Pointing Double Angle Quotation Mark",
      "arrows",
      "caret",
      "forward",
      "more",
      "next",
      "quote",
      "raquo"
    ]
  },
  {
    "name": "angles-up",
    "label": "Angles Up",
    "unicode": "f102",
    "terms": [
      "arrows",
      "caret",
      "collapse",
      "upload"
    ]
  },
  {
    "name": "ankh",
    "label": "Ankh",
    "unicode": "f644",
    "terms": [
      "Ankh",
      "amulet",
      "copper",
      "coptic christianity",
      "copts",
      "crux ansata",
      "egypt",
      "venus"
    ]
  },
  {
    "name": "apple-whole",
    "label": "Apple Whole",
    "unicode": "f5d1",
    "terms": [
      "apple",
      "fall",
      "fruit",
      "fuji",
      "green",
      "green apple",
      "macintosh",
      "orchard",
      "red",
      "red apple",
      "seasonal",
      "vegan"
    ]
  },
  {
    "name": "archway",
    "label": "Archway",
    "unicode": "f557",
    "terms": [
      "arc",
      "monument",
      "road",
      "street",
      "tunnel"
    ]
  },
  {
    "name": "arrow-down",
    "label": "Arrow Down",
    "unicode": "f063",
    "terms": [
      "Downwards Arrow",
      "download"
    ]
  },
  {
    "name": "arrow-down-1-9",
    "label": "Arrow Down 1 9",
    "unicode": "f162",
    "terms": [
      "arrange",
      "filter",
      "numbers",
      "order",
      "sort-numeric-asc"
    ]
  },
  {
    "name": "arrow-down-9-1",
    "label": "Arrow Down 9 1",
    "unicode": "f886",
    "terms": [
      "arrange",
      "filter",
      "numbers",
      "order",
      "sort-numeric-asc"
    ]
  },
  {
    "name": "arrow-down-a-z",
    "label": "Arrow Down A Z",
    "unicode": "f15d",
    "terms": [
      "alphabetical",
      "arrange",
      "filter",
      "order",
      "sort-alpha-asc"
    ]
  },
  {
    "name": "arrow-down-long",
    "label": "Arrow Down Long",
    "unicode": "f175",
    "terms": [
      "download",
      "long-arrow-down"
    ]
  },
  {
    "name": "arrow-down-short-wide",
    "label": "Arrow Down Short Wide",
    "unicode": "f884",
    "terms": [
      "arrange",
      "filter",
      "order",
      "sort-amount-asc"
    ]
  },
  {
    "name": "arrow-down-up-across-line",
    "label": "Arrow Down Up Across Line",
    "unicode": "e4af",
    "terms": [
      "border",
      "crossing",
      "transfer"
    ]
  },
  {
    "name": "arrow-down-up-lock",
    "label": "Arrow Down Up Lock",
    "unicode": "e4b0",
    "terms": [
      "border",
      "closed",
      "crossing",
      "lockdown",
      "padlock",
      "privacy",
      "quarantine",
      "transfer"
    ]
  },
  {
    "name": "arrow-down-wide-short",
    "label": "Arrow Down Wide Short",
    "unicode": "f160",
    "terms": [
      "arrange",
      "filter",
      "number",
      "order",
      "sort-amount-asc"
    ]
  },
  {
    "name": "arrow-down-z-a",
    "label": "Arrow Down Z A",
    "unicode": "f881",
    "terms": [
      "alphabetical",
      "arrange",
      "filter",
      "order",
      "sort-alpha-asc"
    ]
  },
  {
    "name": "arrow-left",
    "label": "Arrow Left",
    "unicode": "f060",
    "terms": [
      "Leftwards Arrow",
      "back",
      "previous"
    ]
  },
  {
    "name": "arrow-left-long",
    "label": "Arrow Left Long",
    "unicode": "f177",
    "terms": [
      "back",
      "long-arrow-left",
      "previous"
    ]
  },
  {
    "name": "arrow-pointer",
    "label": "Arrow Pointer",
    "unicode": "f245",
    "terms": [
      "arrow",
      "cursor",
      "select"
    ]
  },
  {
    "name": "arrow-right",
    "label": "Arrow Right",
    "unicode": "f061",
    "terms": [
      "Rightwards Arrow",
      "forward",
      "next"
    ]
  },
  {
    "name": "arrow-right-arrow-left",
    "label": "Arrow Right Arrow Left",
    "unicode": "f0ec",
    "terms": [
      "Rightwards Arrow Over Leftwards Arrow",
      "arrow",
      "arrows",
      "reciprocate",
      "return",
      "swap",
      "transfer"
    ]
  },
  {
    "name": "arrow-right-from-bracket",
    "label": "Arrow Right From Bracket",
    "unicode": "f08b",
    "terms": [
      "arrow",
      "exit",
      "leave",
      "log out",
      "logout"
    ]
  },
  {
    "name": "arrow-right-long",
    "label": "Arrow Right Long",
    "unicode": "f178",
    "terms": [
      "forward",
      "long-arrow-right",
      "next"
    ]
  },
  {
    "name": "arrow-right-to-bracket",
    "label": "Arrow Right To Bracket",
    "unicode": "f090",
    "terms": [
      "arrow",
      "enter",
      "insert",
      "join",
      "log in",
      "login",
      "sign in",
      "sign up",
      "sign-in",
      "signin",
      "signup"
    ]
  },
  {
    "name": "arrow-right-to-city",
    "label": "Arrow Right To City",
    "unicode": "e4b3",
    "terms": [
      "building",
      "city",
      "exodus",
      "insert",
      "rural",
      "urban"
    ]
  },
  {
    "name": "arrow-rotate-left",
    "label": "Arrow Rotate Left",
    "unicode": "f0e2",
    "terms": [
      "Anticlockwise Open Circle Arrow",
      "back",
      "control z",
      "exchange",
      "oops",
      "return",
      "rotate",
      "swap"
    ]
  },
  {
    "name": "arrow-rotate-right",
    "label": "Arrow Rotate Right",
    "unicode": "f01e",
    "terms": [
      "Clockwise Open Circle Arrow",
      "forward",
      "refresh",
      "reload",
      "renew",
      "repeat",
      "retry"
    ]
  },
  {
    "name": "arrow-trend-down",
    "label": "Arrow Trend Down",
    "unicode": "e097",
    "terms": [
      "line",
      "stocks",
      "trend"
    ]
  },
  {
    "name": "arrow-trend-up",
    "label": "Arrow Trend Up",
    "unicode": "e098",
    "terms": [
      "line",
      "stocks",
      "trend"
    ]
  },
  {
    "name": "arrow-turn-down",
    "label": "Arrow Turn Down",
    "unicode": "f149",
    "terms": [
      "arrow"
    ]
  },
  {
    "name": "arrow-turn-up",
    "label": "Arrow Turn Up",
    "unicode": "f148",
    "terms": [
      "arrow"
    ]
  },
  {
    "name": "arrow-up",
    "label": "Arrow Up",
    "unicode": "f062",
    "terms": [
      "Upwards Arrow",
      "forward",
      "upgrade",
      "upload"
    ]
  },
  {
    "name": "arrow-up-1-9",
    "label": "Arrow Up 1 9",
    "unicode": "f163",
    "terms": [
      "arrange",
      "filter",
      "numbers",
      "order",
      "sort-numeric-desc"
    ]
  },
  {
    "name": "arrow-up-9-1",
    "label": "Arrow Up 9 1",
    "unicode": "f887",
    "terms": [
      "arrange",
      "filter",
      "numbers",
      "order",
      "sort-numeric-desc"
    ]
  },
  {
    "name": "arrow-up-a-z",
    "label": "Arrow Up A Z",
    "unicode": "f15e",
    "terms": [
      "alphabetical",
      "arrange",
      "filter",
      "order",
      "sort-alpha-desc"
    ]
  },
  {
    "name": "arrow-up-from-bracket",
    "label": "Arrow Up From Bracket",
    "unicode": "e09a",
    "terms": [
      "share",
      "transfer",
      "upgrade",
      "upload"
    ]
  },
  {
    "name": "arrow-up-from-ground-water",
    "label": "Arrow Up From Ground Water",
    "unicode": "e4b5",
    "terms": [
      "groundwater",
      "spring",
      "upgrade",
      "water supply",
      "water table"
    ]
  },
  {
    "name": "arrow-up-from-water-pump",
    "label": "Arrow Up From Water Pump",
    "unicode": "e4b6",
    "terms": [
      "flood",
      "groundwater",
      "pump",
      "submersible",
      "sump pump",
      "upgrade"
    ]
  },
  {
    "name": "arrow-up-long",
    "label": "Arrow Up Long",
    "unicode": "f176",
    "terms": [
      "long-arrow-up",
      "upload"
    ]
  },
  {
    "name": "arrow-up-right-dots",
    "label": "Arrow Up Right Dots",
    "unicode": "e4b7",
    "terms": [
      "growth",
      "increase",
      "population",
      "upgrade"
    ]
  },
  {
    "name": "arrow-up-right-from-square",
    "label": "Arrow Up Right From Square",
    "unicode": "f08e",
    "terms": [
      "new",
      "open",
      "send",
      "share",
      "upgrade"
    ]
  },
  {
    "name": "arrow-up-short-wide",
    "label": "Arrow Up Short Wide",
    "unicode": "f885",
    "terms": [
      "arrange",
      "filter",
      "order",
      "sort-amount-desc"
    ]
  },
  {
    "name": "arrow-up-wide-short",
    "label": "Arrow Up Wide Short",
    "unicode": "f161",
    "terms": [
      "arrange",
      "filter",
      "order",
      "sort-amount-desc",
      "upgrade"
    ]
  },
  {
    "name": "arrow-up-z-a",
    "label": "Arrow Up Z A",
    "unicode": "f882",
    "terms": [
      "alphabetical",
      "arrange",
      "filter",
      "order",
      "sort-alpha-desc"
    ]
  },
  {
    "name": "arrows-down-to-line",
    "label": "Arrows Down To Line",
    "unicode": "e4b8",
    "terms": [
      "insert",
      "scale down",
      "sink"
    ]
  },
  {
    "name": "arrows-down-to-people",
    "label": "Arrows Down To People",
    "unicode": "e4b9",
    "terms": [
      "affected",
      "focus",
      "insert",
      "targeted",
      "together",
      "uer"
    ]
  },
  {
    "name": "arrows-left-right",
    "label": "Arrows Left Right",
    "unicode": "f07e",
    "terms": [
      "expand",
      "horizontal",
      "landscape",
      "resize",
      "wide"
    ]
  },
  {
    "name": "arrows-left-right-to-line",
    "label": "Arrows Left Right To Line",
    "unicode": "e4ba",
    "terms": [
      "analysis",
      "expand",
      "gap"
    ]
  },
  {
    "name": "arrows-rotate",
    "label": "Arrows Rotate",
    "unicode": "f021",
    "terms": [
      "Clockwise Right and Left Semicircle Arrows",
      "clockwise",
      "exchange",
      "modify",
      "refresh",
      "reload",
      "renew",
      "retry",
      "rotate",
      "swap"
    ]
  },
  {
    "name": "arrows-spin",
    "label": "Arrows Spin",
    "unicode": "e4bb",
    "terms": [
      "cycle",
      "rotate",
      "spin",
      "whirl"
    ]
  },
  {
    "name": "arrows-split-up-and-left",
    "label": "Arrows Split Up And Left",
    "unicode": "e4bc",
    "terms": [
      "agile",
      "split"
    ]
  },
  {
    "name": "arrows-to-circle",
    "label": "Arrows To Circle",
    "unicode": "e4bd",
    "terms": [
      "center",
      "concentrate",
      "coordinate",
      "coordination",
      "focal point",
      "focus",
      "insert"
    ]
  },
  {
    "name": "arrows-to-dot",
    "label": "Arrows To Dot",
    "unicode": "e4be",
    "terms": [
      "assembly point",
      "center",
      "condense",
      "focus",
      "insert",
      "minimize"
    ]
  },
  {
    "name": "arrows-to-eye",
    "label": "Arrows To Eye",
    "unicode": "e4bf",
    "terms": [
      "center",
      "coordinated assessment",
      "focus"
    ]
  },
  {
    "name": "arrows-turn-right",
    "label": "Arrows Turn Right",
    "unicode": "e4c0",
    "terms": [
      "arrows"
    ]
  },
  {
    "name": "arrows-turn-to-dots",
    "label": "Arrows Turn To Dots",
    "unicode": "e4c1",
    "terms": [
      "destination",
      "insert",
      "nexus"
    ]
  },
  {
    "name": "arrows-up-down",
    "label": "Arrows Up Down",
    "unicode": "f07d",
    "terms": [
      "expand",
      "portrait",
      "resize",
      "tall",
      "vertical"
    ]
  },
  {
    "name": "arrows-up-down-left-right",
    "label": "Arrows Up Down Left Right",
    "unicode": "f047",
    "terms": [
      "arrow",
      "arrows",
      "bigger",
      "enlarge",
      "expand",
      "fullscreen",
      "move",
      "position",
      "reorder",
      "resize"
    ]
  },
  {
    "name": "arrows-up-to-line",
    "label": "Arrows Up To Line",
    "unicode": "e4c2",
    "terms": [
      "rise",
      "scale up",
      "upgrade"
    ]
  },
  {
    "name": "asterisk",
    "label": "Asterisk",
    "unicode": "2a",
    "terms": [
      "Asterisk",
      "Heavy Asterisk",
      "annotation",
      "details",
      "reference",
      "required",
      "star"
    ]
  },
  {
    "name": "at",
    "label": "At",
    "unicode": "40",
    "terms": [
      "Commercial At",
      "address",
      "author",
      "e-mail",
      "email",
      "fluctuate",
      "handle"
    ]
  },
  {
    "name": "atom",
    "label": "Atom",
    "unicode": "f5d2",
    "terms": [
      "atheism",
      "atheist",
      "atom",
      "atom symbol",
      "chemistry",
      "electron",
      "ion",
      "isotope",
      "knowledge",
      "neutron",
      "nuclear",
      "proton",
      "science"
    ]
  },
  {
    "name": "audio-description",
    "label": "Audio Description",
    "unicode": "f29e",
    "terms": [
      "blind",
      "narration",
      "video",
      "visual"
    ]
  },
  {
    "name": "austral-sign",
    "label": "Austral Sign",
    "unicode": "e0a9",
    "terms": [
      "Austral Sign",
      "currency"
    ]
  },
  {
    "name": "award",
    "label": "Award",
    "unicode": "f559",
    "terms": [
      "guarantee",
      "honor",
      "praise",
      "prize",
      "recognition",
      "ribbon",
      "trophy",
      "warranty"
    ]
  },
  {
    "name": "b",
    "label": "B",
    "unicode": "42",
    "terms": [
      "Latin Capital Letter B",
      "Latin Small Letter B",
      "letter"
    ]
  },
  {
    "name": "baby",
    "label": "Baby",
    "unicode": "f77c",
    "terms": [
      "uer",
      "users-people"
    ]
  },
  {
    "name": "baby-carriage",
    "label": "Baby Carriage",
    "unicode": "f77d",
    "terms": [
      "buggy",
      "carrier",
      "infant",
      "push",
      "stroller",
      "transportation",
      "walk",
      "wheels"
    ]
  },
  {
    "name": "backward",
    "label": "Backward",
    "unicode": "f04a",
    "terms": [
      "arrow",
      "double",
      "fast reverse button",
      "previous",
      "rewind"
    ]
  },
  {
    "name": "backward-fast",
    "label": "Backward Fast",
    "unicode": "f049",
    "terms": [
      "arrow",
      "beginning",
      "first",
      "last track button",
      "previous",
      "previous scene",
      "previous track",
      "quick",
      "rewind",
      "start",
      "triangle"
    ]
  },
  {
    "name": "backward-step",
    "label": "Backward Step",
    "unicode": "f048",
    "terms": [
      "beginning",
      "first",
      "previous",
      "rewind",
      "start"
    ]
  },
  {
    "name": "bacon",
    "label": "Bacon",
    "unicode": "f7e5",
    "terms": [
      "bacon",
      "blt",
      "breakfast",
      "food",
      "ham",
      "lard",
      "meat",
      "pancetta",
      "pork",
      "rasher"
    ]
  },
  {
    "name": "bacteria",
    "label": "Bacteria",
    "unicode": "e059",
    "terms": [
      "antibiotic",
      "antibody",
      "covid-19",
      "health",
      "organism",
      "sick"
    ]
  },
  {
    "name": "bacterium",
    "label": "Bacterium",
    "unicode": "e05a",
    "terms": [
      "antibiotic",
      "antibody",
      "covid-19",
      "germ",
      "health",
      "organism",
      "sick"
    ]
  },
  {
    "name": "bag-shopping",
    "label": "Bag Shopping",
    "unicode": "f290",
    "terms": [
      "buy",
      "checkout",
      "grocery",
      "payment",
      "purchase"
    ]
  },
  {
    "name": "bahai",
    "label": "Bahai",
    "unicode": "f666",
    "terms": [
      "bahai",
      "bahá'í",
      "star"
    ]
  },
  {
    "name": "baht-sign",
    "label": "Baht Sign",
    "unicode": "e0ac",
    "terms": [
      "currency"
    ]
  },
  {
    "name": "ban",
    "label": "Ban",
    "unicode": "f05e",
    "terms": [
      "404",
      "abort",
      "ban",
      "block",
      "cancel",
      "delete",
      "deny",
      "disabled",
      "entry",
      "failed",
      "forbidden",
      "hide",
      "no",
      "not",
      "not found",
      "prohibit",
      "prohibited",
      "remove",
      "stop",
      "trash"
    ]
  },
  {
    "name": "ban-smoking",
    "label": "Ban Smoking",
    "unicode": "f54d",
    "terms": [
      "ban",
      "cancel",
      "deny",
      "disabled",
      "forbidden",
      "no",
      "no smoking",
      "non-smoking",
      "not",
      "prohibited",
      "smoking"
    ]
  },
  {
    "name": "bandage",
    "label": "Bandage",
    "unicode": "f462",
    "terms": [
      "adhesive bandage",
      "bandage",
      "boo boo",
      "first aid",
      "modify",
      "ouch"
    ]
  },
  {
    "name": "bangladeshi-taka-sign",
    "label": "Bangladeshi Taka Sign",
    "unicode": "e2e6",
    "terms": [
      "bdt",
      "currency",
      "tk"
    ]
  },
  {
    "name": "barcode",
    "label": "Barcode",
    "unicode": "f02a",
    "terms": [
      "info",
      "laser",
      "price",
      "scan",
      "upc"
    ]
  },
  {
    "name": "bars",
    "label": "Bars",
    "unicode": "f0c9",
    "terms": [
      "checklist",
      "drag",
      "hamburger",
      "list",
      "menu",
      "nav",
      "navigation",
      "ol",
      "reorder",
      "settings",
      "todo",
      "ul"
    ]
  },
  {
    "name": "bars-progress",
    "label": "Bars Progress",
    "unicode": "f828",
    "terms": [
      "checklist",
      "downloading",
      "downloads",
      "loading",
      "poll",
      "progress",
      "project management",
      "settings",
      "to do"
    ]
  },
  {
    "name": "bars-staggered",
    "label": "Bars Staggered",
    "unicode": "f550",
    "terms": [
      "flow",
      "list",
      "timeline"
    ]
  },
  {
    "name": "baseball",
    "label": "Baseball",
    "unicode": "f433",
    "terms": [
      "ball",
      "baseball",
      "foul",
      "glove",
      "hardball",
      "league",
      "leather",
      "mlb",
      "softball",
      "sport",
      "underarm"
    ]
  },
  {
    "name": "baseball-bat-ball",
    "label": "Baseball Bat Ball",
    "unicode": "f432",
    "terms": [
      "bat",
      "league",
      "mlb",
      "slugger",
      "softball",
      "sport"
    ]
  },
  {
    "name": "basket-shopping",
    "label": "Basket Shopping",
    "unicode": "f291",
    "terms": [
      "buy",
      "checkout",
      "grocery",
      "payment",
      "purchase"
    ]
  },
  {
    "name": "basketball",
    "label": "Basketball",
    "unicode": "f434",
    "terms": [
      "ball",
      "basketball",
      "dribble",
      "dunk",
      "hoop",
      "nba"
    ]
  },
  {
    "name": "bath",
    "label": "Bath",
    "unicode": "f2cd",
    "terms": [
      "bath",
      "bathtub",
      "clean",
      "shower",
      "tub",
      "wash"
    ]
  },
  {
    "name": "battery-empty",
    "label": "Battery Empty",
    "unicode": "f244",
    "terms": [
      "charge",
      "dead",
      "power",
      "status"
    ]
  },
  {
    "name": "battery-full",
    "label": "Battery Full",
    "unicode": "f240",
    "terms": [
      "batter",
      "battery",
      "charge",
      "power",
      "status"
    ]
  },
  {
    "name": "battery-half",
    "label": "Battery Half",
    "unicode": "f242",
    "terms": [
      "charge",
      "power",
      "status"
    ]
  },
  {
    "name": "battery-quarter",
    "label": "Battery Quarter",
    "unicode": "f243",
    "terms": [
      "charge",
      "low",
      "power",
      "status"
    ]
  },
  {
    "name": "battery-three-quarters",
    "label": "Battery Three Quarters",
    "unicode": "f241",
    "terms": [
      "charge",
      "power",
      "status"
    ]
  },
  {
    "name": "bed",
    "label": "Bed",
    "unicode": "f236",
    "terms": [
      "hospital",
      "hotel",
      "lodging",
      "mattress",
      "patient",
      "person in bed",
      "rest",
      "sleep",
      "travel",
      "uer"
    ]
  },
  {
    "name": "bed-pulse",
    "label": "Bed Pulse",
    "unicode": "f487",
    "terms": [
      "EKG",
      "bed",
      "electrocardiogram",
      "health",
      "hospital",
      "life",
      "patient",
      "vital"
    ]
  },
  {
    "name": "beer-mug-empty",
    "label": "Beer Mug Empty",
    "unicode": "f0fc",
    "terms": [
      "alcohol",
      "ale",
      "bar",
      "beverage",
      "brew",
      "brewery",
      "drink",
      "foam",
      "lager",
      "liquor",
      "mug",
      "stein"
    ]
  },
  {
    "name": "bell",
    "label": "Bell",
    "unicode": "f0f3",
    "terms": [
      "alarm",
      "alert",
      "bel",
      "bell",
      "chime",
      "notification",
      "reminder",
      "request"
    ]
  },
  {
    "name": "bell-concierge",
    "label": "Bell Concierge",
    "unicode": "f562",
    "terms": [
      "attention",
      "bell",
      "bellhop",
      "bellhop bell",
      "hotel",
      "receptionist",
      "request",
      "service",
      "support"
    ]
  },
  {
    "name": "bell-slash",
    "label": "Bell Slash",
    "unicode": "f1f6",
    "terms": [
      "alert",
      "bell",
      "bell with slash",
      "cancel",
      "disabled",
      "forbidden",
      "mute",
      "notification",
      "off",
      "quiet",
      "reminder",
      "silent"
    ]
  },
  {
    "name": "bezier-curve",
    "label": "Bezier Curve",
    "unicode": "f55b",
    "terms": [
      "curves",
      "illustrator",
      "lines",
      "path",
      "vector"
    ]
  },
  {
    "name": "bicycle",
    "label": "Bicycle",
    "unicode": "f206",
    "terms": [
      "bicycle",
      "bike",
      "gears",
      "pedal",
      "transportation",
      "vehicle"
    ]
  },
  {
    "name": "binoculars",
    "label": "Binoculars",
    "unicode": "f1e5",
    "terms": [
      "glasses",
      "inspection",
      "magnifier",
      "magnify",
      "scenic",
      "spyglass",
      "view"
    ]
  },
  {
    "name": "biohazard",
    "label": "Biohazard",
    "unicode": "f780",
    "terms": [
      "biohazard",
      "covid-19",
      "danger",
      "dangerous",
      "epidemic",
      "hazmat",
      "medical",
      "pandemic",
      "radioactive",
      "sign",
      "toxic",
      "waste",
      "zombie"
    ]
  },
  {
    "name": "bitcoin-sign",
    "label": "Bitcoin Sign",
    "unicode": "e0b4",
    "terms": [
      "Bitcoin Sign",
      "currency"
    ]
  },
  {
    "name": "blender",
    "label": "Blender",
    "unicode": "f517",
    "terms": [
      "cocktail",
      "milkshake",
      "mixer",
      "puree",
      "smoothie"
    ]
  },
  {
    "name": "blender-phone",
    "label": "Blender Phone",
    "unicode": "f6b6",
    "terms": [
      "appliance",
      "cocktail",
      "fantasy",
      "milkshake",
      "mixer",
      "puree",
      "silly",
      "smoothie"
    ]
  },
  {
    "name": "blog",
    "label": "Blog",
    "unicode": "f781",
    "terms": [
      "journal",
      "log",
      "online",
      "personal",
      "post",
      "web 2.0",
      "wordpress",
      "writing"
    ]
  },
  {
    "name": "bold",
    "label": "Bold",
    "unicode": "f032",
    "terms": [
      "emphasis",
      "format",
      "text"
    ]
  },
  {
    "name": "bolt",
    "label": "Bolt",
    "unicode": "f0e7",
    "terms": [
      "charge",
      "danger",
      "electric",
      "electricity",
      "flash",
      "high voltage",
      "lightning",
      "voltage",
      "weather",
      "zap"
    ]
  },
  {
    "name": "bolt-lightning",
    "label": "Bolt Lightning",
    "unicode": "e0b7",
    "terms": [
      "electricity",
      "flash",
      "lightning",
      "weather",
      "zap"
    ]
  },
  {
    "name": "bomb",
    "label": "Bomb",
    "unicode": "f1e2",
    "terms": [
      "bomb",
      "comic",
      "error",
      "explode",
      "fuse",
      "grenade",
      "warning"
    ]
  },
  {
    "name": "bone",
    "label": "Bone",
    "unicode": "f5d7",
    "terms": [
      "bone",
      "calcium",
      "dog",
      "skeletal",
      "skeleton",
      "tibia"
    ]
  },
  {
    "name": "bong",
    "label": "Bong",
    "unicode": "f55c",
    "terms": [
      "aparatus",
      "cannabis",
      "marijuana",
      "pipe",
      "smoke",
      "smoking"
    ]
  },
  {
    "name": "book",
    "label": "Book",
    "unicode": "f02d",
    "terms": [
      "book",
      "cover",
      "decorated",
      "diary",
      "documentation",
      "journal",
      "knowledge",
      "library",
      "notebook",
      "notebook with decorative cover",
      "read",
      "research",
      "scholar"
    ]
  },
  {
    "name": "book-atlas",
    "label": "Book Atlas",
    "unicode": "f558",
    "terms": [
      "book",
      "directions",
      "geography",
      "globe",
      "knowledge",
      "library",
      "map",
      "research",
      "travel",
      "wayfinding"
    ]
  },
  {
    "name": "book-bible",
    "label": "Book Bible",
    "unicode": "f647",
    "terms": [
      "book",
      "catholicism",
      "christianity",
      "god",
      "holy"
    ]
  },
  {
    "name": "book-bookmark",
    "label": "Book Bookmark",
    "unicode": "e0bb",
    "terms": [
      "knowledge",
      "library",
      "research"
    ]
  },
  {
    "name": "book-journal-whills",
    "label": "Book Journal Whills",
    "unicode": "f66a",
    "terms": [
      "book",
      "force",
      "jedi",
      "sith",
      "star wars",
      "yoda"
    ]
  },
  {
    "name": "book-medical",
    "label": "Book Medical",
    "unicode": "f7e6",
    "terms": [
      "diary",
      "documentation",
      "health",
      "history",
      "journal",
      "library",
      "read",
      "record",
      "research"
    ]
  },
  {
    "name": "book-open",
    "label": "Book Open",
    "unicode": "f518",
    "terms": [
      "Book",
      "book",
      "flyer",
      "knowledge",
      "library",
      "notebook",
      "open",
      "open book",
      "pamphlet",
      "reading",
      "research"
    ]
  },
  {
    "name": "book-open-reader",
    "label": "Book Open Reader",
    "unicode": "f5da",
    "terms": [
      "flyer",
      "library",
      "notebook",
      "open book",
      "pamphlet",
      "reading",
      "research"
    ]
  },
  {
    "name": "book-quran",
    "label": "Book Quran",
    "unicode": "f687",
    "terms": [
      "book",
      "islam",
      "muslim",
      "religion"
    ]
  },
  {
    "name": "book-skull",
    "label": "Book Skull",
    "unicode": "f6b7",
    "terms": [
      "Dungeons & Dragons",
      "crossbones",
      "d&d",
      "dark arts",
      "death",
      "dnd",
      "documentation",
      "evil",
      "fantasy",
      "halloween",
      "holiday",
      "library",
      "necronomicon",
      "read",
      "research",
      "skull",
      "spell"
    ]
  },
  {
    "name": "book-tanakh",
    "label": "Book Tanakh",
    "unicode": "f827",
    "terms": [
      "book",
      "jewish",
      "judaism",
      "religion"
    ]
  },
  {
    "name": "bookmark",
    "label": "Bookmark",
    "unicode": "f02e",
    "terms": [
      "bookmark",
      "favorite",
      "library",
      "mark",
      "marker",
      "read",
      "remember",
      "research",
      "save"
    ]
  },
  {
    "name": "border-all",
    "label": "Border All",
    "unicode": "f84c",
    "terms": [
      "cell",
      "grid",
      "outline",
      "stroke",
      "table"
    ]
  },
  {
    "name": "border-none",
    "label": "Border None",
    "unicode": "f850",
    "terms": [
      "cell",
      "grid",
      "outline",
      "stroke",
      "table"
    ]
  },
  {
    "name": "border-top-left",
    "label": "Border Top Left",
    "unicode": "f853",
    "terms": [
      "cell",
      "outline",
      "stroke",
      "table"
    ]
  },
  {
    "name": "bore-hole",
    "label": "Bore Hole",
    "unicode": "e4c3",
    "terms": [
      "bore",
      "bury",
      "drill",
      "hole"
    ]
  },
  {
    "name": "bottle-droplet",
    "label": "Bottle Droplet",
    "unicode": "e4c4",
    "terms": [
      "alcohol",
      "drink",
      "oil",
      "olive oil",
      "wine"
    ]
  },
  {
    "name": "bottle-water",
    "label": "Bottle Water",
    "unicode": "e4c5",
    "terms": [
      "h2o",
      "plastic",
      "water"
    ]
  },
  {
    "name": "bowl-food",
    "label": "Bowl Food",
    "unicode": "e4c6",
    "terms": [
      "catfood",
      "dogfood",
      "food",
      "rice"
    ]
  },
  {
    "name": "bowl-rice",
    "label": "Bowl Rice",
    "unicode": "e2eb",
    "terms": [
      "boiled",
      "cooked",
      "cooked rice",
      "rice",
      "steamed"
    ]
  },
  {
    "name": "bowling-ball",
    "label": "Bowling Ball",
    "unicode": "f436",
    "terms": [
      "alley",
      "candlepin",
      "gutter",
      "lane",
      "strike",
      "tenpin"
    ]
  },
  {
    "name": "box",
    "label": "Box",
    "unicode": "f466",
    "terms": [
      "archive",
      "box",
      "container",
      "package",
      "parcel",
      "storage"
    ]
  },
  {
    "name": "box-archive",
    "label": "Box Archive",
    "unicode": "f187",
    "terms": [
      "box",
      "package",
      "save",
      "storage"
    ]
  },
  {
    "name": "box-open",
    "label": "Box Open",
    "unicode": "f49e",
    "terms": [
      "archive",
      "container",
      "package",
      "storage",
      "unpack"
    ]
  },
  {
    "name": "box-tissue",
    "label": "Box Tissue",
    "unicode": "e05b",
    "terms": [
      "cough",
      "covid-19",
      "kleenex",
      "mucus",
      "nose",
      "sneeze",
      "snot"
    ]
  },
  {
    "name": "boxes-packing",
    "label": "Boxes Packing",
    "unicode": "e4c7",
    "terms": [
      "archive",
      "box",
      "package",
      "storage",
      "supplies"
    ]
  },
  {
    "name": "boxes-stacked",
    "label": "Boxes Stacked",
    "unicode": "f468",
    "terms": [
      "archives",
      "inventory",
      "storage",
      "warehouse"
    ]
  },
  {
    "name": "braille",
    "label": "Braille",
    "unicode": "f2a1",
    "terms": [
      "alphabet",
      "blind",
      "dots",
      "raised",
      "vision"
    ]
  },
  {
    "name": "brain",
    "label": "Brain",
    "unicode": "f5dc",
    "terms": [
      "brain",
      "cerebellum",
      "gray matter",
      "intellect",
      "intelligent",
      "knowledge",
      "medulla oblongata",
      "mind",
      "noodle",
      "scholar",
      "wit"
    ]
  },
  {
    "name": "brazilian-real-sign",
    "label": "Brazilian Real Sign",
    "unicode": "e46c",
    "terms": [
      "brazilian real sign",
      "currency"
    ]
  },
  {
    "name": "bread-slice",
    "label": "Bread Slice",
    "unicode": "f7ec",
    "terms": [
      "bake",
      "bakery",
      "baking",
      "dough",
      "flour",
      "gluten",
      "grain",
      "sandwich",
      "sourdough",
      "toast",
      "wheat",
      "yeast"
    ]
  },
  {
    "name": "bridge",
    "label": "Bridge",
    "unicode": "e4c8",
    "terms": [
      "bridge",
      "road"
    ]
  },
  {
    "name": "bridge-circle-check",
    "label": "Bridge Circle Check",
    "unicode": "e4c9",
    "terms": [
      "bridge",
      "enable",
      "not affected",
      "ok",
      "okay",
      "road",
      "validate",
      "working"
    ]
  },
  {
    "name": "bridge-circle-exclamation",
    "label": "Bridge Circle Exclamation",
    "unicode": "e4ca",
    "terms": [
      "affected",
      "bridge",
      "failed",
      "road"
    ]
  },
  {
    "name": "bridge-circle-xmark",
    "label": "Bridge Circle Xmark",
    "unicode": "e4cb",
    "terms": [
      "bridge",
      "destroy",
      "road",
      "uncheck"
    ]
  },
  {
    "name": "bridge-lock",
    "label": "Bridge Lock",
    "unicode": "e4cc",
    "terms": [
      "bridge",
      "closed",
      "lockdown",
      "padlock",
      "privacy",
      "quarantine",
      "road"
    ]
  },
  {
    "name": "bridge-water",
    "label": "Bridge Water",
    "unicode": "e4ce",
    "terms": [
      "bridge",
      "road"
    ]
  },
  {
    "name": "briefcase",
    "label": "Briefcase",
    "unicode": "f0b1",
    "terms": [
      "bag",
      "briefcas",
      "briefcase",
      "business",
      "luggage",
      "offer",
      "office",
      "portfolio",
      "work"
    ]
  },
  {
    "name": "briefcase-medical",
    "label": "Briefcase Medical",
    "unicode": "f469",
    "terms": [
      "doctor",
      "emt",
      "first aid",
      "health"
    ]
  },
  {
    "name": "broom",
    "label": "Broom",
    "unicode": "f51a",
    "terms": [
      "broom",
      "clean",
      "cleaning",
      "firebolt",
      "fly",
      "halloween",
      "nimbus 2000",
      "quidditch",
      "sweep",
      "sweeping",
      "witch"
    ]
  },
  {
    "name": "broom-ball",
    "label": "Broom Ball",
    "unicode": "f458",
    "terms": [
      "ball",
      "bludger",
      "broom",
      "golden snitch",
      "harry potter",
      "hogwarts",
      "quaffle",
      "sport",
      "wizard"
    ]
  },
  {
    "name": "brush",
    "label": "Brush",
    "unicode": "f55d",
    "terms": [
      "art",
      "bristles",
      "color",
      "handle",
      "maintenance",
      "modify",
      "paint"
    ]
  },
  {
    "name": "bucket",
    "label": "Bucket",
    "unicode": "e4cf",
    "terms": [
      "bucket",
      "pail",
      "sandcastle"
    ]
  },
  {
    "name": "bug",
    "label": "Bug",
    "unicode": "f188",
    "terms": [
      "beetle",
      "error",
      "glitch",
      "insect",
      "repair",
      "report"
    ]
  },
  {
    "name": "bug-slash",
    "label": "Bug Slash",
    "unicode": "e490",
    "terms": [
      "beetle",
      "disabled",
      "fix",
      "glitch",
      "insect",
      "optimize",
      "repair",
      "report",
      "warning"
    ]
  },
  {
    "name": "bugs",
    "label": "Bugs",
    "unicode": "e4d0",
    "terms": [
      "bedbug",
      "infestation",
      "lice",
      "plague",
      "ticks"
    ]
  },
  {
    "name": "building",
    "label": "Building",
    "unicode": "f1ad",
    "terms": [
      "apartment",
      "building",
      "business",
      "city",
      "company",
      "office",
      "office building",
      "urban",
      "work"
    ]
  },
  {
    "name": "building-circle-arrow-right",
    "label": "Building Circle Arrow Right",
    "unicode": "e4d1",
    "terms": [
      "building",
      "city",
      "distribution center",
      "office"
    ]
  },
  {
    "name": "building-circle-check",
    "label": "Building Circle Check",
    "unicode": "e4d2",
    "terms": [
      "building",
      "city",
      "enable",
      "not affected",
      "office",
      "ok",
      "okay",
      "validate",
      "working"
    ]
  },
  {
    "name": "building-circle-exclamation",
    "label": "Building Circle Exclamation",
    "unicode": "e4d3",
    "terms": [
      "affected",
      "building",
      "city",
      "failed",
      "office"
    ]
  },
  {
    "name": "building-circle-xmark",
    "label": "Building Circle Xmark",
    "unicode": "e4d4",
    "terms": [
      "building",
      "city",
      "destroy",
      "office",
      "uncheck"
    ]
  },
  {
    "name": "building-columns",
    "label": "Building Columns",
    "unicode": "f19c",
    "terms": [
      "bank",
      "building",
      "college",
      "education",
      "institution",
      "museum",
      "students"
    ]
  },
  {
    "name": "building-flag",
    "label": "Building Flag",
    "unicode": "e4d5",
    "terms": [
      "building",
      "city",
      "diplomat",
      "embassy",
      "flag",
      "headquarters",
      "united nations"
    ]
  },
  {
    "name": "building-lock",
    "label": "Building Lock",
    "unicode": "e4d6",
    "terms": [
      "building",
      "city",
      "closed",
      "lock",
      "lockdown",
      "padlock",
      "privacy",
      "quarantine",
      "secure"
    ]
  },
  {
    "name": "building-ngo",
    "label": "Building Ngo",
    "unicode": "e4d7",
    "terms": [
      "building",
      "city",
      "non governmental organization",
      "office"
    ]
  },
  {
    "name": "building-shield",
    "label": "Building Shield",
    "unicode": "e4d8",
    "terms": [
      "building",
      "city",
      "police",
      "protect",
      "safety"
    ]
  },
  {
    "name": "building-un",
    "label": "Building Un",
    "unicode": "e4d9",
    "terms": [
      "building",
      "city",
      "office",
      "united nations"
    ]
  },
  {
    "name": "building-user",
    "label": "Building User",
    "unicode": "e4da",
    "terms": [
      "apartment",
      "building",
      "city",
      "employee",
      "uer"
    ]
  },
  {
    "name": "building-wheat",
    "label": "Building Wheat",
    "unicode": "e4db",
    "terms": [
      "agriculture",
      "building",
      "city",
      "usda"
    ]
  },
  {
    "name": "bullhorn",
    "label": "Bullhorn",
    "unicode": "f0a1",
    "terms": [
      "Bullhorn",
      "announcement",
      "broadcast",
      "loud",
      "louder",
      "loudspeaker",
      "megaphone",
      "public address",
      "request",
      "share"
    ]
  },
  {
    "name": "bullseye",
    "label": "Bullseye",
    "unicode": "f140",
    "terms": [
      "archery",
      "goal",
      "objective",
      "strategy",
      "target"
    ]
  },
  {
    "name": "burger",
    "label": "Burger",
    "unicode": "f805",
    "terms": [
      "bacon",
      "beef",
      "burger",
      "burger king",
      "cheeseburger",
      "fast food",
      "grill",
      "ground beef",
      "mcdonalds",
      "sandwich"
    ]
  },
  {
    "name": "burst",
    "label": "Burst",
    "unicode": "e4dc",
    "terms": [
      "boom",
      "crash",
      "explosion"
    ]
  },
  {
    "name": "bus",
    "label": "Bus",
    "unicode": "f207",
    "terms": [
      "bus",
      "oncoming",
      "oncoming bus",
      "public transportation",
      "transportation",
      "travel",
      "vehicle"
    ]
  },
  {
    "name": "bus-simple",
    "label": "Bus Simple",
    "unicode": "f55e",
    "terms": [
      "mta",
      "public transportation",
      "transportation",
      "travel",
      "vehicle"
    ]
  },
  {
    "name": "business-time",
    "label": "Business Time",
    "unicode": "f64a",
    "terms": [
      "alarm",
      "briefcase",
      "business socks",
      "clock",
      "flight of the conchords",
      "portfolio",
      "reminder",
      "wednesday"
    ]
  },
  {
    "name": "c",
    "label": "C",
    "unicode": "43",
    "terms": [
      "Latin Capital Letter C",
      "Latin Small Letter C",
      "letter"
    ]
  },
  {
    "name": "cable-car",
    "label": "Cable Car",
    "unicode": "f7da",
    "terms": [
      "aerial tramway",
      "cable",
      "gondola",
      "lift",
      "mountain",
      "mountain cableway",
      "tram",
      "tramway",
      "trolley"
    ]
  },
  {
    "name": "cake-candles",
    "label": "Cake Candles",
    "unicode": "f1fd",
    "terms": [
      "anniversary",
      "bakery",
      "birthday",
      "birthday cake",
      "cake",
      "candles",
      "celebration",
      "dessert",
      "frosting",
      "holiday",
      "party",
      "pastry",
      "sweet"
    ]
  },
  {
    "name": "calculator",
    "label": "Calculator",
    "unicode": "f1ec",
    "terms": [
      "Pocket Calculator",
      "abacus",
      "addition",
      "arithmetic",
      "counting",
      "math",
      "multiplication",
      "subtraction"
    ]
  },
  {
    "name": "calendar",
    "label": "Calendar",
    "unicode": "f133",
    "terms": [
      "calendar",
      "calendar-o",
      "date",
      "day",
      "event",
      "month",
      "schedule",
      "tear-off calendar",
      "time",
      "when",
      "year"
    ]
  },
  {
    "name": "calendar-check",
    "label": "Calendar Check",
    "unicode": "f274",
    "terms": [
      "accept",
      "agree",
      "appointment",
      "confirm",
      "correct",
      "date",
      "day",
      "done",
      "enable",
      "event",
      "month",
      "ok",
      "schedule",
      "select",
      "success",
      "tick",
      "time",
      "todo",
      "validate",
      "warranty",
      "when",
      "working",
      "year"
    ]
  },
  {
    "name": "calendar-day",
    "label": "Calendar Day",
    "unicode": "f783",
    "terms": [
      "date",
      "day",
      "detail",
      "event",
      "focus",
      "month",
      "schedule",
      "single day",
      "time",
      "today",
      "when",
      "year"
    ]
  },
  {
    "name": "calendar-days",
    "label": "Calendar Days",
    "unicode": "f073",
    "terms": [
      "calendar",
      "date",
      "day",
      "event",
      "month",
      "schedule",
      "time",
      "when",
      "year"
    ]
  },
  {
    "name": "calendar-minus",
    "label": "Calendar Minus",
    "unicode": "f272",
    "terms": [
      "calendar",
      "date",
      "day",
      "delete",
      "event",
      "month",
      "negative",
      "remove",
      "schedule",
      "time",
      "when",
      "year"
    ]
  },
  {
    "name": "calendar-plus",
    "label": "Calendar Plus",
    "unicode": "f271",
    "terms": [
      "add",
      "calendar",
      "create",
      "date",
      "day",
      "event",
      "month",
      "new",
      "positive",
      "schedule",
      "time",
      "when",
      "year"
    ]
  },
  {
    "name": "calendar-week",
    "label": "Calendar Week",
    "unicode": "f784",
    "terms": [
      "date",
      "day",
      "detail",
      "event",
      "focus",
      "month",
      "schedule",
      "single week",
      "time",
      "today",
      "when",
      "year"
    ]
  },
  {
    "name": "calendar-xmark",
    "label": "Calendar Xmark",
    "unicode": "f273",
    "terms": [
      "archive",
      "calendar",
      "date",
      "day",
      "delete",
      "event",
      "month",
      "remove",
      "schedule",
      "time",
      "uncheck",
      "when",
      "x",
      "year"
    ]
  },
  {
    "name": "camera",
    "label": "Camera",
    "unicode": "f030",
    "terms": [
      "image",
      "img",
      "lens",
      "photo",
      "picture",
      "record",
      "shutter",
      "video"
    ]
  },
  {
    "name": "camera-retro",
    "label": "Camera Retro",
    "unicode": "f083",
    "terms": [
      "camera",
      "image",
      "img",
      "lens",
      "photo",
      "picture",
      "record",
      "shutter",
      "video"
    ]
  },
  {
    "name": "camera-rotate",
    "label": "Camera Rotate",
    "unicode": "e0d8",
    "terms": [
      "flip",
      "front-facing",
      "img",
      "photo",
      "selfie"
    ]
  },
  {
    "name": "campground",
    "label": "Campground",
    "unicode": "f6bb",
    "terms": [
      "camping",
      "fall",
      "outdoors",
      "teepee",
      "tent",
      "tipi"
    ]
  },
  {
    "name": "candy-cane",
    "label": "Candy Cane",
    "unicode": "f786",
    "terms": [
      "candy",
      "christmas",
      "holiday",
      "mint",
      "peppermint",
      "striped",
      "xmas"
    ]
  },
  {
    "name": "cannabis",
    "label": "Cannabis",
    "unicode": "f55f",
    "terms": [
      "bud",
      "chronic",
      "drugs",
      "endica",
      "endo",
      "ganja",
      "marijuana",
      "mary jane",
      "pot",
      "reefer",
      "sativa",
      "spliff",
      "weed",
      "whacky-tabacky"
    ]
  },
  {
    "name": "capsules",
    "label": "Capsules",
    "unicode": "f46b",
    "terms": [
      "drugs",
      "medicine",
      "pills",
      "prescription"
    ]
  },
  {
    "name": "car",
    "label": "Car",
    "unicode": "f1b9",
    "terms": [
      "auto",
      "automobile",
      "car",
      "oncoming",
      "oncoming automobile",
      "sedan",
      "transportation",
      "travel",
      "vehicle"
    ]
  },
  {
    "name": "car-battery",
    "label": "Car Battery",
    "unicode": "f5df",
    "terms": [
      "auto",
      "electric",
      "mechanic",
      "power"
    ]
  },
  {
    "name": "car-burst",
    "label": "Car Burst",
    "unicode": "f5e1",
    "terms": [
      "accident",
      "auto",
      "automobile",
      "insurance",
      "sedan",
      "transportation",
      "vehicle",
      "wreck"
    ]
  },
  {
    "name": "car-on",
    "label": "Car On",
    "unicode": "e4dd",
    "terms": [
      "alarm",
      "car",
      "carjack",
      "warning"
    ]
  },
  {
    "name": "car-rear",
    "label": "Car Rear",
    "unicode": "f5de",
    "terms": [
      "auto",
      "automobile",
      "sedan",
      "transportation",
      "travel",
      "vehicle"
    ]
  },
  {
    "name": "car-side",
    "label": "Car Side",
    "unicode": "f5e4",
    "terms": [
      "auto",
      "automobile",
      "car",
      "sedan",
      "transportation",
      "travel",
      "vehicle"
    ]
  },
  {
    "name": "car-tunnel",
    "label": "Car Tunnel",
    "unicode": "e4de",
    "terms": [
      "road",
      "tunnel"
    ]
  },
  {
    "name": "caravan",
    "label": "Caravan",
    "unicode": "f8ff",
    "terms": [
      "camper",
      "motor home",
      "rv",
      "trailer",
      "travel"
    ]
  },
  {
    "name": "caret-down",
    "label": "Caret Down",
    "unicode": "f0d7",
    "terms": [
      "arrow",
      "dropdown",
      "expand",
      "menu",
      "more",
      "triangle"
    ]
  },
  {
    "name": "caret-left",
    "label": "Caret Left",
    "unicode": "f0d9",
    "terms": [
      "arrow",
      "back",
      "previous",
      "triangle"
    ]
  },
  {
    "name": "caret-right",
    "label": "Caret Right",
    "unicode": "f0da",
    "terms": [
      "arrow",
      "forward",
      "next",
      "triangle"
    ]
  },
  {
    "name": "caret-up",
    "label": "Caret Up",
    "unicode": "f0d8",
    "terms": [
      "arrow",
      "collapse",
      "triangle",
      "upgrade"
    ]
  },
  {
    "name": "carrot",
    "label": "Carrot",
    "unicode": "f787",
    "terms": [
      "bugs bunny",
      "carrot",
      "food",
      "orange",
      "vegan",
      "vegetable"
    ]
  },
  {
    "name": "cart-arrow-down",
    "label": "Cart Arrow Down",
    "unicode": "f218",
    "terms": [
      "download",
      "insert",
      "save",
      "shopping"
    ]
  },
  {
    "name": "cart-flatbed",
    "label": "Cart Flatbed",
    "unicode": "f474",
    "terms": [
      "carry",
      "inventory",
      "shipping",
      "transport"
    ]
  },
  {
    "name": "cart-flatbed-suitcase",
    "label": "Cart Flatbed Suitcase",
    "unicode": "f59d",
    "terms": [
      "airport",
      "bag",
      "baggage",
      "suitcase",
      "travel"
    ]
  },
  {
    "name": "cart-plus",
    "label": "Cart Plus",
    "unicode": "f217",
    "terms": [
      "add",
      "create",
      "new",
      "positive",
      "shopping"
    ]
  },
  {
    "name": "cart-shopping",
    "label": "Cart Shopping",
    "unicode": "f07a",
    "terms": [
      "buy",
      "cart",
      "checkout",
      "grocery",
      "payment",
      "purchase",
      "shopping",
      "shopping cart",
      "trolley"
    ]
  },
  {
    "name": "cash-register",
    "label": "Cash Register",
    "unicode": "f788",
    "terms": [
      "buy",
      "cha-ching",
      "change",
      "checkout",
      "commerce",
      "leaerboard",
      "machine",
      "pay",
      "payment",
      "purchase",
      "store"
    ]
  },
  {
    "name": "cat",
    "label": "Cat",
    "unicode": "f6be",
    "terms": [
      "cat",
      "feline",
      "halloween",
      "holiday",
      "kitten",
      "kitty",
      "meow",
      "pet"
    ]
  },
  {
    "name": "cedi-sign",
    "label": "Cedi Sign",
    "unicode": "e0df",
    "terms": [
      "Cedi Sign",
      "currency"
    ]
  },
  {
    "name": "cent-sign",
    "label": "Cent Sign",
    "unicode": "e3f5",
    "terms": [
      "Cent Sign",
      "currency"
    ]
  },
  {
    "name": "certificate",
    "label": "Certificate",
    "unicode": "f0a3",
    "terms": [
      "badge",
      "guarantee",
      "star",
      "verified"
    ]
  },
  {
    "name": "chair",
    "label": "Chair",
    "unicode": "f6c0",
    "terms": [
      "chair",
      "furniture",
      "seat",
      "sit"
    ]
  },
  {
    "name": "chalkboard",
    "label": "Chalkboard",
    "unicode": "f51b",
    "terms": [
      "blackboard",
      "learning",
      "school",
      "teaching",
      "whiteboard",
      "writing"
    ]
  },
  {
    "name": "chalkboard-user",
    "label": "Chalkboard User",
    "unicode": "f51c",
    "terms": [
      "blackboard",
      "instructor",
      "learning",
      "professor",
      "school",
      "uer",
      "whiteboard",
      "writing"
    ]
  },
  {
    "name": "champagne-glasses",
    "label": "Champagne Glasses",
    "unicode": "f79f",
    "terms": [
      "alcohol",
      "bar",
      "beverage",
      "celebrate",
      "celebration",
      "champagne",
      "clink",
      "clinking glasses",
      "drink",
      "glass",
      "holiday",
      "new year's eve",
      "party",
      "toast"
    ]
  },
  {
    "name": "charging-station",
    "label": "Charging Station",
    "unicode": "f5e7",
    "terms": [
      "electric",
      "ev",
      "tesla",
      "vehicle"
    ]
  },
  {
    "name": "chart-area",
    "label": "Chart Area",
    "unicode": "f1fe",
    "terms": [
      "analytics",
      "area",
      "chart",
      "graph",
      "performance",
      "revenue",
      "statistics"
    ]
  },
  {
    "name": "chart-bar",
    "label": "Chart Bar",
    "unicode": "f080",
    "terms": [
      "analytics",
      "bar",
      "chart",
      "graph",
      "performance",
      "statistics"
    ]
  },
  {
    "name": "chart-column",
    "label": "Chart Column",
    "unicode": "e0e3",
    "terms": [
      "bar",
      "bar chart",
      "chart",
      "graph",
      "performance",
      "revenue",
      "statistics",
      "track",
      "trend"
    ]
  },
  {
    "name": "chart-diagram",
    "label": "Chart Diagram",
    "unicode": "e695",
    "terms": [
      "algorithm",
      "analytics",
      "flow",
      "graph"
    ]
  },
  {
    "name": "chart-gantt",
    "label": "Chart Gantt",
    "unicode": "e0e4",
    "terms": [
      "chart",
      "graph",
      "performance",
      "statistics",
      "track",
      "trend"
    ]
  },
  {
    "name": "chart-line",
    "label": "Chart Line",
    "unicode": "f201",
    "terms": [
      "activity",
      "analytics",
      "chart",
      "dashboard",
      "gain",
      "graph",
      "increase",
      "line",
      "performance",
      "revenue",
      "statistics"
    ]
  },
  {
    "name": "chart-pie",
    "label": "Chart Pie",
    "unicode": "f200",
    "terms": [
      "analytics",
      "chart",
      "diagram",
      "graph",
      "performance",
      "pie",
      "revenue",
      "statistics"
    ]
  },
  {
    "name": "chart-simple",
    "label": "Chart Simple",
    "unicode": "e473",
    "terms": [
      "analytics",
      "bar",
      "chart",
      "column",
      "graph",
      "performance",
      "revenue",
      "row",
      "statistics",
      "trend"
    ]
  },
  {
    "name": "check",
    "label": "Check",
    "unicode": "f00c",
    "terms": [
      "Check Mark",
      "accept",
      "agree",
      "check",
      "check mark",
      "checkmark",
      "confirm",
      "correct",
      "coupon",
      "done",
      "enable",
      "mark",
      "notice",
      "notification",
      "notify",
      "ok",
      "select",
      "success",
      "tick",
      "todo",
      "true",
      "validate",
      "working",
      "yes",
      "✓"
    ]
  },
  {
    "name": "check-double",
    "label": "Check Double",
    "unicode": "f560",
    "terms": [
      "accept",
      "agree",
      "checkmark",
      "confirm",
      "correct",
      "coupon",
      "done",
      "enable",
      "notice",
      "notification",
      "notify",
      "ok",
      "select",
      "select all",
      "success",
      "tick",
      "todo",
      "validate",
      "working"
    ]
  },
  {
    "name": "check-to-slot",
    "label": "Check To Slot",
    "unicode": "f772",
    "terms": [
      "accept",
      "cast",
      "election",
      "enable",
      "politics",
      "positive",
      "validate",
      "voting",
      "working",
      "yes"
    ]
  },
  {
    "name": "cheese",
    "label": "Cheese",
    "unicode": "f7ef",
    "terms": [
      "cheddar",
      "curd",
      "gouda",
      "melt",
      "parmesan",
      "sandwich",
      "swiss",
      "wedge"
    ]
  },
  {
    "name": "chess",
    "label": "Chess",
    "unicode": "f439",
    "terms": [
      "board",
      "castle",
      "checkmate",
      "game",
      "king",
      "rook",
      "strategy",
      "tournament"
    ]
  },
  {
    "name": "chess-bishop",
    "label": "Chess Bishop",
    "unicode": "f43a",
    "terms": [
      "Black Chess Bishop",
      "board",
      "checkmate",
      "game",
      "strategy"
    ]
  },
  {
    "name": "chess-board",
    "label": "Chess Board",
    "unicode": "f43c",
    "terms": [
      "board",
      "checkmate",
      "game",
      "strategy"
    ]
  },
  {
    "name": "chess-king",
    "label": "Chess King",
    "unicode": "f43f",
    "terms": [
      "Black Chess King",
      "board",
      "checkmate",
      "game",
      "strategy"
    ]
  },
  {
    "name": "chess-knight",
    "label": "Chess Knight",
    "unicode": "f441",
    "terms": [
      "Black Chess Knight",
      "board",
      "checkmate",
      "game",
      "horse",
      "strategy"
    ]
  },
  {
    "name": "chess-pawn",
    "label": "Chess Pawn",
    "unicode": "f443",
    "terms": [
      "board",
      "checkmate",
      "chess",
      "chess pawn",
      "dupe",
      "expendable",
      "game",
      "strategy"
    ]
  },
  {
    "name": "chess-queen",
    "label": "Chess Queen",
    "unicode": "f445",
    "terms": [
      "Black Chess Queen",
      "board",
      "checkmate",
      "game",
      "strategy"
    ]
  },
  {
    "name": "chess-rook",
    "label": "Chess Rook",
    "unicode": "f447",
    "terms": [
      "Black Chess Rook",
      "board",
      "castle",
      "checkmate",
      "game",
      "strategy"
    ]
  },
  {
    "name": "chevron-down",
    "label": "Chevron Down",
    "unicode": "f078",
    "terms": [
      "arrow",
      "download",
      "expand",
      "insert"
    ]
  },
  {
    "name": "chevron-left",
    "label": "Chevron Left",
    "unicode": "f053",
    "terms": [
      "Left-Pointing Angle Bracket",
      "arrow",
      "back",
      "bracket",
      "previous"
    ]
  },
  {
    "name": "chevron-right",
    "label": "Chevron Right",
    "unicode": "f054",
    "terms": [
      "Right-Pointing Angle Bracket",
      "arrow",
      "bracket",
      "forward",
      "next"
    ]
  },
  {
    "name": "chevron-up",
    "label": "Chevron Up",
    "unicode": "f077",
    "terms": [
      "arrow",
      "collapse",
      "upgrade",
      "upload"
    ]
  },
  {
    "name": "child",
    "label": "Child",
    "unicode": "f1ae",
    "terms": [
      "boy",
      "girl",
      "kid",
      "toddler",
      "uer",
      "young",
      "youth"
    ]
  },
  {
    "name": "child-combatant",
    "label": "Child Combatant",
    "unicode": "e4e0",
    "terms": [
      "combatant"
    ]
  },
  {
    "name": "child-dress",
    "label": "Child Dress",
    "unicode": "e59c",
    "terms": [
      "boy",
      "girl",
      "kid",
      "toddler",
      "uer",
      "young",
      "youth"
    ]
  },
  {
    "name": "child-reaching",
    "label": "Child Reaching",
    "unicode": "e59d",
    "terms": [
      "boy",
      "girl",
      "kid",
      "toddler",
      "uer",
      "young",
      "youth"
    ]
  },
  {
    "name": "children",
    "label": "Children",
    "unicode": "e4e1",
    "terms": [
      "boy",
      "child",
      "girl",
      "kid",
      "kids",
      "together",
      "uer",
      "young",
      "youth"
    ]
  },
  {
    "name": "church",
    "label": "Church",
    "unicode": "f51d",
    "terms": [
      "Christian",
      "building",
      "cathedral",
      "chapel",
      "church",
      "community",
      "cross",
      "religion"
    ]
  },
  {
    "name": "circle",
    "label": "Circle",
    "unicode": "f111",
    "terms": [
      "Black Circle",
      "Black Large Circle",
      "black circle",
      "blue",
      "blue circle",
      "brown",
      "brown circle",
      "chart",
      "circle",
      "circle-thin",
      "diameter",
      "dot",
      "ellipse",
      "fill",
      "geometric",
      "green",
      "green circle",
      "notification",
      "orange",
      "orange circle",
      "progress",
      "purple",
      "purple circle",
      "red",
      "red circle",
      "round",
      "white circle",
      "yellow",
      "yellow circle"
    ]
  },
  {
    "name": "circle-arrow-down",
    "label": "Circle Arrow Down",
    "unicode": "f0ab",
    "terms": [
      "download"
    ]
  },
  {
    "name": "circle-arrow-left",
    "label": "Circle Arrow Left",
    "unicode": "f0a8",
    "terms": [
      "back",
      "previous"
    ]
  },
  {
    "name": "circle-arrow-right",
    "label": "Circle Arrow Right",
    "unicode": "f0a9",
    "terms": [
      "forward",
      "next"
    ]
  },
  {
    "name": "circle-arrow-up",
    "label": "Circle Arrow Up",
    "unicode": "f0aa",
    "terms": [
      "upgrade",
      "upload"
    ]
  },
  {
    "name": "circle-check",
    "label": "Circle Check",
    "unicode": "f058",
    "terms": [
      "accept",
      "affected",
      "agree",
      "clear",
      "confirm",
      "correct",
      "coupon",
      "done",
      "enable",
      "ok",
      "select",
      "success",
      "tick",
      "todo",
      "validate",
      "working",
      "yes"
    ]
  },
  {
    "name": "circle-chevron-down",
    "label": "Circle Chevron Down",
    "unicode": "f13a",
    "terms": [
      "arrow",
      "download",
      "dropdown",
      "menu",
      "more"
    ]
  },
  {
    "name": "circle-chevron-left",
    "label": "Circle Chevron Left",
    "unicode": "f137",
    "terms": [
      "arrow",
      "back",
      "previous"
    ]
  },
  {
    "name": "circle-chevron-right",
    "label": "Circle Chevron Right",
    "unicode": "f138",
    "terms": [
      "arrow",
      "forward",
      "next"
    ]
  },
  {
    "name": "circle-chevron-up",
    "label": "Circle Chevron Up",
    "unicode": "f139",
    "terms": [
      "arrow",
      "collapse",
      "upgrade",
      "upload"
    ]
  },
  {
    "name": "circle-dollar-to-slot",
    "label": "Circle Dollar To Slot",
    "unicode": "f4b9",
    "terms": [
      "contribute",
      "generosity",
      "gift",
      "give",
      "premium"
    ]
  },
  {
    "name": "circle-dot",
    "label": "Circle Dot",
    "unicode": "f192",
    "terms": [
      "bullseye",
      "button",
      "geometric",
      "notification",
      "radio",
      "radio button",
      "target"
    ]
  },
  {
    "name": "circle-down",
    "label": "Circle Down",
    "unicode": "f358",
    "terms": [
      "arrow-circle-o-down",
      "download"
    ]
  },
  {
    "name": "circle-exclamation",
    "label": "Circle Exclamation",
    "unicode": "f06a",
    "terms": [
      "affect",
      "alert",
      "attention",
      "damage",
      "danger",
      "error",
      "failed",
      "important",
      "notice",
      "notification",
      "notify",
      "problem",
      "required",
      "warning"
    ]
  },
  {
    "name": "circle-h",
    "label": "Circle H",
    "unicode": "f47e",
    "terms": [
      "Circled Latin Capital Letter H",
      "clinic",
      "covid-19",
      "emergency",
      "letter",
      "map"
    ]
  },
  {
    "name": "circle-half-stroke",
    "label": "Circle Half Stroke",
    "unicode": "f042",
    "terms": [
      "Circle with Left Half Black",
      "adjust",
      "chart",
      "contrast",
      "dark",
      "fill",
      "light",
      "pie",
      "progress",
      "saturation"
    ]
  },
  {
    "name": "circle-info",
    "label": "Circle Info",
    "unicode": "f05a",
    "terms": [
      "details",
      "help",
      "information",
      "more",
      "support"
    ]
  },
  {
    "name": "circle-left",
    "label": "Circle Left",
    "unicode": "f359",
    "terms": [
      "arrow-circle-o-left",
      "back",
      "previous"
    ]
  },
  {
    "name": "circle-minus",
    "label": "Circle Minus",
    "unicode": "f056",
    "terms": [
      "delete",
      "hide",
      "negative",
      "remove",
      "shape",
      "trash"
    ]
  },
  {
    "name": "circle-nodes",
    "label": "Circle Nodes",
    "unicode": "e4e2",
    "terms": [
      "cluster",
      "connect",
      "network"
    ]
  },
  {
    "name": "circle-notch",
    "label": "Circle Notch",
    "unicode": "f1ce",
    "terms": [
      "circle-o-notch",
      "diameter",
      "dot",
      "ellipse",
      "round",
      "spinner"
    ]
  },
  {
    "name": "circle-pause",
    "label": "Circle Pause",
    "unicode": "f28b",
    "terms": [
      "hold",
      "wait"
    ]
  },
  {
    "name": "circle-play",
    "label": "Circle Play",
    "unicode": "f144",
    "terms": [
      "audio",
      "music",
      "playing",
      "sound",
      "start",
      "video"
    ]
  },
  {
    "name": "circle-plus",
    "label": "Circle Plus",
    "unicode": "f055",
    "terms": [
      "add",
      "create",
      "expand",
      "new",
      "positive",
      "shape"
    ]
  },
  {
    "name": "circle-question",
    "label": "Circle Question",
    "unicode": "f059",
    "terms": [
      "faq",
      "help",
      "information",
      "support",
      "unknown"
    ]
  },
  {
    "name": "circle-radiation",
    "label": "Circle Radiation",
    "unicode": "f7ba",
    "terms": [
      "danger",
      "dangerous",
      "deadly",
      "hazard",
      "nuclear",
      "radioactive",
      "sign",
      "warning"
    ]
  },
  {
    "name": "circle-right",
    "label": "Circle Right",
    "unicode": "f35a",
    "terms": [
      "arrow-circle-o-right",
      "forward",
      "next"
    ]
  },
  {
    "name": "circle-stop",
    "label": "Circle Stop",
    "unicode": "f28d",
    "terms": [
      "block",
      "box",
      "circle",
      "square"
    ]
  },
  {
    "name": "circle-up",
    "label": "Circle Up",
    "unicode": "f35b",
    "terms": [
      "arrow-circle-o-up",
      "upgrade"
    ]
  },
  {
    "name": "circle-user",
    "label": "Circle User",
    "unicode": "f2bd",
    "terms": [
      "employee",
      "uer",
      "username",
      "users-people"
    ]
  },
  {
    "name": "circle-xmark",
    "label": "Circle Xmark",
    "unicode": "f057",
    "terms": [
      "close",
      "cross",
      "destroy",
      "exit",
      "incorrect",
      "notice",
      "notification",
      "notify",
      "problem",
      "uncheck",
      "wrong",
      "x"
    ]
  },
  {
    "name": "city",
    "label": "City",
    "unicode": "f64f",
    "terms": [
      "buildings",
      "busy",
      "city",
      "cityscape",
      "skyscrapers",
      "urban",
      "windows"
    ]
  },
  {
    "name": "clapperboard",
    "label": "Clapperboard",
    "unicode": "e131",
    "terms": [
      "camera",
      "clapper",
      "clapper board",
      "director",
      "film",
      "movie",
      "record"
    ]
  },
  {
    "name": "clipboard",
    "label": "Clipboard",
    "unicode": "f328",
    "terms": [
      "clipboar",
      "clipboard",
      "copy",
      "notepad",
      "notes",
      "paste",
      "record"
    ]
  },
  {
    "name": "clipboard-check",
    "label": "Clipboard Check",
    "unicode": "f46c",
    "terms": [
      "accept",
      "agree",
      "confirm",
      "coupon",
      "done",
      "enable",
      "ok",
      "select",
      "success",
      "tick",
      "todo",
      "validate",
      "working",
      "yes"
    ]
  },
  {
    "name": "clipboard-list",
    "label": "Clipboard List",
    "unicode": "f46d",
    "terms": [
      "cheatsheet",
      "checklist",
      "completed",
      "done",
      "finished",
      "intinerary",
      "ol",
      "schedule",
      "summary",
      "survey",
      "tick",
      "todo",
      "ul",
      "wishlist"
    ]
  },
  {
    "name": "clipboard-question",
    "label": "Clipboard Question",
    "unicode": "e4e3",
    "terms": [
      "assistance",
      "faq",
      "interview",
      "query",
      "question"
    ]
  },
  {
    "name": "clipboard-user",
    "label": "Clipboard User",
    "unicode": "f7f3",
    "terms": [
      "attendance",
      "employee",
      "record",
      "roster",
      "staff",
      "uer"
    ]
  },
  {
    "name": "clock",
    "label": "Clock",
    "unicode": "f017",
    "terms": [
      "00",
      "4",
      "4:00",
      "clock",
      "date",
      "four",
      "four o’clock",
      "hour",
      "late",
      "minute",
      "o'clock",
      "o’clock",
      "pending",
      "schedule",
      "ticking",
      "time",
      "timer",
      "timestamp",
      "watch"
    ]
  },
  {
    "name": "clock-rotate-left",
    "label": "Clock Rotate Left",
    "unicode": "f1da",
    "terms": [
      "Rewind",
      "clock",
      "pending",
      "reverse",
      "time",
      "time machine",
      "time travel",
      "waiting"
    ]
  },
  {
    "name": "clone",
    "label": "Clone",
    "unicode": "f24d",
    "terms": [
      "arrange",
      "copy",
      "duplicate",
      "paste"
    ]
  },
  {
    "name": "closed-captioning",
    "label": "Closed Captioning",
    "unicode": "f20a",
    "terms": [
      "cc",
      "deaf",
      "hearing",
      "subtitle",
      "subtitling",
      "text",
      "video"
    ]
  },
  {
    "name": "cloud",
    "label": "Cloud",
    "unicode": "f0c2",
    "terms": [
      "atmosphere",
      "cloud",
      "fog",
      "overcast",
      "save",
      "upload",
      "weather"
    ]
  },
  {
    "name": "cloud-arrow-down",
    "label": "Cloud Arrow Down",
    "unicode": "f0ed",
    "terms": [
      "download",
      "export",
      "save"
    ]
  },
  {
    "name": "cloud-arrow-up",
    "label": "Cloud Arrow Up",
    "unicode": "f0ee",
    "terms": [
      "import",
      "save",
      "upgrade",
      "upload"
    ]
  },
  {
    "name": "cloud-bolt",
    "label": "Cloud Bolt",
    "unicode": "f76c",
    "terms": [
      "bolt",
      "cloud",
      "cloud with lightning",
      "lightning",
      "precipitation",
      "rain",
      "storm",
      "weather"
    ]
  },
  {
    "name": "cloud-meatball",
    "label": "Cloud Meatball",
    "unicode": "f73b",
    "terms": [
      "FLDSMDFR",
      "food",
      "spaghetti",
      "storm"
    ]
  },
  {
    "name": "cloud-moon",
    "label": "Cloud Moon",
    "unicode": "f6c3",
    "terms": [
      "crescent",
      "evening",
      "lunar",
      "night",
      "partly cloudy",
      "sky"
    ]
  },
  {
    "name": "cloud-moon-rain",
    "label": "Cloud Moon Rain",
    "unicode": "f73c",
    "terms": [
      "crescent",
      "evening",
      "lunar",
      "night",
      "partly cloudy",
      "precipitation",
      "rain",
      "sky",
      "storm"
    ]
  },
  {
    "name": "cloud-rain",
    "label": "Cloud Rain",
    "unicode": "f73d",
    "terms": [
      "Rain",
      "cloud",
      "cloud with rain",
      "precipitation",
      "rain",
      "sky",
      "storm"
    ]
  },
  {
    "name": "cloud-showers-heavy",
    "label": "Cloud Showers Heavy",
    "unicode": "f740",
    "terms": [
      "precipitation",
      "rain",
      "sky",
      "storm"
    ]
  },
  {
    "name": "cloud-showers-water",
    "label": "Cloud Showers Water",
    "unicode": "e4e4",
    "terms": [
      "cloud",
      "deluge",
      "flood",
      "rain",
      "storm",
      "surge"
    ]
  },
  {
    "name": "cloud-sun",
    "label": "Cloud Sun",
    "unicode": "f6c4",
    "terms": [
      "clear",
      "cloud",
      "day",
      "daytime",
      "fall",
      "outdoors",
      "overcast",
      "partly cloudy",
      "sun",
      "sun behind cloud"
    ]
  },
  {
    "name": "cloud-sun-rain",
    "label": "Cloud Sun Rain",
    "unicode": "f743",
    "terms": [
      "cloud",
      "day",
      "overcast",
      "precipitation",
      "rain",
      "storm",
      "summer",
      "sun",
      "sun behind rain cloud",
      "sunshower"
    ]
  },
  {
    "name": "clover",
    "label": "Clover",
    "unicode": "e139",
    "terms": [
      "4",
      "charm",
      "clover",
      "four",
      "four leaf clover",
      "four-leaf clover",
      "leaf",
      "leprechaun",
      "luck",
      "lucky"
    ]
  },
  {
    "name": "code",
    "label": "Code",
    "unicode": "f121",
    "terms": [
      "brackets",
      "code",
      "development",
      "html",
      "mysql",
      "sql"
    ]
  },
  {
    "name": "code-branch",
    "label": "Code Branch",
    "unicode": "f126",
    "terms": [
      "branch",
      "git",
      "github",
      "mysql",
      "rebase",
      "sql",
      "svn",
      "vcs",
      "version"
    ]
  },
  {
    "name": "code-commit",
    "label": "Code Commit",
    "unicode": "f386",
    "terms": [
      "commit",
      "git",
      "github",
      "hash",
      "rebase",
      "svn",
      "vcs",
      "version"
    ]
  },
  {
    "name": "code-compare",
    "label": "Code Compare",
    "unicode": "e13a",
    "terms": [
      "compare",
      "git",
      "github",
      "svn",
      "version"
    ]
  },
  {
    "name": "code-fork",
    "label": "Code Fork",
    "unicode": "e13b",
    "terms": [
      "fork",
      "git",
      "github",
      "svn",
      "version"
    ]
  },
  {
    "name": "code-merge",
    "label": "Code Merge",
    "unicode": "f387",
    "terms": [
      "git",
      "github",
      "merge",
      "pr",
      "rebase",
      "svn",
      "vcs",
      "version"
    ]
  },
  {
    "name": "code-pull-request",
    "label": "Code Pull Request",
    "unicode": "e13c",
    "terms": [
      "git",
      "github",
      "pr",
      "svn",
      "version"
    ]
  },
  {
    "name": "coins",
    "label": "Coins",
    "unicode": "f51e",
    "terms": [
      "currency",
      "dime",
      "financial",
      "gold",
      "money",
      "penny",
      "premium"
    ]
  },
  {
    "name": "colon-sign",
    "label": "Colon Sign",
    "unicode": "e140",
    "terms": [
      "Colon Sign",
      "currency"
    ]
  },
  {
    "name": "comment",
    "label": "Comment",
    "unicode": "f075",
    "terms": [
      "Right Speech Bubble",
      "answer",
      "bubble",
      "chat",
      "commenting",
      "conversation",
      "conversation",
      "discussion",
      "feedback",
      "message",
      "note",
      "notification",
      "sms",
      "speech",
      "talk",
      "talking",
      "texting"
    ]
  },
  {
    "name": "comment-dollar",
    "label": "Comment Dollar",
    "unicode": "f651",
    "terms": [
      "answer",
      "bubble",
      "chat",
      "commenting",
      "conversation",
      "feedback",
      "message",
      "money",
      "note",
      "notification",
      "pay",
      "salary",
      "sms",
      "speech",
      "spend",
      "texting",
      "transfer"
    ]
  },
  {
    "name": "comment-dots",
    "label": "Comment Dots",
    "unicode": "f4ad",
    "terms": [
      "answer",
      "balloon",
      "bubble",
      "chat",
      "comic",
      "commenting",
      "conversation",
      "dialog",
      "feedback",
      "message",
      "more",
      "note",
      "notification",
      "reply",
      "request",
      "sms",
      "speech",
      "speech balloon",
      "texting"
    ]
  },
  {
    "name": "comment-medical",
    "label": "Comment Medical",
    "unicode": "f7f5",
    "terms": [
      "advice",
      "answer",
      "bubble",
      "chat",
      "commenting",
      "conversation",
      "diagnose",
      "feedback",
      "message",
      "note",
      "notification",
      "prescription",
      "sms",
      "speech",
      "texting"
    ]
  },
  {
    "name": "comment-nodes",
    "label": "Comment Nodes",
    "unicode": "e696",
    "terms": [
      "ai",
      "artificial intelligence",
      "cluster",
      "language",
      "model",
      "network",
      "neuronal"
    ]
  },
  {
    "name": "comment-slash",
    "label": "Comment Slash",
    "unicode": "f4b3",
    "terms": [
      "answer",
      "bubble",
      "cancel",
      "chat",
      "commenting",
      "conversation",
      "disabled",
      "feedback",
      "message",
      "mute",
      "note",
      "notification",
      "quiet",
      "sms",
      "speech",
      "texting"
    ]
  },
  {
    "name": "comment-sms",
    "label": "Comment Sms",
    "unicode": "f7cd",
    "terms": [
      "answer",
      "chat",
      "conversation",
      "message",
      "mobile",
      "notification",
      "phone",
      "sms",
      "texting"
    ]
  },
  {
    "name": "comments",
    "label": "Comments",
    "unicode": "f086",
    "terms": [
      "Two Speech Bubbles",
      "answer",
      "bubble",
      "chat",
      "commenting",
      "conversation",
      "conversation",
      "discussion",
      "feedback",
      "message",
      "note",
      "notification",
      "sms",
      "speech",
      "talk",
      "talking",
      "texting"
    ]
  },
  {
    "name": "comments-dollar",
    "label": "Comments Dollar",
    "unicode": "f653",
    "terms": [
      "answer",
      "bubble",
      "chat",
      "commenting",
      "conversation",
      "feedback",
      "message",
      "money",
      "note",
      "notification",
      "pay",
      "salary",
      "sms",
      "speech",
      "spend",
      "texting",
      "transfer"
    ]
  },
  {
    "name": "compact-disc",
    "label": "Compact Disc",
    "unicode": "f51f",
    "terms": [
      "Optical Disc Icon",
      "album",
      "blu-ray",
      "bluray",
      "cd",
      "computer",
      "disc",
      "disk",
      "dvd",
      "media",
      "movie",
      "music",
      "optical",
      "optical disk",
      "record",
      "video",
      "vinyl"
    ]
  },
  {
    "name": "compass",
    "label": "Compass",
    "unicode": "f14e",
    "terms": [
      "compass",
      "directions",
      "directory",
      "location",
      "magnetic",
      "menu",
      "navigation",
      "orienteering",
      "safari",
      "travel"
    ]
  },
  {
    "name": "compass-drafting",
    "label": "Compass Drafting",
    "unicode": "f568",
    "terms": [
      "design",
      "map",
      "mechanical drawing",
      "plot",
      "plotting"
    ]
  },
  {
    "name": "compress",
    "label": "Compress",
    "unicode": "f066",
    "terms": [
      "collapse",
      "fullscreen",
      "minimize",
      "move",
      "resize",
      "shrink",
      "smaller"
    ]
  },
  {
    "name": "computer",
    "label": "Computer",
    "unicode": "e4e5",
    "terms": [
      "computer",
      "desktop",
      "display",
      "monitor",
      "tower"
    ]
  },
  {
    "name": "computer-mouse",
    "label": "Computer Mouse",
    "unicode": "f8cc",
    "terms": [
      "click",
      "computer",
      "computer mouse",
      "cursor",
      "input",
      "peripheral"
    ]
  },
  {
    "name": "cookie",
    "label": "Cookie",
    "unicode": "f563",
    "terms": [
      "baked good",
      "chips",
      "chocolate",
      "cookie",
      "dessert",
      "eat",
      "snack",
      "sweet",
      "treat"
    ]
  },
  {
    "name": "cookie-bite",
    "label": "Cookie Bite",
    "unicode": "f564",
    "terms": [
      "baked good",
      "bitten",
      "chips",
      "chocolate",
      "eat",
      "snack",
      "sweet",
      "treat"
    ]
  },
  {
    "name": "copy",
    "label": "Copy",
    "unicode": "f0c5",
    "terms": [
      "clone",
      "duplicate",
      "file",
      "files-o",
      "paper",
      "paste"
    ]
  },
  {
    "name": "copyright",
    "label": "Copyright",
    "unicode": "f1f9",
    "terms": [
      "brand",
      "c",
      "copyright",
      "mark",
      "register",
      "trademark"
    ]
  },
  {
    "name": "couch",
    "label": "Couch",
    "unicode": "f4b8",
    "terms": [
      "chair",
      "cushion",
      "furniture",
      "relax",
      "sofa"
    ]
  },
  {
    "name": "cow",
    "label": "Cow",
    "unicode": "f6c8",
    "terms": [
      "agriculture",
      "animal",
      "beef",
      "bovine",
      "co",
      "cow",
      "farm",
      "fauna",
      "livestock",
      "mammal",
      "milk",
      "moo"
    ]
  },
  {
    "name": "credit-card",
    "label": "Credit Card",
    "unicode": "f09d",
    "terms": [
      "buy",
      "card",
      "checkout",
      "credit",
      "credit card",
      "credit-card-alt",
      "debit",
      "money",
      "payment",
      "purchase"
    ]
  },
  {
    "name": "crop",
    "label": "Crop",
    "unicode": "f125",
    "terms": [
      "design",
      "frame",
      "mask",
      "modify",
      "resize",
      "shrink"
    ]
  },
  {
    "name": "crop-simple",
    "label": "Crop Simple",
    "unicode": "f565",
    "terms": [
      "design",
      "frame",
      "mask",
      "modify",
      "resize",
      "shrink"
    ]
  },
  {
    "name": "cross",
    "label": "Cross",
    "unicode": "f654",
    "terms": [
      "Christian",
      "Heavy Latin Cross",
      "catholicism",
      "christianity",
      "church",
      "cross",
      "jesus",
      "latin cross",
      "religion"
    ]
  },
  {
    "name": "crosshairs",
    "label": "Crosshairs",
    "unicode": "f05b",
    "terms": [
      "aim",
      "bullseye",
      "gpd",
      "picker",
      "position"
    ]
  },
  {
    "name": "crow",
    "label": "Crow",
    "unicode": "f520",
    "terms": [
      "bird",
      "bullfrog",
      "fauna",
      "halloween",
      "holiday",
      "toad"
    ]
  },
  {
    "name": "crown",
    "label": "Crown",
    "unicode": "f521",
    "terms": [
      "award",
      "clothing",
      "crown",
      "favorite",
      "king",
      "queen",
      "royal",
      "tiara",
      "vip"
    ]
  },
  {
    "name": "crutch",
    "label": "Crutch",
    "unicode": "f7f7",
    "terms": [
      "cane",
      "injury",
      "mobility",
      "wheelchair"
    ]
  },
  {
    "name": "cruzeiro-sign",
    "label": "Cruzeiro Sign",
    "unicode": "e152",
    "terms": [
      "Cruzeiro Sign",
      "currency"
    ]
  },
  {
    "name": "cube",
    "label": "Cube",
    "unicode": "f1b2",
    "terms": [
      "3d",
      "block",
      "dice",
      "package",
      "square",
      "tesseract"
    ]
  },
  {
    "name": "cubes",
    "label": "Cubes",
    "unicode": "f1b3",
    "terms": [
      "3d",
      "block",
      "dice",
      "package",
      "pyramid",
      "square",
      "stack",
      "tesseract"
    ]
  },
  {
    "name": "cubes-stacked",
    "label": "Cubes Stacked",
    "unicode": "e4e6",
    "terms": [
      "blocks",
      "cubes",
      "sugar"
    ]
  },
  {
    "name": "d",
    "label": "D",
    "unicode": "44",
    "terms": [
      "Latin Capital Letter D",
      "Latin Small Letter D",
      "letter"
    ]
  },
  {
    "name": "database",
    "label": "Database",
    "unicode": "f1c0",
    "terms": [
      "computer",
      "development",
      "directory",
      "memory",
      "mysql",
      "sql",
      "storage"
    ]
  },
  {
    "name": "delete-left",
    "label": "Delete Left",
    "unicode": "f55a",
    "terms": [
      "Erase to the Left",
      "command",
      "delete",
      "erase",
      "keyboard",
      "undo"
    ]
  },
  {
    "name": "democrat",
    "label": "Democrat",
    "unicode": "f747",
    "terms": [
      "american",
      "democratic party",
      "donkey",
      "election",
      "left",
      "left-wing",
      "liberal",
      "politics",
      "usa"
    ]
  },
  {
    "name": "desktop",
    "label": "Desktop",
    "unicode": "f390",
    "terms": [
      "computer",
      "cpu",
      "demo",
      "desktop",
      "desktop computer",
      "device",
      "imac",
      "machine",
      "monitor",
      "pc",
      "screen"
    ]
  },
  {
    "name": "dharmachakra",
    "label": "Dharmachakra",
    "unicode": "f655",
    "terms": [
      "Buddhist",
      "buddhism",
      "buddhist",
      "dharma",
      "religion",
      "wheel",
      "wheel of dharma"
    ]
  },
  {
    "name": "diagram-next",
    "label": "Diagram Next",
    "unicode": "e476",
    "terms": [
      "cells",
      "chart",
      "gantt",
      "row",
      "subtask",
      "successor",
      "table"
    ]
  },
  {
    "name": "diagram-predecessor",
    "label": "Diagram Predecessor",
    "unicode": "e477",
    "terms": [
      "cells",
      "chart",
      "gantt",
      "predecessor",
      "previous",
      "row",
      "subtask",
      "table"
    ]
  },
  {
    "name": "diagram-project",
    "label": "Diagram Project",
    "unicode": "f542",
    "terms": [
      "chart",
      "graph",
      "network",
      "pert",
      "statistics"
    ]
  },
  {
    "name": "diagram-successor",
    "label": "Diagram Successor",
    "unicode": "e47a",
    "terms": [
      "cells",
      "chart",
      "gantt",
      "next",
      "row",
      "subtask",
      "successor",
      "table"
    ]
  },
  {
    "name": "diamond",
    "label": "Diamond",
    "unicode": "f219",
    "terms": [
      "ace",
      "card",
      "cards",
      "diamond suit",
      "game",
      "gem",
      "gemstone",
      "poker",
      "suit"
    ]
  },
  {
    "name": "diamond-turn-right",
    "label": "Diamond Turn Right",
    "unicode": "f5eb",
    "terms": [
      "map",
      "navigation",
      "sign",
      "turn"
    ]
  },
  {
    "name": "dice",
    "label": "Dice",
    "unicode": "f522",
    "terms": [
      "chance",
      "dice",
      "die",
      "gambling",
      "game",
      "game die",
      "roll"
    ]
  },
  {
    "name": "dice-d20",
    "label": "Dice D20",
    "unicode": "f6cf",
    "terms": [
      "Dungeons & Dragons",
      "chance",
      "d&d",
      "dnd",
      "fantasy",
      "gambling",
      "game",
      "roll"
    ]
  },
  {
    "name": "dice-d6",
    "label": "Dice D6",
    "unicode": "f6d1",
    "terms": [
      "Dungeons & Dragons",
      "chance",
      "d&d",
      "dnd",
      "fantasy",
      "gambling",
      "game",
      "roll"
    ]
  },
  {
    "name": "dice-five",
    "label": "Dice Five",
    "unicode": "f523",
    "terms": [
      "Die Face-5",
      "chance",
      "gambling",
      "game",
      "roll"
    ]
  },
  {
    "name": "dice-four",
    "label": "Dice Four",
    "unicode": "f524",
    "terms": [
      "Die Face-4",
      "chance",
      "gambling",
      "game",
      "roll"
    ]
  },
  {
    "name": "dice-one",
    "label": "Dice One",
    "unicode": "f525",
    "terms": [
      "Die Face-1",
      "chance",
      "gambling",
      "game",
      "roll"
    ]
  },
  {
    "name": "dice-six",
    "label": "Dice Six",
    "unicode": "f526",
    "terms": [
      "Die Face-6",
      "chance",
      "gambling",
      "game",
      "roll"
    ]
  },
  {
    "name": "dice-three",
    "label": "Dice Three",
    "unicode": "f527",
    "terms": [
      "Die Face-3",
      "chance",
      "gambling",
      "game",
      "roll"
    ]
  },
  {
    "name": "dice-two",
    "label": "Dice Two",
    "unicode": "f528",
    "terms": [
      "Die Face-2",
      "chance",
      "gambling",
      "game",
      "roll"
    ]
  },
  {
    "name": "disease",
    "label": "Disease",
    "unicode": "f7fa",
    "terms": [
      "bacteria",
      "cancer",
      "coronavirus",
      "covid-19",
      "flu",
      "illness",
      "infection",
      "pandemic",
      "sickness",
      "virus"
    ]
  },
  {
    "name": "display",
    "label": "Display",
    "unicode": "e163",
    "terms": [
      "Screen",
      "computer",
      "desktop",
      "imac"
    ]
  },
  {
    "name": "divide",
    "label": "Divide",
    "unicode": "f529",
    "terms": [
      "Division Sign",
      "arithmetic",
      "calculus",
      "divide",
      "division",
      "math",
      "sign",
      "÷"
    ]
  },
  {
    "name": "dna",
    "label": "Dna",
    "unicode": "f471",
    "terms": [
      "biologist",
      "dna",
      "double helix",
      "evolution",
      "gene",
      "genetic",
      "genetics",
      "helix",
      "life",
      "molecule",
      "protein"
    ]
  },
  {
    "name": "dog",
    "label": "Dog",
    "unicode": "f6d3",
    "terms": [
      "animal",
      "canine",
      "dog",
      "fauna",
      "mammal",
      "pet",
      "pooch",
      "puppy",
      "woof"
    ]
  },
  {
    "name": "dollar-sign",
    "label": "Dollar Sign",
    "unicode": "24",
    "terms": [
      "Dollar Sign",
      "coupon",
      "currency",
      "dollar",
      "heavy dollar sign",
      "investment",
      "money",
      "premium",
      "revenue",
      "salary"
    ]
  },
  {
    "name": "dolly",
    "label": "Dolly",
    "unicode": "f472",
    "terms": [
      "carry",
      "shipping",
      "transport"
    ]
  },
  {
    "name": "dong-sign",
    "label": "Dong Sign",
    "unicode": "e169",
    "terms": [
      "Dong Sign",
      "currency"
    ]
  },
  {
    "name": "door-closed",
    "label": "Door Closed",
    "unicode": "f52a",
    "terms": [
      "doo",
      "door",
      "enter",
      "exit",
      "locked",
      "privacy"
    ]
  },
  {
    "name": "door-open",
    "label": "Door Open",
    "unicode": "f52b",
    "terms": [
      "enter",
      "exit",
      "welcome"
    ]
  },
  {
    "name": "dove",
    "label": "Dove",
    "unicode": "f4ba",
    "terms": [
      "bird",
      "dove",
      "fauna",
      "fly",
      "flying",
      "peace",
      "war"
    ]
  },
  {
    "name": "down-left-and-up-right-to-center",
    "label": "Down Left And Up Right To Center",
    "unicode": "f422",
    "terms": [
      "collapse",
      "fullscreen",
      "minimize",
      "move",
      "resize",
      "scale",
      "shrink",
      "size",
      "smaller"
    ]
  },
  {
    "name": "down-long",
    "label": "Down Long",
    "unicode": "f309",
    "terms": [
      "download",
      "long-arrow-down"
    ]
  },
  {
    "name": "download",
    "label": "Download",
    "unicode": "f019",
    "terms": [
      "export",
      "hard drive",
      "insert",
      "save",
      "transfer"
    ]
  },
  {
    "name": "dragon",
    "label": "Dragon",
    "unicode": "f6d5",
    "terms": [
      "Dungeons & Dragons",
      "d&d",
      "dnd",
      "dragon",
      "fairy tale",
      "fantasy",
      "fire",
      "lizard",
      "serpent"
    ]
  },
  {
    "name": "draw-polygon",
    "label": "Draw Polygon",
    "unicode": "f5ee",
    "terms": [
      "anchors",
      "lines",
      "object",
      "render",
      "shape"
    ]
  },
  {
    "name": "droplet",
    "label": "Droplet",
    "unicode": "f043",
    "terms": [
      "blood",
      "cold",
      "color",
      "comic",
      "drop",
      "droplet",
      "raindrop",
      "sweat",
      "waterdrop"
    ]
  },
  {
    "name": "droplet-slash",
    "label": "Droplet Slash",
    "unicode": "f5c7",
    "terms": [
      "blood",
      "color",
      "disabled",
      "drop",
      "droplet",
      "raindrop",
      "waterdrop"
    ]
  },
  {
    "name": "drum",
    "label": "Drum",
    "unicode": "f569",
    "terms": [
      "drum",
      "drumsticks",
      "instrument",
      "music",
      "percussion",
      "snare",
      "sound"
    ]
  },
  {
    "name": "drum-steelpan",
    "label": "Drum Steelpan",
    "unicode": "f56a",
    "terms": [
      "calypso",
      "instrument",
      "music",
      "percussion",
      "reggae",
      "snare",
      "sound",
      "steel",
      "tropical"
    ]
  },
  {
    "name": "drumstick-bite",
    "label": "Drumstick Bite",
    "unicode": "f6d7",
    "terms": [
      "bone",
      "chicken",
      "leg",
      "meat",
      "poultry",
      "turkey"
    ]
  },
  {
    "name": "dumbbell",
    "label": "Dumbbell",
    "unicode": "f44b",
    "terms": [
      "exercise",
      "gym",
      "strength",
      "weight",
      "weight-lifting",
      "workout"
    ]
  },
  {
    "name": "dumpster",
    "label": "Dumpster",
    "unicode": "f793",
    "terms": [
      "alley",
      "bin",
      "commercial",
      "trash",
      "waste"
    ]
  },
  {
    "name": "dumpster-fire",
    "label": "Dumpster Fire",
    "unicode": "f794",
    "terms": [
      "alley",
      "bin",
      "commercial",
      "danger",
      "dangerous",
      "euphemism",
      "flame",
      "heat",
      "hot",
      "trash",
      "waste"
    ]
  },
  {
    "name": "dungeon",
    "label": "Dungeon",
    "unicode": "f6d9",
    "terms": [
      "Dungeons & Dragons",
      "building",
      "d&d",
      "dnd",
      "door",
      "entrance",
      "fantasy",
      "gate"
    ]
  },
  {
    "name": "e",
    "label": "E",
    "unicode": "45",
    "terms": [
      "Latin Capital Letter E",
      "Latin Small Letter E",
      "letter"
    ]
  },
  {
    "name": "ear-deaf",
    "label": "Ear Deaf",
    "unicode": "f2a4",
    "terms": [
      "ear",
      "hearing",
      "sign language"
    ]
  },
  {
    "name": "ear-listen",
    "label": "Ear Listen",
    "unicode": "f2a2",
    "terms": [
      "amplify",
      "audio",
      "deaf",
      "ear",
      "headset",
      "hearing",
      "sound"
    ]
  },
  {
    "name": "earth-africa",
    "label": "Earth Africa",
    "unicode": "f57c",
    "terms": [
      "africa",
      "all",
      "country",
      "earth",
      "europe",
      "global",
      "globe",
      "gps",
      "language",
      "localize",
      "location",
      "map",
      "online",
      "place",
      "planet",
      "translate",
      "travel",
      "world"
    ]
  },
  {
    "name": "earth-americas",
    "label": "Earth Americas",
    "unicode": "f57d",
    "terms": [
      "all",
      "america",
      "country",
      "earth",
      "global",
      "globe",
      "gps",
      "language",
      "localize",
      "location",
      "map",
      "online",
      "place",
      "planet",
      "translate",
      "travel",
      "world"
    ]
  },
  {
    "name": "earth-asia",
    "label": "Earth Asia",
    "unicode": "f57e",
    "terms": [
      "all",
      "asia",
      "australia",
      "country",
      "earth",
      "global",
      "globe",
      "gps",
      "language",
      "localize",
      "location",
      "map",
      "online",
      "place",
      "planet",
      "translate",
      "travel",
      "world"
    ]
  },
  {
    "name": "earth-europe",
    "label": "Earth Europe",
    "unicode": "f7a2",
    "terms": [
      "all",
      "country",
      "earth",
      "europe",
      "global",
      "globe",
      "gps",
      "language",
      "localize",
      "location",
      "map",
      "online",
      "place",
      "planet",
      "translate",
      "travel",
      "world"
    ]
  },
  {
    "name": "earth-oceania",
    "label": "Earth Oceania",
    "unicode": "e47b",
    "terms": [
      "all",
      "australia",
      "country",
      "earth",
      "global",
      "globe",
      "gps",
      "language",
      "localize",
      "location",
      "map",
      "melanesia",
      "micronesia",
      "new zealand",
      "online",
      "place",
      "planet",
      "polynesia",
      "translate",
      "travel",
      "world"
    ]
  },
  {
    "name": "egg",
    "label": "Egg",
    "unicode": "f7fb",
    "terms": [
      "breakfast",
      "chicken",
      "easter",
      "egg",
      "food",
      "shell",
      "yolk"
    ]
  },
  {
    "name": "eject",
    "label": "Eject",
    "unicode": "f052",
    "terms": [
      "abort",
      "cancel",
      "cd",
      "discharge",
      "eject",
      "eject button"
    ]
  },
  {
    "name": "elevator",
    "label": "Elevator",
    "unicode": "e16d",
    "terms": [
      "accessibility",
      "elevator",
      "hoist",
      "lift",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "ellipsis",
    "label": "Ellipsis",
    "unicode": "f141",
    "terms": [
      "dots",
      "drag",
      "kebab",
      "list",
      "menu",
      "nav",
      "navigation",
      "ol",
      "pacman",
      "reorder",
      "settings",
      "three dots",
      "ul"
    ]
  },
  {
    "name": "ellipsis-vertical",
    "label": "Ellipsis Vertical",
    "unicode": "f142",
    "terms": [
      "bullet",
      "dots",
      "drag",
      "kebab",
      "list",
      "menu",
      "nav",
      "navigation",
      "ol",
      "reorder",
      "settings",
      "three dots",
      "ul"
    ]
  },
  {
    "name": "envelope",
    "label": "Envelope",
    "unicode": "f0e0",
    "terms": [
      "Back of Envelope",
      "e-mail",
      "email",
      "envelope",
      "letter",
      "mail",
      "message",
      "newsletter",
      "notification",
      "offer",
      "support"
    ]
  },
  {
    "name": "envelope-circle-check",
    "label": "Envelope Circle Check",
    "unicode": "e4e8",
    "terms": [
      "check",
      "email",
      "enable",
      "envelope",
      "mail",
      "not affected",
      "ok",
      "okay",
      "read",
      "sent",
      "validate",
      "working"
    ]
  },
  {
    "name": "envelope-open",
    "label": "Envelope Open",
    "unicode": "f2b6",
    "terms": [
      "e-mail",
      "email",
      "letter",
      "mail",
      "message",
      "newsletter",
      "notification",
      "offer",
      "support"
    ]
  },
  {
    "name": "envelope-open-text",
    "label": "Envelope Open Text",
    "unicode": "f658",
    "terms": [
      "e-mail",
      "email",
      "letter",
      "mail",
      "message",
      "newsletter",
      "notification",
      "offer",
      "support"
    ]
  },
  {
    "name": "envelopes-bulk",
    "label": "Envelopes Bulk",
    "unicode": "f674",
    "terms": [
      "archive",
      "envelope",
      "letter",
      "newsletter",
      "offer",
      "post office",
      "postal",
      "postcard",
      "send",
      "stamp",
      "usps"
    ]
  },
  {
    "name": "equals",
    "label": "Equals",
    "unicode": "3d",
    "terms": [
      "Equals Sign",
      "arithmetic",
      "even",
      "match",
      "math"
    ]
  },
  {
    "name": "eraser",
    "label": "Eraser",
    "unicode": "f12d",
    "terms": [
      "art",
      "delete",
      "remove",
      "rubber"
    ]
  },
  {
    "name": "ethernet",
    "label": "Ethernet",
    "unicode": "f796",
    "terms": [
      "cable",
      "cat 5",
      "cat 6",
      "connection",
      "hardware",
      "internet",
      "network",
      "wired"
    ]
  },
  {
    "name": "euro-sign",
    "label": "Euro Sign",
    "unicode": "f153",
    "terms": [
      "Euro Sign",
      "currency"
    ]
  },
  {
    "name": "exclamation",
    "label": "Exclamation",
    "unicode": "21",
    "terms": [
      "!",
      "Exclamation Mark",
      "alert",
      "attention",
      "danger",
      "error",
      "exclamation",
      "failed",
      "important",
      "mark",
      "notice",
      "notification",
      "notify",
      "outlined",
      "problem",
      "punctuation",
      "red exclamation mark",
      "required",
      "warning",
      "white exclamation mark"
    ]
  },
  {
    "name": "expand",
    "label": "Expand",
    "unicode": "f065",
    "terms": [
      "arrows",
      "bigger",
      "enlarge",
      "expand",
      "fullscreen",
      "maximize",
      "resize",
      "resize",
      "scale",
      "size",
      "viewfinder"
    ]
  },
  {
    "name": "explosion",
    "label": "Explosion",
    "unicode": "e4e9",
    "terms": [
      "blast",
      "blowup",
      "boom",
      "crash",
      "detonation",
      "explosion"
    ]
  },
  {
    "name": "eye",
    "label": "Eye",
    "unicode": "f06e",
    "terms": [
      "body",
      "eye",
      "look",
      "optic",
      "see",
      "seen",
      "show",
      "sight",
      "views",
      "visible"
    ]
  },
  {
    "name": "eye-dropper",
    "label": "Eye Dropper",
    "unicode": "f1fb",
    "terms": [
      "beaker",
      "clone",
      "color",
      "copy",
      "eyedropper",
      "pipette"
    ]
  },
  {
    "name": "eye-low-vision",
    "label": "Eye Low Vision",
    "unicode": "f2a8",
    "terms": [
      "blind",
      "eye",
      "sight"
    ]
  },
  {
    "name": "eye-slash",
    "label": "Eye Slash",
    "unicode": "f070",
    "terms": [
      "blind",
      "disabled",
      "hide",
      "show",
      "toggle",
      "unseen",
      "views",
      "visible",
      "visiblity"
    ]
  },
  {
    "name": "f",
    "label": "F",
    "unicode": "46",
    "terms": [
      "Latin Capital Letter F",
      "Latin Small Letter F",
      "letter"
    ]
  },
  {
    "name": "face-angry",
    "label": "Face Angry",
    "unicode": "f556",
    "terms": [
      "angry",
      "angry face",
      "disapprove",
      "emoticon",
      "face",
      "mad",
      "upset"
    ]
  },
  {
    "name": "face-dizzy",
    "label": "Face Dizzy",
    "unicode": "f567",
    "terms": [
      "dazed",
      "dead",
      "disapprove",
      "emoticon",
      "face"
    ]
  },
  {
    "name": "face-flushed",
    "label": "Face Flushed",
    "unicode": "f579",
    "terms": [
      "dazed",
      "embarrassed",
      "emoticon",
      "face",
      "flushed",
      "flushed face"
    ]
  },
  {
    "name": "face-frown",
    "label": "Face Frown",
    "unicode": "f119",
    "terms": [
      "disapprove",
      "emoticon",
      "face",
      "frown",
      "frowning face",
      "rating",
      "sad",
      "uer"
    ]
  },
  {
    "name": "face-frown-open",
    "label": "Face Frown Open",
    "unicode": "f57a",
    "terms": [
      "disapprove",
      "emoticon",
      "face",
      "frown",
      "frowning face with open mouth",
      "mouth",
      "open",
      "rating",
      "sad"
    ]
  },
  {
    "name": "face-grimace",
    "label": "Face Grimace",
    "unicode": "f57f",
    "terms": [
      "cringe",
      "emoticon",
      "face",
      "grimace",
      "grimacing face",
      "teeth"
    ]
  },
  {
    "name": "face-grin",
    "label": "Face Grin",
    "unicode": "f580",
    "terms": [
      "emoticon",
      "face",
      "grin",
      "grinning face",
      "laugh",
      "smile"
    ]
  },
  {
    "name": "face-grin-beam",
    "label": "Face Grin Beam",
    "unicode": "f582",
    "terms": [
      "emoticon",
      "eye",
      "face",
      "grinning face with smiling eyes",
      "laugh",
      "mouth",
      "open",
      "smile"
    ]
  },
  {
    "name": "face-grin-beam-sweat",
    "label": "Face Grin Beam Sweat",
    "unicode": "f583",
    "terms": [
      "cold",
      "embarass",
      "emoticon",
      "face",
      "grinning face with sweat",
      "open",
      "smile",
      "sweat"
    ]
  },
  {
    "name": "face-grin-hearts",
    "label": "Face Grin Hearts",
    "unicode": "f584",
    "terms": [
      "emoticon",
      "eye",
      "face",
      "love",
      "smile",
      "smiling face with heart-eyes"
    ]
  },
  {
    "name": "face-grin-squint",
    "label": "Face Grin Squint",
    "unicode": "f585",
    "terms": [
      "emoticon",
      "face",
      "grinning squinting face",
      "laugh",
      "mouth",
      "satisfied",
      "smile"
    ]
  },
  {
    "name": "face-grin-squint-tears",
    "label": "Face Grin Squint Tears",
    "unicode": "f586",
    "terms": [
      "emoticon",
      "face",
      "floor",
      "happy",
      "laugh",
      "rolling",
      "rolling on the floor laughing",
      "smile"
    ]
  },
  {
    "name": "face-grin-stars",
    "label": "Face Grin Stars",
    "unicode": "f587",
    "terms": [
      "emoticon",
      "eyes",
      "face",
      "grinning",
      "quality",
      "star",
      "star-struck",
      "starry-eyed",
      "vip"
    ]
  },
  {
    "name": "face-grin-tears",
    "label": "Face Grin Tears",
    "unicode": "f588",
    "terms": [
      "LOL",
      "emoticon",
      "face",
      "face with tears of joy",
      "joy",
      "laugh",
      "tear"
    ]
  },
  {
    "name": "face-grin-tongue",
    "label": "Face Grin Tongue",
    "unicode": "f589",
    "terms": [
      "LOL",
      "emoticon",
      "face",
      "face with tongue",
      "tongue"
    ]
  },
  {
    "name": "face-grin-tongue-squint",
    "label": "Face Grin Tongue Squint",
    "unicode": "f58a",
    "terms": [
      "LOL",
      "emoticon",
      "eye",
      "face",
      "horrible",
      "squinting face with tongue",
      "taste",
      "tongue"
    ]
  },
  {
    "name": "face-grin-tongue-wink",
    "label": "Face Grin Tongue Wink",
    "unicode": "f58b",
    "terms": [
      "LOL",
      "emoticon",
      "eye",
      "face",
      "joke",
      "tongue",
      "wink",
      "winking face with tongue"
    ]
  },
  {
    "name": "face-grin-wide",
    "label": "Face Grin Wide",
    "unicode": "f581",
    "terms": [
      "emoticon",
      "face",
      "grinning face with big eyes",
      "laugh",
      "mouth",
      "open",
      "smile"
    ]
  },
  {
    "name": "face-grin-wink",
    "label": "Face Grin Wink",
    "unicode": "f58c",
    "terms": [
      "emoticon",
      "face",
      "flirt",
      "laugh",
      "smile"
    ]
  },
  {
    "name": "face-kiss",
    "label": "Face Kiss",
    "unicode": "f596",
    "terms": [
      "beso",
      "emoticon",
      "face",
      "kiss",
      "kissing face",
      "love",
      "smooch"
    ]
  },
  {
    "name": "face-kiss-beam",
    "label": "Face Kiss Beam",
    "unicode": "f597",
    "terms": [
      "beso",
      "emoticon",
      "eye",
      "face",
      "kiss",
      "kissing face with smiling eyes",
      "love",
      "smile",
      "smooch"
    ]
  },
  {
    "name": "face-kiss-wink-heart",
    "label": "Face Kiss Wink Heart",
    "unicode": "f598",
    "terms": [
      "beso",
      "emoticon",
      "face",
      "face blowing a kiss",
      "kiss",
      "love",
      "smooch"
    ]
  },
  {
    "name": "face-laugh",
    "label": "Face Laugh",
    "unicode": "f599",
    "terms": [
      "LOL",
      "emoticon",
      "face",
      "laugh",
      "smile"
    ]
  },
  {
    "name": "face-laugh-beam",
    "label": "Face Laugh Beam",
    "unicode": "f59a",
    "terms": [
      "LOL",
      "beaming face with smiling eyes",
      "emoticon",
      "eye",
      "face",
      "grin",
      "happy",
      "smile"
    ]
  },
  {
    "name": "face-laugh-squint",
    "label": "Face Laugh Squint",
    "unicode": "f59b",
    "terms": [
      "LOL",
      "emoticon",
      "face",
      "happy",
      "smile"
    ]
  },
  {
    "name": "face-laugh-wink",
    "label": "Face Laugh Wink",
    "unicode": "f59c",
    "terms": [
      "LOL",
      "emoticon",
      "face",
      "happy",
      "smile"
    ]
  },
  {
    "name": "face-meh",
    "label": "Face Meh",
    "unicode": "f11a",
    "terms": [
      "deadpan",
      "default",
      "emoticon",
      "face",
      "meh",
      "neutral",
      "neutral face",
      "rating",
      "uer"
    ]
  },
  {
    "name": "face-meh-blank",
    "label": "Face Meh Blank",
    "unicode": "f5a4",
    "terms": [
      "emoticon",
      "face",
      "face without mouth",
      "mouth",
      "neutral",
      "quiet",
      "rating",
      "silent"
    ]
  },
  {
    "name": "face-rolling-eyes",
    "label": "Face Rolling Eyes",
    "unicode": "f5a5",
    "terms": [
      "emoticon",
      "eyeroll",
      "eyes",
      "face",
      "face with rolling eyes",
      "neutral",
      "rating",
      "rolling"
    ]
  },
  {
    "name": "face-sad-cry",
    "label": "Face Sad Cry",
    "unicode": "f5b3",
    "terms": [
      "cry",
      "emoticon",
      "face",
      "loudly crying face",
      "sad",
      "sob",
      "tear",
      "tears"
    ]
  },
  {
    "name": "face-sad-tear",
    "label": "Face Sad Tear",
    "unicode": "f5b4",
    "terms": [
      "cry",
      "crying face",
      "emoticon",
      "face",
      "sad",
      "tear",
      "tears"
    ]
  },
  {
    "name": "face-smile",
    "label": "Face Smile",
    "unicode": "f118",
    "terms": [
      "approve",
      "default",
      "emoticon",
      "face",
      "happy",
      "rating",
      "satisfied",
      "slightly smiling face",
      "smile",
      "uer"
    ]
  },
  {
    "name": "face-smile-beam",
    "label": "Face Smile Beam",
    "unicode": "f5b8",
    "terms": [
      "blush",
      "emoticon",
      "eye",
      "face",
      "happy",
      "positive",
      "smile",
      "smiling face with smiling eyes"
    ]
  },
  {
    "name": "face-smile-wink",
    "label": "Face Smile Wink",
    "unicode": "f4da",
    "terms": [
      "emoticon",
      "face",
      "happy",
      "hint",
      "joke",
      "wink",
      "winking face"
    ]
  },
  {
    "name": "face-surprise",
    "label": "Face Surprise",
    "unicode": "f5c2",
    "terms": [
      "emoticon",
      "face",
      "face with open mouth",
      "mouth",
      "open",
      "shocked",
      "sympathy"
    ]
  },
  {
    "name": "face-tired",
    "label": "Face Tired",
    "unicode": "f5c8",
    "terms": [
      "angry",
      "emoticon",
      "face",
      "grumpy",
      "tired",
      "tired face",
      "upset"
    ]
  },
  {
    "name": "fan",
    "label": "Fan",
    "unicode": "f863",
    "terms": [
      "ac",
      "air conditioning",
      "blade",
      "blower",
      "cool",
      "hot"
    ]
  },
  {
    "name": "faucet",
    "label": "Faucet",
    "unicode": "e005",
    "terms": [
      "covid-19",
      "drinking",
      "drip",
      "house",
      "hygiene",
      "kitchen",
      "potable",
      "potable water",
      "sanitation",
      "sink",
      "water"
    ]
  },
  {
    "name": "faucet-drip",
    "label": "Faucet Drip",
    "unicode": "e006",
    "terms": [
      "drinking",
      "drip",
      "house",
      "hygiene",
      "kitchen",
      "potable",
      "potable water",
      "sanitation",
      "sink",
      "water"
    ]
  },
  {
    "name": "fax",
    "label": "Fax",
    "unicode": "f1ac",
    "terms": [
      "Fax Icon",
      "business",
      "communicate",
      "copy",
      "facsimile",
      "fax",
      "fax machine",
      "send"
    ]
  },
  {
    "name": "feather",
    "label": "Feather",
    "unicode": "f52d",
    "terms": [
      "bird",
      "feather",
      "flight",
      "light",
      "plucked",
      "plumage",
      "quill",
      "write"
    ]
  },
  {
    "name": "feather-pointed",
    "label": "Feather Pointed",
    "unicode": "f56b",
    "terms": [
      "bird",
      "light",
      "plucked",
      "quill",
      "write"
    ]
  },
  {
    "name": "ferry",
    "label": "Ferry",
    "unicode": "e4ea",
    "terms": [
      "barge",
      "boat",
      "carry",
      "ferryboat",
      "ship"
    ]
  },
  {
    "name": "file",
    "label": "File",
    "unicode": "f15b",
    "terms": [
      "Empty Document",
      "cv",
      "document",
      "new",
      "page",
      "page facing up",
      "pdf",
      "resume"
    ]
  },
  {
    "name": "file-arrow-down",
    "label": "File Arrow Down",
    "unicode": "f56d",
    "terms": [
      "archive",
      "document",
      "export",
      "insert",
      "save"
    ]
  },
  {
    "name": "file-arrow-up",
    "label": "File Arrow Up",
    "unicode": "f574",
    "terms": [
      "document",
      "import",
      "page",
      "save",
      "upgrade"
    ]
  },
  {
    "name": "file-audio",
    "label": "File Audio",
    "unicode": "f1c7",
    "terms": [
      "document",
      "mp3",
      "music",
      "page",
      "play",
      "sound"
    ]
  },
  {
    "name": "file-circle-check",
    "label": "File Circle Check",
    "unicode": "e5a0",
    "terms": [
      "document",
      "enable",
      "file",
      "not affected",
      "ok",
      "okay",
      "paper",
      "validate",
      "working"
    ]
  },
  {
    "name": "file-circle-exclamation",
    "label": "File Circle Exclamation",
    "unicode": "e4eb",
    "terms": [
      "document",
      "failed",
      "file",
      "paper"
    ]
  },
  {
    "name": "file-circle-minus",
    "label": "File Circle Minus",
    "unicode": "e4ed",
    "terms": [
      "document",
      "file",
      "paper"
    ]
  },
  {
    "name": "file-circle-plus",
    "label": "File Circle Plus",
    "unicode": "e494",
    "terms": [
      "add",
      "document",
      "file",
      "new",
      "page",
      "paper",
      "pdf"
    ]
  },
  {
    "name": "file-circle-question",
    "label": "File Circle Question",
    "unicode": "e4ef",
    "terms": [
      "document",
      "file",
      "paper"
    ]
  },
  {
    "name": "file-circle-xmark",
    "label": "File Circle Xmark",
    "unicode": "e5a1",
    "terms": [
      "document",
      "file",
      "paper",
      "uncheck"
    ]
  },
  {
    "name": "file-code",
    "label": "File Code",
    "unicode": "f1c9",
    "terms": [
      "css",
      "development",
      "document",
      "html",
      "mysql",
      "sql"
    ]
  },
  {
    "name": "file-contract",
    "label": "File Contract",
    "unicode": "f56c",
    "terms": [
      "agreement",
      "binding",
      "document",
      "legal",
      "signature",
      "username"
    ]
  },
  {
    "name": "file-csv",
    "label": "File Csv",
    "unicode": "f6dd",
    "terms": [
      "document",
      "excel",
      "numbers",
      "spreadsheets",
      "table"
    ]
  },
  {
    "name": "file-excel",
    "label": "File Excel",
    "unicode": "f1c3",
    "terms": [
      "csv",
      "document",
      "numbers",
      "spreadsheets",
      "table"
    ]
  },
  {
    "name": "file-export",
    "label": "File Export",
    "unicode": "f56e",
    "terms": [
      "download",
      "save"
    ]
  },
  {
    "name": "file-fragment",
    "label": "File Fragment",
    "unicode": "e697",
    "terms": [
      "block",
      "data",
      "partial",
      "piece"
    ]
  },
  {
    "name": "file-half-dashed",
    "label": "File Half Dashed",
    "unicode": "e698",
    "terms": [
      "data",
      "fragment",
      "partial",
      "piece"
    ]
  },
  {
    "name": "file-image",
    "label": "File Image",
    "unicode": "f1c5",
    "terms": [
      "Document with Picture",
      "document",
      "image",
      "img",
      "jpg",
      "photo",
      "png"
    ]
  },
  {
    "name": "file-import",
    "label": "File Import",
    "unicode": "f56f",
    "terms": [
      "copy",
      "document",
      "insert",
      "send",
      "upload"
    ]
  },
  {
    "name": "file-invoice",
    "label": "File Invoice",
    "unicode": "f570",
    "terms": [
      "account",
      "bill",
      "charge",
      "document",
      "payment",
      "receipt"
    ]
  },
  {
    "name": "file-invoice-dollar",
    "label": "File Invoice Dollar",
    "unicode": "f571",
    "terms": [
      "$",
      "account",
      "bill",
      "charge",
      "document",
      "dollar-sign",
      "money",
      "payment",
      "receipt",
      "revenue",
      "salary",
      "usd"
    ]
  },
  {
    "name": "file-lines",
    "label": "File Lines",
    "unicode": "f15c",
    "terms": [
      "Document",
      "Document with Text",
      "document",
      "file-text",
      "invoice",
      "new",
      "page",
      "pdf"
    ]
  },
  {
    "name": "file-medical",
    "label": "File Medical",
    "unicode": "f477",
    "terms": [
      "document",
      "health",
      "history",
      "prescription",
      "record"
    ]
  },
  {
    "name": "file-pdf",
    "label": "File Pdf",
    "unicode": "f1c1",
    "terms": [
      "acrobat",
      "document",
      "preview",
      "save"
    ]
  },
  {
    "name": "file-pen",
    "label": "File Pen",
    "unicode": "f31c",
    "terms": [
      "edit",
      "memo",
      "modify",
      "pen",
      "pencil",
      "update",
      "write"
    ]
  },
  {
    "name": "file-powerpoint",
    "label": "File Powerpoint",
    "unicode": "f1c4",
    "terms": [
      "display",
      "document",
      "keynote",
      "presentation"
    ]
  },
  {
    "name": "file-prescription",
    "label": "File Prescription",
    "unicode": "f572",
    "terms": [
      "document",
      "drugs",
      "medical",
      "medicine",
      "rx"
    ]
  },
  {
    "name": "file-shield",
    "label": "File Shield",
    "unicode": "e4f0",
    "terms": [
      "antivirus",
      "data",
      "document",
      "protect",
      "safe",
      "safety",
      "secure"
    ]
  },
  {
    "name": "file-signature",
    "label": "File Signature",
    "unicode": "f573",
    "terms": [
      "John Hancock",
      "contract",
      "document",
      "name",
      "username"
    ]
  },
  {
    "name": "file-video",
    "label": "File Video",
    "unicode": "f1c8",
    "terms": [
      "document",
      "m4v",
      "movie",
      "mp4",
      "play"
    ]
  },
  {
    "name": "file-waveform",
    "label": "File Waveform",
    "unicode": "f478",
    "terms": [
      "document",
      "health",
      "history",
      "prescription",
      "record"
    ]
  },
  {
    "name": "file-word",
    "label": "File Word",
    "unicode": "f1c2",
    "terms": [
      "document",
      "edit",
      "page",
      "text",
      "writing"
    ]
  },
  {
    "name": "file-zipper",
    "label": "File Zipper",
    "unicode": "f1c6",
    "terms": [
      ".zip",
      "bundle",
      "compress",
      "compression",
      "download",
      "zip"
    ]
  },
  {
    "name": "fill",
    "label": "Fill",
    "unicode": "f575",
    "terms": [
      "bucket",
      "color",
      "paint",
      "paint bucket"
    ]
  },
  {
    "name": "fill-drip",
    "label": "Fill Drip",
    "unicode": "f576",
    "terms": [
      "bucket",
      "color",
      "drop",
      "paint",
      "paint bucket",
      "spill"
    ]
  },
  {
    "name": "film",
    "label": "Film",
    "unicode": "f008",
    "terms": [
      "cinema",
      "film",
      "film frames",
      "frames",
      "movie",
      "strip",
      "video"
    ]
  },
  {
    "name": "filter",
    "label": "Filter",
    "unicode": "f0b0",
    "terms": [
      "funnel",
      "options",
      "separate",
      "sort"
    ]
  },
  {
    "name": "filter-circle-dollar",
    "label": "Filter Circle Dollar",
    "unicode": "f662",
    "terms": [
      "filter",
      "money",
      "options",
      "premium",
      "separate",
      "sort"
    ]
  },
  {
    "name": "filter-circle-xmark",
    "label": "Filter Circle Xmark",
    "unicode": "e17b",
    "terms": [
      "cancel",
      "funnel",
      "options",
      "remove",
      "separate",
      "sort",
      "uncheck"
    ]
  },
  {
    "name": "fingerprint",
    "label": "Fingerprint",
    "unicode": "f577",
    "terms": [
      "human",
      "id",
      "identification",
      "lock",
      "privacy",
      "smudge",
      "touch",
      "unique",
      "unlock"
    ]
  },
  {
    "name": "fire",
    "label": "Fire",
    "unicode": "f06d",
    "terms": [
      "burn",
      "caliente",
      "fire",
      "flame",
      "heat",
      "hot",
      "popular",
      "tool"
    ]
  },
  {
    "name": "fire-burner",
    "label": "Fire Burner",
    "unicode": "e4f1",
    "terms": [
      "cook",
      "fire",
      "flame",
      "kitchen",
      "stove"
    ]
  },
  {
    "name": "fire-extinguisher",
    "label": "Fire Extinguisher",
    "unicode": "f134",
    "terms": [
      "burn",
      "caliente",
      "extinguish",
      "fire",
      "fire extinguisher",
      "fire fighter",
      "flame",
      "heat",
      "hot",
      "quench",
      "rescue"
    ]
  },
  {
    "name": "fire-flame-curved",
    "label": "Fire Flame Curved",
    "unicode": "f7e4",
    "terms": [
      "burn",
      "caliente",
      "flame",
      "heat",
      "hot",
      "popular"
    ]
  },
  {
    "name": "fire-flame-simple",
    "label": "Fire Flame Simple",
    "unicode": "f46a",
    "terms": [
      "caliente",
      "energy",
      "fire",
      "flame",
      "gas",
      "heat",
      "hot"
    ]
  },
  {
    "name": "fish",
    "label": "Fish",
    "unicode": "f578",
    "terms": [
      "Pisces",
      "fauna",
      "fish",
      "gold",
      "seafood",
      "swimming",
      "zodiac"
    ]
  },
  {
    "name": "fish-fins",
    "label": "Fish Fins",
    "unicode": "e4f2",
    "terms": [
      "fish",
      "fishery",
      "pisces",
      "seafood"
    ]
  },
  {
    "name": "flag",
    "label": "Flag",
    "unicode": "f024",
    "terms": [
      "black flag",
      "country",
      "notice",
      "notification",
      "notify",
      "pole",
      "report",
      "symbol",
      "waving"
    ]
  },
  {
    "name": "flag-checkered",
    "label": "Flag Checkered",
    "unicode": "f11e",
    "terms": [
      "checkered",
      "chequered",
      "chequered flag",
      "finish",
      "notice",
      "notification",
      "notify",
      "pole",
      "racing",
      "report",
      "start",
      "symbol",
      "win"
    ]
  },
  {
    "name": "flag-usa",
    "label": "Flag Usa",
    "unicode": "f74d",
    "terms": [
      "betsy ross",
      "country",
      "fla",
      "flag: United States",
      "old glory",
      "stars",
      "stripes",
      "symbol"
    ]
  },
  {
    "name": "flask",
    "label": "Flask",
    "unicode": "f0c3",
    "terms": [
      "beaker",
      "chemicals",
      "experiment",
      "experimental",
      "knowledge",
      "labs",
      "liquid",
      "potion",
      "science",
      "vial"
    ]
  },
  {
    "name": "flask-vial",
    "label": "Flask Vial",
    "unicode": "e4f3",
    "terms": [
      "ampule",
      "beaker",
      "chemicals",
      "chemistry",
      "experiment",
      "experimental",
      "lab",
      "laboratory",
      "labs",
      "liquid",
      "potion",
      "science",
      "test",
      "test tube",
      "vial"
    ]
  },
  {
    "name": "floppy-disk",
    "label": "Floppy Disk",
    "unicode": "f0c7",
    "terms": [
      "Black Hard Shell Floppy Disk",
      "computer",
      "disk",
      "download",
      "floppy",
      "floppy disk",
      "floppy-o"
    ]
  },
  {
    "name": "florin-sign",
    "label": "Florin Sign",
    "unicode": "e184",
    "terms": [
      "currency"
    ]
  },
  {
    "name": "folder",
    "label": "Folder",
    "unicode": "f07b",
    "terms": [
      "Black Folder",
      "archive",
      "directory",
      "document",
      "file",
      "file folder",
      "folder"
    ]
  },
  {
    "name": "folder-closed",
    "label": "Folder Closed",
    "unicode": "e185",
    "terms": [
      "file"
    ]
  },
  {
    "name": "folder-minus",
    "label": "Folder Minus",
    "unicode": "f65d",
    "terms": [
      "archive",
      "delete",
      "directory",
      "document",
      "file",
      "negative",
      "remove"
    ]
  },
  {
    "name": "folder-open",
    "label": "Folder Open",
    "unicode": "f07c",
    "terms": [
      "Open Folder",
      "archive",
      "directory",
      "document",
      "empty",
      "file",
      "folder",
      "new",
      "open",
      "open file folder"
    ]
  },
  {
    "name": "folder-plus",
    "label": "Folder Plus",
    "unicode": "f65e",
    "terms": [
      "add",
      "archive",
      "create",
      "directory",
      "document",
      "file",
      "new",
      "positive"
    ]
  },
  {
    "name": "folder-tree",
    "label": "Folder Tree",
    "unicode": "f802",
    "terms": [
      "archive",
      "directory",
      "document",
      "file",
      "search",
      "structure"
    ]
  },
  {
    "name": "font",
    "label": "Font",
    "unicode": "f031",
    "terms": [
      "alphabet",
      "glyph",
      "text",
      "type",
      "typeface"
    ]
  },
  {
    "name": "font-awesome",
    "label": "Font Awesome",
    "unicode": "f2b4",
    "terms": [
      "awesome",
      "flag",
      "font",
      "icons",
      "typeface"
    ]
  },
  {
    "name": "football",
    "label": "Football",
    "unicode": "f44e",
    "terms": [
      "american",
      "american football",
      "ball",
      "fall",
      "football",
      "nfl",
      "pigskin",
      "seasonal"
    ]
  },
  {
    "name": "forward",
    "label": "Forward",
    "unicode": "f04e",
    "terms": [
      "arrow",
      "double",
      "fast",
      "fast-forward button",
      "forward",
      "next",
      "skip"
    ]
  },
  {
    "name": "forward-fast",
    "label": "Forward Fast",
    "unicode": "f050",
    "terms": [
      "arrow",
      "end",
      "last",
      "next",
      "next scene",
      "next track",
      "next track button",
      "quick",
      "triangle"
    ]
  },
  {
    "name": "forward-step",
    "label": "Forward Step",
    "unicode": "f051",
    "terms": [
      "end",
      "last",
      "next"
    ]
  },
  {
    "name": "franc-sign",
    "label": "Franc Sign",
    "unicode": "e18f",
    "terms": [
      "French Franc Sign",
      "currency"
    ]
  },
  {
    "name": "frog",
    "label": "Frog",
    "unicode": "f52e",
    "terms": [
      "amphibian",
      "bullfrog",
      "fauna",
      "hop",
      "kermit",
      "kiss",
      "prince",
      "ribbit",
      "toad",
      "wart"
    ]
  },
  {
    "name": "futbol",
    "label": "Futbol",
    "unicode": "f1e3",
    "terms": [
      "ball",
      "football",
      "mls",
      "soccer",
      "soccer ball"
    ]
  },
  {
    "name": "g",
    "label": "G",
    "unicode": "47",
    "terms": [
      "Latin Capital Letter G",
      "Latin Small Letter G",
      "letter"
    ]
  },
  {
    "name": "gamepad",
    "label": "Gamepad",
    "unicode": "f11b",
    "terms": [
      "arcade",
      "controller",
      "d-pad",
      "joystick",
      "playstore",
      "video",
      "video game"
    ]
  },
  {
    "name": "gas-pump",
    "label": "Gas Pump",
    "unicode": "f52f",
    "terms": [
      "car",
      "diesel",
      "fuel",
      "fuel pump",
      "fuelpump",
      "gas",
      "gasoline",
      "petrol",
      "pump",
      "station"
    ]
  },
  {
    "name": "gauge",
    "label": "Gauge",
    "unicode": "f624",
    "terms": [
      "dashboard",
      "fast",
      "odometer",
      "speed",
      "speedometer"
    ]
  },
  {
    "name": "gauge-high",
    "label": "Gauge High",
    "unicode": "f625",
    "terms": [
      "dashboard",
      "fast",
      "odometer",
      "quick",
      "speed",
      "speedometer"
    ]
  },
  {
    "name": "gauge-simple",
    "label": "Gauge Simple",
    "unicode": "f629",
    "terms": [
      "dashboard",
      "fast",
      "odometer",
      "speed",
      "speedometer"
    ]
  },
  {
    "name": "gauge-simple-high",
    "label": "Gauge Simple High",
    "unicode": "f62a",
    "terms": [
      "dashboard",
      "fast",
      "odometer",
      "quick",
      "speed",
      "speedometer"
    ]
  },
  {
    "name": "gavel",
    "label": "Gavel",
    "unicode": "f0e3",
    "terms": [
      "hammer",
      "judge",
      "law",
      "lawyer",
      "opinion"
    ]
  },
  {
    "name": "gear",
    "label": "Gear",
    "unicode": "f013",
    "terms": [
      "cog",
      "cogwheel",
      "configuration",
      "gear",
      "mechanical",
      "modify",
      "settings",
      "sprocket",
      "tool",
      "wheel"
    ]
  },
  {
    "name": "gears",
    "label": "Gears",
    "unicode": "f085",
    "terms": [
      "configuration",
      "gears",
      "mechanical",
      "modify",
      "settings",
      "sprocket",
      "wheel"
    ]
  },
  {
    "name": "gem",
    "label": "Gem",
    "unicode": "f3a5",
    "terms": [
      "diamond",
      "gem",
      "gem stone",
      "jewel",
      "jewelry",
      "sapphire",
      "stone",
      "treasure"
    ]
  },
  {
    "name": "genderless",
    "label": "Genderless",
    "unicode": "f22d",
    "terms": [
      "androgynous",
      "asexual",
      "gender",
      "sexless"
    ]
  },
  {
    "name": "ghost",
    "label": "Ghost",
    "unicode": "f6e2",
    "terms": [
      "apparition",
      "blinky",
      "clyde",
      "creature",
      "face",
      "fairy tale",
      "fantasy",
      "floating",
      "ghost",
      "halloween",
      "holiday",
      "inky",
      "monster",
      "pacman",
      "pinky",
      "spirit"
    ]
  },
  {
    "name": "gift",
    "label": "Gift",
    "unicode": "f06b",
    "terms": [
      "box",
      "celebration",
      "christmas",
      "generosity",
      "gift",
      "giving",
      "holiday",
      "party",
      "present",
      "wrapped",
      "wrapped gift",
      "xmas"
    ]
  },
  {
    "name": "gifts",
    "label": "Gifts",
    "unicode": "f79c",
    "terms": [
      "christmas",
      "generosity",
      "giving",
      "holiday",
      "party",
      "present",
      "wrapped",
      "xmas"
    ]
  },
  {
    "name": "glass-water",
    "label": "Glass Water",
    "unicode": "e4f4",
    "terms": [
      "potable",
      "water"
    ]
  },
  {
    "name": "glass-water-droplet",
    "label": "Glass Water Droplet",
    "unicode": "e4f5",
    "terms": [
      "potable",
      "water"
    ]
  },
  {
    "name": "glasses",
    "label": "Glasses",
    "unicode": "f530",
    "terms": [
      "hipster",
      "nerd",
      "reading",
      "sight",
      "spectacles",
      "vision"
    ]
  },
  {
    "name": "globe",
    "label": "Globe",
    "unicode": "f0ac",
    "terms": [
      "all",
      "coordinates",
      "country",
      "earth",
      "global",
      "globe",
      "globe with meridians",
      "gps",
      "internet",
      "language",
      "localize",
      "location",
      "map",
      "meridians",
      "network",
      "online",
      "place",
      "planet",
      "translate",
      "travel",
      "world",
      "www"
    ]
  },
  {
    "name": "golf-ball-tee",
    "label": "Golf Ball Tee",
    "unicode": "f450",
    "terms": [
      "caddy",
      "eagle",
      "putt",
      "tee"
    ]
  },
  {
    "name": "gopuram",
    "label": "Gopuram",
    "unicode": "f664",
    "terms": [
      "building",
      "entrance",
      "hinduism",
      "temple",
      "tower"
    ]
  },
  {
    "name": "graduation-cap",
    "label": "Graduation Cap",
    "unicode": "f19d",
    "terms": [
      "cap",
      "celebration",
      "ceremony",
      "clothing",
      "college",
      "graduate",
      "graduation",
      "graduation cap",
      "hat",
      "learning",
      "school",
      "student"
    ]
  },
  {
    "name": "greater-than",
    "label": "Greater Than",
    "unicode": "3e",
    "terms": [
      "Greater-Than Sign",
      "arithmetic",
      "compare",
      "math"
    ]
  },
  {
    "name": "greater-than-equal",
    "label": "Greater Than Equal",
    "unicode": "f532",
    "terms": [
      "arithmetic",
      "compare",
      "math"
    ]
  },
  {
    "name": "grip",
    "label": "Grip",
    "unicode": "f58d",
    "terms": [
      "affordance",
      "drag",
      "drop",
      "grab",
      "handle"
    ]
  },
  {
    "name": "grip-lines",
    "label": "Grip Lines",
    "unicode": "f7a4",
    "terms": [
      "affordance",
      "drag",
      "drop",
      "grab",
      "handle"
    ]
  },
  {
    "name": "grip-lines-vertical",
    "label": "Grip Lines Vertical",
    "unicode": "f7a5",
    "terms": [
      "affordance",
      "drag",
      "drop",
      "grab",
      "handle"
    ]
  },
  {
    "name": "grip-vertical",
    "label": "Grip Vertical",
    "unicode": "f58e",
    "terms": [
      "affordance",
      "drag",
      "drop",
      "grab",
      "handle"
    ]
  },
  {
    "name": "group-arrows-rotate",
    "label": "Group Arrows Rotate",
    "unicode": "e4f6",
    "terms": [
      "community",
      "engagement",
      "spin",
      "sync"
    ]
  },
  {
    "name": "guarani-sign",
    "label": "Guarani Sign",
    "unicode": "e19a",
    "terms": [
      "Guarani Sign",
      "currency"
    ]
  },
  {
    "name": "guitar",
    "label": "Guitar",
    "unicode": "f7a6",
    "terms": [
      "acoustic",
      "instrument",
      "music",
      "rock",
      "rock and roll",
      "song",
      "strings"
    ]
  },
  {
    "name": "gun",
    "label": "Gun",
    "unicode": "e19b",
    "terms": [
      "firearm",
      "pistol",
      "weapon"
    ]
  },
  {
    "name": "h",
    "label": "H",
    "unicode": "48",
    "terms": [
      "Latin Capital Letter H",
      "Latin Small Letter H",
      "letter"
    ]
  },
  {
    "name": "hammer",
    "label": "Hammer",
    "unicode": "f6e3",
    "terms": [
      "admin",
      "configuration",
      "equipment",
      "fix",
      "hammer",
      "maintenance",
      "modify",
      "recovery",
      "repair",
      "settings",
      "tool"
    ]
  },
  {
    "name": "hamsa",
    "label": "Hamsa",
    "unicode": "f665",
    "terms": [
      "amulet",
      "christianity",
      "islam",
      "jewish",
      "judaism",
      "muslim",
      "protection"
    ]
  },
  {
    "name": "hand",
    "label": "Hand",
    "unicode": "f256",
    "terms": [
      "Raised Hand",
      "backhand",
      "game",
      "halt",
      "palm",
      "raised",
      "raised back of hand",
      "request",
      "roshambo",
      "stop"
    ]
  },
  {
    "name": "hand-back-fist",
    "label": "Hand Back Fist",
    "unicode": "f255",
    "terms": [
      "fist",
      "game",
      "roshambo"
    ]
  },
  {
    "name": "hand-dots",
    "label": "Hand Dots",
    "unicode": "f461",
    "terms": [
      "allergy",
      "freckles",
      "hand",
      "hives",
      "palm",
      "pox",
      "skin",
      "spots"
    ]
  },
  {
    "name": "hand-fist",
    "label": "Hand Fist",
    "unicode": "f6de",
    "terms": [
      "Dungeons & Dragons",
      "clenched",
      "d&d",
      "dnd",
      "fantasy",
      "fist",
      "hand",
      "ki",
      "monk",
      "punch",
      "raised fist",
      "resist",
      "strength",
      "unarmed combat"
    ]
  },
  {
    "name": "hand-holding",
    "label": "Hand Holding",
    "unicode": "f4bd",
    "terms": [
      "carry",
      "lift"
    ]
  },
  {
    "name": "hand-holding-dollar",
    "label": "Hand Holding Dollar",
    "unicode": "f4c0",
    "terms": [
      "$",
      "carry",
      "coupon",
      "dollar sign",
      "donate",
      "donation",
      "giving",
      "investment",
      "lift",
      "money",
      "premium",
      "price",
      "revenue",
      "salary"
    ]
  },
  {
    "name": "hand-holding-droplet",
    "label": "Hand Holding Droplet",
    "unicode": "f4c1",
    "terms": [
      "blood",
      "carry",
      "covid-19",
      "drought",
      "grow",
      "lift",
      "sanitation"
    ]
  },
  {
    "name": "hand-holding-hand",
    "label": "Hand Holding Hand",
    "unicode": "e4f7",
    "terms": [
      "care",
      "give",
      "help",
      "hold",
      "protect"
    ]
  },
  {
    "name": "hand-holding-heart",
    "label": "Hand Holding Heart",
    "unicode": "f4be",
    "terms": [
      "carry",
      "charity",
      "gift",
      "lift",
      "package",
      "wishlist"
    ]
  },
  {
    "name": "hand-holding-medical",
    "label": "Hand Holding Medical",
    "unicode": "e05c",
    "terms": [
      "care",
      "covid-19",
      "donate",
      "help"
    ]
  },
  {
    "name": "hand-lizard",
    "label": "Hand Lizard",
    "unicode": "f258",
    "terms": [
      "game",
      "roshambo"
    ]
  },
  {
    "name": "hand-middle-finger",
    "label": "Hand Middle Finger",
    "unicode": "f806",
    "terms": [
      "finger",
      "flip the bird",
      "gesture",
      "hand",
      "hate",
      "middle finger",
      "rude"
    ]
  },
  {
    "name": "hand-peace",
    "label": "Hand Peace",
    "unicode": "f25b",
    "terms": [
      "hand",
      "rest",
      "truce",
      "v",
      "victory",
      "victory hand"
    ]
  },
  {
    "name": "hand-point-down",
    "label": "Hand Point Down",
    "unicode": "f0a7",
    "terms": [
      "finger",
      "hand-o-down",
      "point"
    ]
  },
  {
    "name": "hand-point-left",
    "label": "Hand Point Left",
    "unicode": "f0a5",
    "terms": [
      "back",
      "finger",
      "hand-o-left",
      "left",
      "point",
      "previous"
    ]
  },
  {
    "name": "hand-point-right",
    "label": "Hand Point Right",
    "unicode": "f0a4",
    "terms": [
      "finger",
      "forward",
      "hand-o-right",
      "next",
      "point",
      "right"
    ]
  },
  {
    "name": "hand-point-up",
    "label": "Hand Point Up",
    "unicode": "f0a6",
    "terms": [
      "finger",
      "hand",
      "hand-o-up",
      "index",
      "index pointing up",
      "point",
      "request",
      "up",
      "upgrade"
    ]
  },
  {
    "name": "hand-pointer",
    "label": "Hand Pointer",
    "unicode": "f25a",
    "terms": [
      "arrow",
      "cursor",
      "select"
    ]
  },
  {
    "name": "hand-scissors",
    "label": "Hand Scissors",
    "unicode": "f257",
    "terms": [
      "cut",
      "game",
      "roshambo"
    ]
  },
  {
    "name": "hand-sparkles",
    "label": "Hand Sparkles",
    "unicode": "e05d",
    "terms": [
      "clean",
      "covid-19",
      "hygiene",
      "magic",
      "palm",
      "soap",
      "wash"
    ]
  },
  {
    "name": "hand-spock",
    "label": "Hand Spock",
    "unicode": "f259",
    "terms": [
      "finger",
      "hand",
      "live long",
      "palm",
      "prosper",
      "salute",
      "spock",
      "star trek",
      "vulcan",
      "vulcan salute"
    ]
  },
  {
    "name": "handcuffs",
    "label": "Handcuffs",
    "unicode": "e4f8",
    "terms": [
      "arrest",
      "criminal",
      "handcuffs",
      "jail",
      "lock",
      "police",
      "wrist"
    ]
  },
  {
    "name": "hands",
    "label": "Hands",
    "unicode": "f2a7",
    "terms": [
      "Translate",
      "asl",
      "deaf",
      "hands"
    ]
  },
  {
    "name": "hands-asl-interpreting",
    "label": "Hands Asl Interpreting",
    "unicode": "f2a3",
    "terms": [
      "asl",
      "deaf",
      "finger",
      "hand",
      "interpret",
      "speak"
    ]
  },
  {
    "name": "hands-bound",
    "label": "Hands Bound",
    "unicode": "e4f9",
    "terms": [
      "abduction",
      "bound",
      "handcuff",
      "wrist"
    ]
  },
  {
    "name": "hands-bubbles",
    "label": "Hands Bubbles",
    "unicode": "e05e",
    "terms": [
      "covid-19",
      "hygiene",
      "soap",
      "wash"
    ]
  },
  {
    "name": "hands-clapping",
    "label": "Hands Clapping",
    "unicode": "e1a8",
    "terms": [
      "applause",
      "clap",
      "clapping hands",
      "hand"
    ]
  },
  {
    "name": "hands-holding",
    "label": "Hands Holding",
    "unicode": "f4c2",
    "terms": [
      "carry",
      "hold",
      "lift"
    ]
  },
  {
    "name": "hands-holding-child",
    "label": "Hands Holding Child",
    "unicode": "e4fa",
    "terms": [
      "care",
      "give",
      "help",
      "hold",
      "parent",
      "protect"
    ]
  },
  {
    "name": "hands-holding-circle",
    "label": "Hands Holding Circle",
    "unicode": "e4fb",
    "terms": [
      "circle",
      "gift",
      "protection"
    ]
  },
  {
    "name": "hands-praying",
    "label": "Hands Praying",
    "unicode": "f684",
    "terms": [
      "kneel",
      "preach",
      "religion",
      "worship"
    ]
  },
  {
    "name": "handshake",
    "label": "Handshake",
    "unicode": "f2b5",
    "terms": [
      "agreement",
      "greeting",
      "meeting",
      "partnership"
    ]
  },
  {
    "name": "handshake-angle",
    "label": "Handshake Angle",
    "unicode": "f4c4",
    "terms": [
      "aid",
      "assistance",
      "handshake",
      "partnership",
      "volunteering"
    ]
  },
  {
    "name": "handshake-simple",
    "label": "Handshake Simple",
    "unicode": "f4c6",
    "terms": [
      "agreement",
      "greeting",
      "hand",
      "handshake",
      "meeting",
      "partnership",
      "shake"
    ]
  },
  {
    "name": "handshake-simple-slash",
    "label": "Handshake Simple Slash",
    "unicode": "e05f",
    "terms": [
      "broken",
      "covid-19",
      "disabled",
      "social distance"
    ]
  },
  {
    "name": "handshake-slash",
    "label": "Handshake Slash",
    "unicode": "e060",
    "terms": [
      "broken",
      "covid-19",
      "disabled",
      "social distance"
    ]
  },
  {
    "name": "hanukiah",
    "label": "Hanukiah",
    "unicode": "f6e6",
    "terms": [
      "candelabrum",
      "candle",
      "candlestick",
      "hanukkah",
      "jewish",
      "judaism",
      "light",
      "menorah",
      "religion"
    ]
  },
  {
    "name": "hard-drive",
    "label": "Hard Drive",
    "unicode": "f0a0",
    "terms": [
      "Hard Disk",
      "cpu",
      "hard drive",
      "harddrive",
      "machine",
      "save",
      "storage"
    ]
  },
  {
    "name": "hashtag",
    "label": "Hashtag",
    "unicode": "23",
    "terms": [
      "Number Sign",
      "Twitter",
      "instagram",
      "pound",
      "social media",
      "tag"
    ]
  },
  {
    "name": "hat-cowboy",
    "label": "Hat Cowboy",
    "unicode": "f8c0",
    "terms": [
      "buckaroo",
      "horse",
      "jackeroo",
      "john b.",
      "old west",
      "pardner",
      "ranch",
      "rancher",
      "rodeo",
      "western",
      "wrangler"
    ]
  },
  {
    "name": "hat-cowboy-side",
    "label": "Hat Cowboy Side",
    "unicode": "f8c1",
    "terms": [
      "buckaroo",
      "horse",
      "jackeroo",
      "john b.",
      "old west",
      "pardner",
      "ranch",
      "rancher",
      "rodeo",
      "western",
      "wrangler"
    ]
  },
  {
    "name": "hat-wizard",
    "label": "Hat Wizard",
    "unicode": "f6e8",
    "terms": [
      "Dungeons & Dragons",
      "accessory",
      "buckle",
      "clothing",
      "d&d",
      "dnd",
      "fantasy",
      "halloween",
      "head",
      "holiday",
      "mage",
      "magic",
      "pointy",
      "witch"
    ]
  },
  {
    "name": "head-side-cough",
    "label": "Head Side Cough",
    "unicode": "e061",
    "terms": [
      "cough",
      "covid-19",
      "germs",
      "lungs",
      "respiratory",
      "sick",
      "uer"
    ]
  },
  {
    "name": "head-side-cough-slash",
    "label": "Head Side Cough Slash",
    "unicode": "e062",
    "terms": [
      "cough",
      "covid-19",
      "disabled",
      "germs",
      "lungs",
      "respiratory",
      "sick",
      "uer"
    ]
  },
  {
    "name": "head-side-mask",
    "label": "Head Side Mask",
    "unicode": "e063",
    "terms": [
      "breath",
      "coronavirus",
      "covid-19",
      "filter",
      "flu",
      "infection",
      "pandemic",
      "respirator",
      "uer",
      "virus"
    ]
  },
  {
    "name": "head-side-virus",
    "label": "Head Side Virus",
    "unicode": "e064",
    "terms": [
      "cold",
      "coronavirus",
      "covid-19",
      "flu",
      "infection",
      "pandemic",
      "sick",
      "uer"
    ]
  },
  {
    "name": "heading",
    "label": "Heading",
    "unicode": "f1dc",
    "terms": [
      "format",
      "header",
      "text",
      "title"
    ]
  },
  {
    "name": "headphones",
    "label": "Headphones",
    "unicode": "f025",
    "terms": [
      "audio",
      "earbud",
      "headphone",
      "listen",
      "music",
      "sound",
      "speaker"
    ]
  },
  {
    "name": "headphones-simple",
    "label": "Headphones Simple",
    "unicode": "f58f",
    "terms": [
      "audio",
      "listen",
      "music",
      "sound",
      "speaker"
    ]
  },
  {
    "name": "headset",
    "label": "Headset",
    "unicode": "f590",
    "terms": [
      "audio",
      "gamer",
      "gaming",
      "listen",
      "live chat",
      "microphone",
      "shot caller",
      "sound",
      "support",
      "telemarketer"
    ]
  },
  {
    "name": "heart",
    "label": "Heart",
    "unicode": "f004",
    "terms": [
      "ace",
      "black",
      "black heart",
      "blue",
      "blue heart",
      "brown",
      "brown heart",
      "card",
      "evil",
      "favorite",
      "game",
      "green",
      "green heart",
      "heart",
      "heart suit",
      "like",
      "love",
      "orange",
      "orange heart",
      "purple",
      "purple heart",
      "red heart",
      "relationship",
      "valentine",
      "white",
      "white heart",
      "wicked",
      "wishlist",
      "yellow",
      "yellow heart"
    ]
  },
  {
    "name": "heart-circle-bolt",
    "label": "Heart Circle Bolt",
    "unicode": "e4fc",
    "terms": [
      "cardiogram",
      "ekg",
      "electric",
      "heart",
      "love",
      "pacemaker"
    ]
  },
  {
    "name": "heart-circle-check",
    "label": "Heart Circle Check",
    "unicode": "e4fd",
    "terms": [
      "enable",
      "favorite",
      "heart",
      "love",
      "not affected",
      "ok",
      "okay",
      "validate",
      "working"
    ]
  },
  {
    "name": "heart-circle-exclamation",
    "label": "Heart Circle Exclamation",
    "unicode": "e4fe",
    "terms": [
      "failed",
      "favorite",
      "heart",
      "love"
    ]
  },
  {
    "name": "heart-circle-minus",
    "label": "Heart Circle Minus",
    "unicode": "e4ff",
    "terms": [
      "favorite",
      "heart",
      "love"
    ]
  },
  {
    "name": "heart-circle-plus",
    "label": "Heart Circle Plus",
    "unicode": "e500",
    "terms": [
      "favorite",
      "heart",
      "love"
    ]
  },
  {
    "name": "heart-circle-xmark",
    "label": "Heart Circle Xmark",
    "unicode": "e501",
    "terms": [
      "favorite",
      "heart",
      "love",
      "uncheck"
    ]
  },
  {
    "name": "heart-crack",
    "label": "Heart Crack",
    "unicode": "f7a9",
    "terms": [
      "break",
      "breakup",
      "broken",
      "broken heart",
      "crushed",
      "dislike",
      "dumped",
      "grief",
      "love",
      "lovesick",
      "relationship",
      "sad"
    ]
  },
  {
    "name": "heart-pulse",
    "label": "Heart Pulse",
    "unicode": "f21e",
    "terms": [
      "ekg",
      "electrocardiogram",
      "health",
      "lifeline",
      "vital signs"
    ]
  },
  {
    "name": "helicopter",
    "label": "Helicopter",
    "unicode": "f533",
    "terms": [
      "airwolf",
      "apache",
      "chopper",
      "flight",
      "fly",
      "helicopter",
      "travel",
      "vehicle"
    ]
  },
  {
    "name": "helicopter-symbol",
    "label": "Helicopter Symbol",
    "unicode": "e502",
    "terms": [
      "chopper",
      "helicopter",
      "landing pad",
      "whirlybird"
    ]
  },
  {
    "name": "helmet-safety",
    "label": "Helmet Safety",
    "unicode": "f807",
    "terms": [
      "construction",
      "hardhat",
      "helmet",
      "maintenance",
      "safety"
    ]
  },
  {
    "name": "helmet-un",
    "label": "Helmet Un",
    "unicode": "e503",
    "terms": [
      "helmet",
      "united nations"
    ]
  },
  {
    "name": "hexagon-nodes",
    "label": "Hexagon Nodes",
    "unicode": "e699",
    "terms": [
      "action",
      "ai",
      "artificial intelligence",
      "cluster",
      "graph",
      "language",
      "llm",
      "model",
      "network",
      "neuronal"
    ]
  },
  {
    "name": "hexagon-nodes-bolt",
    "label": "Hexagon Nodes Bolt",
    "unicode": "e69a",
    "terms": [
      "LLM",
      "action",
      "ai",
      "artificial intelligence",
      "cluster",
      "graph",
      "language",
      "llm",
      "model",
      "network",
      "neuronal"
    ]
  },
  {
    "name": "highlighter",
    "label": "Highlighter",
    "unicode": "f591",
    "terms": [
      "edit",
      "marker",
      "modify",
      "sharpie",
      "update",
      "write"
    ]
  },
  {
    "name": "hill-avalanche",
    "label": "Hill Avalanche",
    "unicode": "e507",
    "terms": [
      "mudslide",
      "snow",
      "winter"
    ]
  },
  {
    "name": "hill-rockslide",
    "label": "Hill Rockslide",
    "unicode": "e508",
    "terms": [
      "mudslide"
    ]
  },
  {
    "name": "hippo",
    "label": "Hippo",
    "unicode": "f6ed",
    "terms": [
      "animal",
      "fauna",
      "hippo",
      "hippopotamus",
      "hungry",
      "mammal"
    ]
  },
  {
    "name": "hockey-puck",
    "label": "Hockey Puck",
    "unicode": "f453",
    "terms": [
      "ice",
      "nhl",
      "sport"
    ]
  },
  {
    "name": "holly-berry",
    "label": "Holly Berry",
    "unicode": "f7aa",
    "terms": [
      "catwoman",
      "christmas",
      "decoration",
      "flora",
      "halle",
      "holiday",
      "ororo munroe",
      "plant",
      "storm",
      "xmas"
    ]
  },
  {
    "name": "horse",
    "label": "Horse",
    "unicode": "f6f0",
    "terms": [
      "equestrian",
      "equus",
      "fauna",
      "horse",
      "mammmal",
      "mare",
      "neigh",
      "pony",
      "racehorse",
      "racing"
    ]
  },
  {
    "name": "horse-head",
    "label": "Horse Head",
    "unicode": "f7ab",
    "terms": [
      "equus",
      "fauna",
      "mammmal",
      "mare",
      "neigh",
      "pony"
    ]
  },
  {
    "name": "hospital",
    "label": "Hospital",
    "unicode": "f0f8",
    "terms": [
      "building",
      "covid-19",
      "doctor",
      "emergency room",
      "hospital",
      "medical center",
      "medicine"
    ]
  },
  {
    "name": "hospital-user",
    "label": "Hospital User",
    "unicode": "f80d",
    "terms": [
      "covid-19",
      "doctor",
      "network",
      "patient",
      "primary care",
      "uer"
    ]
  },
  {
    "name": "hot-tub-person",
    "label": "Hot Tub Person",
    "unicode": "f593",
    "terms": [
      "jacuzzi",
      "spa",
      "uer"
    ]
  },
  {
    "name": "hotdog",
    "label": "Hotdog",
    "unicode": "f80f",
    "terms": [
      "bun",
      "chili",
      "frankfurt",
      "frankfurter",
      "hot dog",
      "hotdog",
      "kosher",
      "polish",
      "sandwich",
      "sausage",
      "vienna",
      "weiner"
    ]
  },
  {
    "name": "hotel",
    "label": "Hotel",
    "unicode": "f594",
    "terms": [
      "building",
      "hotel",
      "inn",
      "lodging",
      "motel",
      "resort",
      "travel"
    ]
  },
  {
    "name": "hourglass",
    "label": "Hourglass",
    "unicode": "f254",
    "terms": [
      "hour",
      "hourglass",
      "hourglass not done",
      "minute",
      "sand",
      "stopwatch",
      "time",
      "timer"
    ]
  },
  {
    "name": "hourglass-end",
    "label": "Hourglass End",
    "unicode": "f253",
    "terms": [
      "hour",
      "hourglass done",
      "minute",
      "pending",
      "sand",
      "stopwatch",
      "time",
      "timer",
      "waiting"
    ]
  },
  {
    "name": "hourglass-half",
    "label": "Hourglass Half",
    "unicode": "f252",
    "terms": [
      "hour",
      "minute",
      "pending",
      "sand",
      "stopwatch",
      "time",
      "waiting"
    ]
  },
  {
    "name": "hourglass-start",
    "label": "Hourglass Start",
    "unicode": "f251",
    "terms": [
      "hour",
      "minute",
      "sand",
      "stopwatch",
      "time",
      "waiting"
    ]
  },
  {
    "name": "house",
    "label": "House",
    "unicode": "f015",
    "terms": [
      "abode",
      "building",
      "home",
      "house",
      "main",
      "residence"
    ]
  },
  {
    "name": "house-chimney",
    "label": "House Chimney",
    "unicode": "e3af",
    "terms": [
      "abode",
      "building",
      "chimney",
      "house",
      "main",
      "residence",
      "smokestack"
    ]
  },
  {
    "name": "house-chimney-crack",
    "label": "House Chimney Crack",
    "unicode": "f6f1",
    "terms": [
      "building",
      "devastation",
      "disaster",
      "earthquake",
      "home",
      "insurance"
    ]
  },
  {
    "name": "house-chimney-medical",
    "label": "House Chimney Medical",
    "unicode": "f7f2",
    "terms": [
      "covid-19",
      "doctor",
      "general practitioner",
      "hospital",
      "infirmary",
      "medicine",
      "office",
      "outpatient"
    ]
  },
  {
    "name": "house-chimney-user",
    "label": "House Chimney User",
    "unicode": "e065",
    "terms": [
      "covid-19",
      "home",
      "isolation",
      "quarantine",
      "uer"
    ]
  },
  {
    "name": "house-chimney-window",
    "label": "House Chimney Window",
    "unicode": "e00d",
    "terms": [
      "abode",
      "building",
      "family",
      "home",
      "residence"
    ]
  },
  {
    "name": "house-circle-check",
    "label": "House Circle Check",
    "unicode": "e509",
    "terms": [
      "abode",
      "enable",
      "home",
      "house",
      "not affected",
      "ok",
      "okay",
      "validate",
      "working"
    ]
  },
  {
    "name": "house-circle-exclamation",
    "label": "House Circle Exclamation",
    "unicode": "e50a",
    "terms": [
      "abode",
      "affected",
      "failed",
      "home",
      "house"
    ]
  },
  {
    "name": "house-circle-xmark",
    "label": "House Circle Xmark",
    "unicode": "e50b",
    "terms": [
      "abode",
      "destroy",
      "home",
      "house",
      "uncheck"
    ]
  },
  {
    "name": "house-crack",
    "label": "House Crack",
    "unicode": "e3b1",
    "terms": [
      "building",
      "devastation",
      "disaster",
      "earthquake",
      "home",
      "insurance"
    ]
  },
  {
    "name": "house-fire",
    "label": "House Fire",
    "unicode": "e50c",
    "terms": [
      "burn",
      "emergency",
      "home"
    ]
  },
  {
    "name": "house-flag",
    "label": "House Flag",
    "unicode": "e50d",
    "terms": [
      "camp",
      "home"
    ]
  },
  {
    "name": "house-flood-water",
    "label": "House Flood Water",
    "unicode": "e50e",
    "terms": [
      "damage",
      "flood",
      "water"
    ]
  },
  {
    "name": "house-flood-water-circle-arrow-right",
    "label": "House Flood Water Circle Arrow Right",
    "unicode": "e50f",
    "terms": [
      "damage",
      "flood",
      "water"
    ]
  },
  {
    "name": "house-laptop",
    "label": "House Laptop",
    "unicode": "e066",
    "terms": [
      "computer",
      "covid-19",
      "device",
      "office",
      "remote",
      "work from home"
    ]
  },
  {
    "name": "house-lock",
    "label": "House Lock",
    "unicode": "e510",
    "terms": [
      "closed",
      "home",
      "house",
      "lockdown",
      "padlock",
      "privacy",
      "quarantine"
    ]
  },
  {
    "name": "house-medical",
    "label": "House Medical",
    "unicode": "e3b2",
    "terms": [
      "covid-19",
      "doctor",
      "facility",
      "general practitioner",
      "health",
      "hospital",
      "infirmary",
      "medicine",
      "office",
      "outpatient"
    ]
  },
  {
    "name": "house-medical-circle-check",
    "label": "House Medical Circle Check",
    "unicode": "e511",
    "terms": [
      "clinic",
      "enable",
      "hospital",
      "not affected",
      "ok",
      "okay",
      "validate",
      "working"
    ]
  },
  {
    "name": "house-medical-circle-exclamation",
    "label": "House Medical Circle Exclamation",
    "unicode": "e512",
    "terms": [
      "affected",
      "clinic",
      "failed",
      "hospital"
    ]
  },
  {
    "name": "house-medical-circle-xmark",
    "label": "House Medical Circle Xmark",
    "unicode": "e513",
    "terms": [
      "clinic",
      "destroy",
      "hospital",
      "uncheck"
    ]
  },
  {
    "name": "house-medical-flag",
    "label": "House Medical Flag",
    "unicode": "e514",
    "terms": [
      "clinic",
      "hospital",
      "mash"
    ]
  },
  {
    "name": "house-signal",
    "label": "House Signal",
    "unicode": "e012",
    "terms": [
      "abode",
      "building",
      "connect",
      "family",
      "home",
      "residence",
      "smart home",
      "wifi",
      "www"
    ]
  },
  {
    "name": "house-tsunami",
    "label": "House Tsunami",
    "unicode": "e515",
    "terms": [
      "damage",
      "flood",
      "tidal wave",
      "wave"
    ]
  },
  {
    "name": "house-user",
    "label": "House User",
    "unicode": "e1b0",
    "terms": [
      "house",
      "uer"
    ]
  },
  {
    "name": "hryvnia-sign",
    "label": "Hryvnia Sign",
    "unicode": "f6f2",
    "terms": [
      "Hryvnia Sign",
      "currency"
    ]
  },
  {
    "name": "hurricane",
    "label": "Hurricane",
    "unicode": "f751",
    "terms": [
      "coriolis effect",
      "eye",
      "storm",
      "tropical cyclone",
      "typhoon"
    ]
  },
  {
    "name": "i",
    "label": "I",
    "unicode": "49",
    "terms": [
      "Latin Capital Letter I",
      "Latin Small Letter I",
      "letter"
    ]
  },
  {
    "name": "i-cursor",
    "label": "I Cursor",
    "unicode": "f246",
    "terms": [
      "editing",
      "i-beam",
      "type",
      "writing"
    ]
  },
  {
    "name": "ice-cream",
    "label": "Ice Cream",
    "unicode": "f810",
    "terms": [
      "chocolate",
      "cone",
      "cream",
      "dessert",
      "frozen",
      "ice",
      "ice cream",
      "scoop",
      "sorbet",
      "sweet",
      "vanilla",
      "yogurt"
    ]
  },
  {
    "name": "icicles",
    "label": "Icicles",
    "unicode": "f7ad",
    "terms": [
      "cold",
      "frozen",
      "hanging",
      "ice",
      "seasonal",
      "sharp"
    ]
  },
  {
    "name": "icons",
    "label": "Icons",
    "unicode": "f86d",
    "terms": [
      "bolt",
      "category",
      "emoji",
      "heart",
      "image",
      "music",
      "photo",
      "symbols"
    ]
  },
  {
    "name": "id-badge",
    "label": "Id Badge",
    "unicode": "f2c1",
    "terms": [
      "address",
      "contact",
      "identification",
      "license",
      "profile",
      "uer",
      "username"
    ]
  },
  {
    "name": "id-card",
    "label": "Id Card",
    "unicode": "f2c2",
    "terms": [
      "contact",
      "demographics",
      "document",
      "identification",
      "issued",
      "profile",
      "registration",
      "uer",
      "username"
    ]
  },
  {
    "name": "id-card-clip",
    "label": "Id Card Clip",
    "unicode": "f47f",
    "terms": [
      "contact",
      "demographics",
      "document",
      "identification",
      "issued",
      "profile",
      "uer",
      "username"
    ]
  },
  {
    "name": "igloo",
    "label": "Igloo",
    "unicode": "f7ae",
    "terms": [
      "dome",
      "dwelling",
      "eskimo",
      "home",
      "house",
      "ice",
      "snow"
    ]
  },
  {
    "name": "image",
    "label": "Image",
    "unicode": "f03e",
    "terms": [
      "album",
      "img",
      "landscape",
      "photo",
      "picture"
    ]
  },
  {
    "name": "image-portrait",
    "label": "Image Portrait",
    "unicode": "f3e0",
    "terms": [
      "id",
      "image",
      "img",
      "photo",
      "picture",
      "selfie",
      "uer",
      "username"
    ]
  },
  {
    "name": "images",
    "label": "Images",
    "unicode": "f302",
    "terms": [
      "album",
      "img",
      "landscape",
      "photo",
      "picture"
    ]
  },
  {
    "name": "inbox",
    "label": "Inbox",
    "unicode": "f01c",
    "terms": [
      "archive",
      "desk",
      "email",
      "mail",
      "message"
    ]
  },
  {
    "name": "indent",
    "label": "Indent",
    "unicode": "f03c",
    "terms": [
      "align",
      "justify",
      "paragraph",
      "tab"
    ]
  },
  {
    "name": "indian-rupee-sign",
    "label": "Indian Rupee Sign",
    "unicode": "e1bc",
    "terms": [
      "Indian Rupee Sign",
      "currency"
    ]
  },
  {
    "name": "industry",
    "label": "Industry",
    "unicode": "f275",
    "terms": [
      "building",
      "factory",
      "industrial",
      "manufacturing",
      "mill",
      "warehouse"
    ]
  },
  {
    "name": "infinity",
    "label": "Infinity",
    "unicode": "f534",
    "terms": [
      "Infinity",
      "eternity",
      "forever",
      "infinity",
      "math",
      "unbounded",
      "universal"
    ]
  },
  {
    "name": "info",
    "label": "Info",
    "unicode": "f129",
    "terms": [
      "details",
      "help",
      "information",
      "more",
      "support"
    ]
  },
  {
    "name": "italic",
    "label": "Italic",
    "unicode": "f033",
    "terms": [
      "edit",
      "emphasis",
      "font",
      "format",
      "text",
      "type"
    ]
  },
  {
    "name": "j",
    "label": "J",
    "unicode": "4a",
    "terms": [
      "Latin Capital Letter J",
      "Latin Small Letter J",
      "letter"
    ]
  },
  {
    "name": "jar",
    "label": "Jar",
    "unicode": "e516",
    "terms": [
      "jam",
      "jelly",
      "storage"
    ]
  },
  {
    "name": "jar-wheat",
    "label": "Jar Wheat",
    "unicode": "e517",
    "terms": [
      "flour",
      "storage"
    ]
  },
  {
    "name": "jedi",
    "label": "Jedi",
    "unicode": "f669",
    "terms": [
      "crest",
      "force",
      "sith",
      "skywalker",
      "star wars",
      "yoda"
    ]
  },
  {
    "name": "jet-fighter",
    "label": "Jet Fighter",
    "unicode": "f0fb",
    "terms": [
      "airforce",
      "airplane",
      "airport",
      "fast",
      "fly",
      "goose",
      "marines",
      "maverick",
      "military",
      "plane",
      "quick",
      "top gun",
      "transportation",
      "travel"
    ]
  },
  {
    "name": "jet-fighter-up",
    "label": "Jet Fighter Up",
    "unicode": "e518",
    "terms": [
      "airforce",
      "airplane",
      "airport",
      "fast",
      "fly",
      "goose",
      "marines",
      "maverick",
      "military",
      "plane",
      "quick",
      "top gun",
      "transportation",
      "travel"
    ]
  },
  {
    "name": "joint",
    "label": "Joint",
    "unicode": "f595",
    "terms": [
      "blunt",
      "cannabis",
      "doobie",
      "drugs",
      "marijuana",
      "roach",
      "smoke",
      "smoking",
      "spliff"
    ]
  },
  {
    "name": "jug-detergent",
    "label": "Jug Detergent",
    "unicode": "e519",
    "terms": [
      "detergent",
      "laundry",
      "soap",
      "wash"
    ]
  },
  {
    "name": "k",
    "label": "K",
    "unicode": "4b",
    "terms": [
      "Latin Capital Letter K",
      "Latin Small Letter K",
      "letter"
    ]
  },
  {
    "name": "kaaba",
    "label": "Kaaba",
    "unicode": "f66b",
    "terms": [
      "Muslim",
      "building",
      "cube",
      "islam",
      "kaaba",
      "muslim",
      "religion"
    ]
  },
  {
    "name": "key",
    "label": "Key",
    "unicode": "f084",
    "terms": [
      "key",
      "lock",
      "password",
      "private",
      "secret",
      "unlock"
    ]
  },
  {
    "name": "keyboard",
    "label": "Keyboard",
    "unicode": "f11c",
    "terms": [
      "accessory",
      "computer",
      "edit",
      "input",
      "keyboard",
      "text",
      "type",
      "write"
    ]
  },
  {
    "name": "khanda",
    "label": "Khanda",
    "unicode": "f66d",
    "terms": [
      "Adi Shakti",
      "chakkar",
      "sikh",
      "sikhism",
      "sword"
    ]
  },
  {
    "name": "kip-sign",
    "label": "Kip Sign",
    "unicode": "e1c4",
    "terms": [
      "Kip Sign",
      "currency"
    ]
  },
  {
    "name": "kit-medical",
    "label": "Kit Medical",
    "unicode": "f479",
    "terms": [
      "emergency",
      "emt",
      "health",
      "medical",
      "rescue"
    ]
  },
  {
    "name": "kitchen-set",
    "label": "Kitchen Set",
    "unicode": "e51a",
    "terms": [
      "chef",
      "cook",
      "cup",
      "kitchen",
      "pan",
      "pot",
      "skillet"
    ]
  },
  {
    "name": "kiwi-bird",
    "label": "Kiwi Bird",
    "unicode": "f535",
    "terms": [
      "bird",
      "fauna",
      "new zealand"
    ]
  },
  {
    "name": "l",
    "label": "L",
    "unicode": "4c",
    "terms": [
      "Latin Capital Letter L",
      "Latin Small Letter L",
      "letter"
    ]
  },
  {
    "name": "land-mine-on",
    "label": "Land Mine On",
    "unicode": "e51b",
    "terms": [
      "bomb",
      "danger",
      "explosion",
      "war"
    ]
  },
  {
    "name": "landmark",
    "label": "Landmark",
    "unicode": "f66f",
    "terms": [
      "building",
      "classical",
      "historic",
      "memorable",
      "monument",
      "museum",
      "politics",
      "society"
    ]
  },
  {
    "name": "landmark-dome",
    "label": "Landmark Dome",
    "unicode": "f752",
    "terms": [
      "building",
      "historic",
      "memorable",
      "monument",
      "politics"
    ]
  },
  {
    "name": "landmark-flag",
    "label": "Landmark Flag",
    "unicode": "e51c",
    "terms": [
      "capitol",
      "flag",
      "landmark",
      "memorial"
    ]
  },
  {
    "name": "language",
    "label": "Language",
    "unicode": "f1ab",
    "terms": [
      "dialect",
      "idiom",
      "localize",
      "speech",
      "translate",
      "vernacular"
    ]
  },
  {
    "name": "laptop",
    "label": "Laptop",
    "unicode": "f109",
    "terms": [
      "computer",
      "cpu",
      "dell",
      "demo",
      "device",
      "fabook",
      "fb",
      "laptop",
      "mac",
      "macbook",
      "machine",
      "pc",
      "personal"
    ]
  },
  {
    "name": "laptop-code",
    "label": "Laptop Code",
    "unicode": "f5fc",
    "terms": [
      "computer",
      "cpu",
      "dell",
      "demo",
      "develop",
      "device",
      "fabook",
      "fb",
      "mac",
      "macbook",
      "machine",
      "mysql",
      "pc",
      "sql"
    ]
  },
  {
    "name": "laptop-file",
    "label": "Laptop File",
    "unicode": "e51d",
    "terms": [
      "computer",
      "education",
      "laptop",
      "learning",
      "remote work"
    ]
  },
  {
    "name": "laptop-medical",
    "label": "Laptop Medical",
    "unicode": "f812",
    "terms": [
      "computer",
      "device",
      "ehr",
      "electronic health records",
      "history"
    ]
  },
  {
    "name": "lari-sign",
    "label": "Lari Sign",
    "unicode": "e1c8",
    "terms": [
      "Lari Sign",
      "currency"
    ]
  },
  {
    "name": "layer-group",
    "label": "Layer Group",
    "unicode": "f5fd",
    "terms": [
      "arrange",
      "category",
      "develop",
      "layers",
      "map",
      "platform",
      "stack"
    ]
  },
  {
    "name": "leaf",
    "label": "Leaf",
    "unicode": "f06c",
    "terms": [
      "eco",
      "flora",
      "nature",
      "plant",
      "vegan"
    ]
  },
  {
    "name": "left-long",
    "label": "Left Long",
    "unicode": "f30a",
    "terms": [
      "back",
      "long-arrow-left",
      "previous"
    ]
  },
  {
    "name": "left-right",
    "label": "Left Right",
    "unicode": "f337",
    "terms": [
      "arrow",
      "arrows-h",
      "expand",
      "horizontal",
      "landscape",
      "left-right arrow",
      "resize",
      "wide"
    ]
  },
  {
    "name": "lemon",
    "label": "Lemon",
    "unicode": "f094",
    "terms": [
      "citrus",
      "fruit",
      "lemon",
      "lemonade",
      "lime",
      "tart"
    ]
  },
  {
    "name": "less-than",
    "label": "Less Than",
    "unicode": "3c",
    "terms": [
      "Less-Than Sign",
      "arithmetic",
      "compare",
      "math"
    ]
  },
  {
    "name": "less-than-equal",
    "label": "Less Than Equal",
    "unicode": "f537",
    "terms": [
      "arithmetic",
      "compare",
      "math"
    ]
  },
  {
    "name": "life-ring",
    "label": "Life Ring",
    "unicode": "f1cd",
    "terms": [
      "coast guard",
      "help",
      "overboard",
      "save",
      "support"
    ]
  },
  {
    "name": "lightbulb",
    "label": "Lightbulb",
    "unicode": "f0eb",
    "terms": [
      "bulb",
      "bulb",
      "comic",
      "comic",
      "electric",
      "electric",
      "energy",
      "idea",
      "idea",
      "innovation",
      "inspiration",
      "inspiration",
      "light",
      "light bulb",
      "mechanical"
    ]
  },
  {
    "name": "lines-leaning",
    "label": "Lines Leaning",
    "unicode": "e51e",
    "terms": [
      "canted",
      "domino",
      "falling",
      "resilience",
      "resilient",
      "tipped"
    ]
  },
  {
    "name": "link",
    "label": "Link",
    "unicode": "f0c1",
    "terms": [
      "attach",
      "attachment",
      "chain",
      "connect",
      "lin",
      "link"
    ]
  },
  {
    "name": "link-slash",
    "label": "Link Slash",
    "unicode": "f127",
    "terms": [
      "attachment",
      "chain",
      "chain-broken",
      "disabled",
      "disconnect",
      "remove"
    ]
  },
  {
    "name": "lira-sign",
    "label": "Lira Sign",
    "unicode": "f195",
    "terms": [
      "Lira Sign",
      "currency"
    ]
  },
  {
    "name": "list",
    "label": "List",
    "unicode": "f03a",
    "terms": [
      "bullet",
      "category",
      "cheatsheet",
      "checklist",
      "completed",
      "done",
      "finished",
      "ol",
      "summary",
      "todo",
      "ul"
    ]
  },
  {
    "name": "list-check",
    "label": "List Check",
    "unicode": "f0ae",
    "terms": [
      "bullet",
      "cheatsheet",
      "checklist",
      "downloading",
      "downloads",
      "enable",
      "loading",
      "progress",
      "project management",
      "settings",
      "summary",
      "to do",
      "validate",
      "working"
    ]
  },
  {
    "name": "list-ol",
    "label": "List Ol",
    "unicode": "f0cb",
    "terms": [
      "cheatsheet",
      "checklist",
      "completed",
      "done",
      "finished",
      "numbers",
      "ol",
      "summary",
      "todo",
      "ul"
    ]
  },
  {
    "name": "list-ul",
    "label": "List Ul",
    "unicode": "f0ca",
    "terms": [
      "bullet",
      "cheatsheet",
      "checklist",
      "completed",
      "done",
      "finished",
      "ol",
      "summary",
      "survey",
      "todo",
      "ul"
    ]
  },
  {
    "name": "litecoin-sign",
    "label": "Litecoin Sign",
    "unicode": "e1d3",
    "terms": [
      "currency"
    ]
  },
  {
    "name": "location-arrow",
    "label": "Location Arrow",
    "unicode": "f124",
    "terms": [
      "address",
      "compass",
      "coordinate",
      "direction",
      "gps",
      "map",
      "navigation",
      "place"
    ]
  },
  {
    "name": "location-crosshairs",
    "label": "Location Crosshairs",
    "unicode": "f601",
    "terms": [
      "address",
      "coordinate",
      "direction",
      "gps",
      "location",
      "map",
      "navigation",
      "place",
      "where"
    ]
  },
  {
    "name": "location-dot",
    "label": "Location Dot",
    "unicode": "f3c5",
    "terms": [
      "address",
      "coordinates",
      "destination",
      "gps",
      "localize",
      "location",
      "map",
      "navigation",
      "paper",
      "pin",
      "place",
      "point of interest",
      "position",
      "route",
      "travel"
    ]
  },
  {
    "name": "location-pin",
    "label": "Location Pin",
    "unicode": "f041",
    "terms": [
      "address",
      "coordinates",
      "destination",
      "gps",
      "localize",
      "location",
      "map",
      "navigation",
      "paper",
      "pin",
      "place",
      "point of interest",
      "position",
      "route",
      "travel"
    ]
  },
  {
    "name": "location-pin-lock",
    "label": "Location Pin Lock",
    "unicode": "e51f",
    "terms": [
      "closed",
      "lockdown",
      "map",
      "padlock",
      "privacy",
      "quarantine"
    ]
  },
  {
    "name": "lock",
    "label": "Lock",
    "unicode": "f023",
    "terms": [
      "admin",
      "closed",
      "lock",
      "locked",
      "open",
      "padlock",
      "password",
      "privacy",
      "private",
      "protect",
      "security"
    ]
  },
  {
    "name": "lock-open",
    "label": "Lock Open",
    "unicode": "f3c1",
    "terms": [
      "admin",
      "lock",
      "open",
      "padlock",
      "password",
      "privacy",
      "private",
      "protect",
      "security",
      "unlock"
    ]
  },
  {
    "name": "locust",
    "label": "Locust",
    "unicode": "e520",
    "terms": [
      "horde",
      "infestation",
      "locust",
      "plague",
      "swarm"
    ]
  },
  {
    "name": "lungs",
    "label": "Lungs",
    "unicode": "f604",
    "terms": [
      "air",
      "breath",
      "covid-19",
      "exhalation",
      "inhalation",
      "lungs",
      "organ",
      "respiration",
      "respiratory"
    ]
  },
  {
    "name": "lungs-virus",
    "label": "Lungs Virus",
    "unicode": "e067",
    "terms": [
      "breath",
      "coronavirus",
      "covid-19",
      "flu",
      "infection",
      "pandemic",
      "respiratory",
      "sick"
    ]
  },
  {
    "name": "m",
    "label": "M",
    "unicode": "4d",
    "terms": [
      "Latin Capital Letter M",
      "Latin Small Letter M",
      "letter"
    ]
  },
  {
    "name": "magnet",
    "label": "Magnet",
    "unicode": "f076",
    "terms": [
      "Attract",
      "attraction",
      "horseshoe",
      "lodestone",
      "magnet",
      "magnetic",
      "tool"
    ]
  },
  {
    "name": "magnifying-glass",
    "label": "Magnifying Glass",
    "unicode": "f002",
    "terms": [
      "bigger",
      "enlarge",
      "equipment",
      "find",
      "glass",
      "inspection",
      "magnifier",
      "magnify",
      "magnifying",
      "magnifying glass tilted left",
      "preview",
      "search",
      "tool",
      "zoom"
    ]
  },
  {
    "name": "magnifying-glass-arrow-right",
    "label": "Magnifying Glass Arrow Right",
    "unicode": "e521",
    "terms": [
      "find",
      "magnifier",
      "next",
      "search"
    ]
  },
  {
    "name": "magnifying-glass-chart",
    "label": "Magnifying Glass Chart",
    "unicode": "e522",
    "terms": [
      "analysis",
      "chart",
      "data",
      "graph",
      "intelligence",
      "magnifier",
      "market",
      "revenue"
    ]
  },
  {
    "name": "magnifying-glass-dollar",
    "label": "Magnifying Glass Dollar",
    "unicode": "f688",
    "terms": [
      "bigger",
      "enlarge",
      "find",
      "magnifier",
      "magnify",
      "money",
      "preview",
      "zoom"
    ]
  },
  {
    "name": "magnifying-glass-location",
    "label": "Magnifying Glass Location",
    "unicode": "f689",
    "terms": [
      "bigger",
      "enlarge",
      "find",
      "magnifier",
      "magnify",
      "preview",
      "zoom"
    ]
  },
  {
    "name": "magnifying-glass-minus",
    "label": "Magnifying Glass Minus",
    "unicode": "f010",
    "terms": [
      "magnifier",
      "minify",
      "negative",
      "smaller",
      "zoom",
      "zoom out"
    ]
  },
  {
    "name": "magnifying-glass-plus",
    "label": "Magnifying Glass Plus",
    "unicode": "f00e",
    "terms": [
      "bigger",
      "enlarge",
      "magnifier",
      "magnify",
      "positive",
      "zoom",
      "zoom in"
    ]
  },
  {
    "name": "manat-sign",
    "label": "Manat Sign",
    "unicode": "e1d5",
    "terms": [
      "Manat Sign",
      "currency"
    ]
  },
  {
    "name": "map",
    "label": "Map",
    "unicode": "f279",
    "terms": [
      "address",
      "coordinates",
      "destination",
      "gps",
      "localize",
      "location",
      "map",
      "navigation",
      "paper",
      "pin",
      "place",
      "point of interest",
      "position",
      "route",
      "travel",
      "world",
      "world map"
    ]
  },
  {
    "name": "map-location",
    "label": "Map Location",
    "unicode": "f59f",
    "terms": [
      "address",
      "coordinates",
      "destination",
      "gps",
      "localize",
      "location",
      "map",
      "navigation",
      "paper",
      "pin",
      "place",
      "point of interest",
      "position",
      "route",
      "travel"
    ]
  },
  {
    "name": "map-location-dot",
    "label": "Map Location Dot",
    "unicode": "f5a0",
    "terms": [
      "address",
      "coordinates",
      "destination",
      "gps",
      "localize",
      "location",
      "map",
      "navigation",
      "paper",
      "pin",
      "place",
      "point of interest",
      "position",
      "route",
      "travel"
    ]
  },
  {
    "name": "map-pin",
    "label": "Map Pin",
    "unicode": "f276",
    "terms": [
      "address",
      "agree",
      "coordinates",
      "destination",
      "gps",
      "localize",
      "location",
      "map",
      "marker",
      "navigation",
      "pin",
      "place",
      "position",
      "pushpin",
      "round pushpin",
      "travel"
    ]
  },
  {
    "name": "marker",
    "label": "Marker",
    "unicode": "f5a1",
    "terms": [
      "design",
      "edit",
      "modify",
      "sharpie",
      "update",
      "write"
    ]
  },
  {
    "name": "mars",
    "label": "Mars",
    "unicode": "f222",
    "terms": [
      "gender",
      "male",
      "male sign",
      "man"
    ]
  },
  {
    "name": "mars-and-venus",
    "label": "Mars And Venus",
    "unicode": "f224",
    "terms": [
      "Male and Female Sign",
      "female",
      "gender",
      "intersex",
      "male",
      "transgender"
    ]
  },
  {
    "name": "mars-and-venus-burst",
    "label": "Mars And Venus Burst",
    "unicode": "e523",
    "terms": [
      "gender",
      "uer",
      "violence"
    ]
  },
  {
    "name": "mars-double",
    "label": "Mars Double",
    "unicode": "f227",
    "terms": [
      "Doubled Male Sign",
      "gay",
      "gender",
      "male",
      "men"
    ]
  },
  {
    "name": "mars-stroke",
    "label": "Mars Stroke",
    "unicode": "f229",
    "terms": [
      "Male with Stroke Sign",
      "gender",
      "transgender"
    ]
  },
  {
    "name": "mars-stroke-right",
    "label": "Mars Stroke Right",
    "unicode": "f22b",
    "terms": [
      "Horizontal Male with Stroke Sign",
      "gender"
    ]
  },
  {
    "name": "mars-stroke-up",
    "label": "Mars Stroke Up",
    "unicode": "f22a",
    "terms": [
      "Vertical Male with Stroke Sign",
      "gender"
    ]
  },
  {
    "name": "martini-glass",
    "label": "Martini Glass",
    "unicode": "f57b",
    "terms": [
      "alcohol",
      "bar",
      "beverage",
      "cocktail",
      "cocktail glass",
      "drink",
      "glass",
      "liquor"
    ]
  },
  {
    "name": "martini-glass-citrus",
    "label": "Martini Glass Citrus",
    "unicode": "f561",
    "terms": [
      "alcohol",
      "beverage",
      "drink",
      "gin",
      "glass",
      "margarita",
      "martini",
      "vodka"
    ]
  },
  {
    "name": "martini-glass-empty",
    "label": "Martini Glass Empty",
    "unicode": "f000",
    "terms": [
      "alcohol",
      "bar",
      "beverage",
      "drink",
      "liquor"
    ]
  },
  {
    "name": "mask",
    "label": "Mask",
    "unicode": "f6fa",
    "terms": [
      "carnivale",
      "costume",
      "disguise",
      "halloween",
      "secret",
      "super hero"
    ]
  },
  {
    "name": "mask-face",
    "label": "Mask Face",
    "unicode": "e1d7",
    "terms": [
      "breath",
      "coronavirus",
      "covid-19",
      "filter",
      "flu",
      "infection",
      "pandemic",
      "respirator",
      "virus"
    ]
  },
  {
    "name": "mask-ventilator",
    "label": "Mask Ventilator",
    "unicode": "e524",
    "terms": [
      "breath",
      "gas",
      "mask",
      "oxygen",
      "respirator",
      "ventilator"
    ]
  },
  {
    "name": "masks-theater",
    "label": "Masks Theater",
    "unicode": "f630",
    "terms": [
      "art",
      "comedy",
      "mask",
      "perform",
      "performing",
      "performing arts",
      "theater",
      "theatre",
      "tragedy"
    ]
  },
  {
    "name": "mattress-pillow",
    "label": "Mattress Pillow",
    "unicode": "e525",
    "terms": [
      "air mattress",
      "mattress",
      "pillow",
      "rest",
      "sleep"
    ]
  },
  {
    "name": "maximize",
    "label": "Maximize",
    "unicode": "f31e",
    "terms": [
      "arrows",
      "bigger",
      "enlarge",
      "expand",
      "fullscreen",
      "maximize",
      "resize",
      "resize",
      "scale",
      "size"
    ]
  },
  {
    "name": "medal",
    "label": "Medal",
    "unicode": "f5a2",
    "terms": [
      "award",
      "guarantee",
      "medal",
      "quality",
      "ribbon",
      "sports medal",
      "star",
      "trophy",
      "warranty"
    ]
  },
  {
    "name": "memory",
    "label": "Memory",
    "unicode": "f538",
    "terms": [
      "DIMM",
      "RAM",
      "hardware",
      "storage",
      "technology"
    ]
  },
  {
    "name": "menorah",
    "label": "Menorah",
    "unicode": "f676",
    "terms": [
      "candle",
      "hanukkah",
      "jewish",
      "judaism",
      "light"
    ]
  },
  {
    "name": "mercury",
    "label": "Mercury",
    "unicode": "f223",
    "terms": [
      "Mercury",
      "gender",
      "hybrid",
      "transgender"
    ]
  },
  {
    "name": "message",
    "label": "Message",
    "unicode": "f27a",
    "terms": [
      "answer",
      "bubble",
      "chat",
      "commenting",
      "conversation",
      "conversation",
      "discussion",
      "feedback",
      "message",
      "note",
      "notification",
      "sms",
      "speech",
      "talk",
      "talking",
      "texting"
    ]
  },
  {
    "name": "meteor",
    "label": "Meteor",
    "unicode": "f753",
    "terms": [
      "armageddon",
      "asteroid",
      "comet",
      "shooting star",
      "space"
    ]
  },
  {
    "name": "microchip",
    "label": "Microchip",
    "unicode": "f2db",
    "terms": [
      "cpu",
      "hardware",
      "processor",
      "technology"
    ]
  },
  {
    "name": "microphone",
    "label": "Microphone",
    "unicode": "f130",
    "terms": [
      "address",
      "audio",
      "information",
      "podcast",
      "public",
      "record",
      "sing",
      "sound",
      "talking",
      "voice"
    ]
  },
  {
    "name": "microphone-lines",
    "label": "Microphone Lines",
    "unicode": "f3c9",
    "terms": [
      "audio",
      "mic",
      "microphone",
      "music",
      "podcast",
      "record",
      "sing",
      "sound",
      "studio",
      "studio microphone",
      "talking",
      "voice"
    ]
  },
  {
    "name": "microphone-lines-slash",
    "label": "Microphone Lines Slash",
    "unicode": "f539",
    "terms": [
      "audio",
      "disable",
      "disabled",
      "disconnect",
      "disconnect",
      "mute",
      "podcast",
      "record",
      "sing",
      "sound",
      "voice"
    ]
  },
  {
    "name": "microphone-slash",
    "label": "Microphone Slash",
    "unicode": "f131",
    "terms": [
      "audio",
      "disable",
      "disabled",
      "mute",
      "podcast",
      "record",
      "sing",
      "sound",
      "voice"
    ]
  },
  {
    "name": "microscope",
    "label": "Microscope",
    "unicode": "f610",
    "terms": [
      "covid-19",
      "electron",
      "knowledge",
      "lens",
      "microscope",
      "optics",
      "science",
      "shrink",
      "testing",
      "tool"
    ]
  },
  {
    "name": "mill-sign",
    "label": "Mill Sign",
    "unicode": "e1ed",
    "terms": [
      "Mill Sign",
      "currency"
    ]
  },
  {
    "name": "minimize",
    "label": "Minimize",
    "unicode": "f78c",
    "terms": [
      "collapse",
      "fullscreen",
      "minimize",
      "move",
      "resize",
      "shrink",
      "smaller"
    ]
  },
  {
    "name": "minus",
    "label": "Minus",
    "unicode": "f068",
    "terms": [
      "En Dash",
      "Minus Sign",
      "collapse",
      "delete",
      "hide",
      "math",
      "minify",
      "minus",
      "negative",
      "remove",
      "sign",
      "trash",
      "−"
    ]
  },
  {
    "name": "mitten",
    "label": "Mitten",
    "unicode": "f7b5",
    "terms": [
      "clothing",
      "cold",
      "glove",
      "hands",
      "knitted",
      "seasonal",
      "warmth"
    ]
  },
  {
    "name": "mobile",
    "label": "Mobile",
    "unicode": "f3ce",
    "terms": [
      "android",
      "call",
      "cell",
      "cell phone",
      "device",
      "mobile",
      "mobile phone",
      "number",
      "phone",
      "screen",
      "telephone",
      "text"
    ]
  },
  {
    "name": "mobile-button",
    "label": "Mobile Button",
    "unicode": "f10b",
    "terms": [
      "apple",
      "call",
      "cell phone",
      "device",
      "iphone",
      "number",
      "screen",
      "telephone"
    ]
  },
  {
    "name": "mobile-retro",
    "label": "Mobile Retro",
    "unicode": "e527",
    "terms": [
      "cellphone",
      "cellular",
      "phone"
    ]
  },
  {
    "name": "mobile-screen",
    "label": "Mobile Screen",
    "unicode": "f3cf",
    "terms": [
      "android",
      "call",
      "cell phone",
      "device",
      "number",
      "screen",
      "telephone",
      "text"
    ]
  },
  {
    "name": "mobile-screen-button",
    "label": "Mobile Screen Button",
    "unicode": "f3cd",
    "terms": [
      "apple",
      "call",
      "cell phone",
      "device",
      "iphone",
      "number",
      "screen",
      "telephone"
    ]
  },
  {
    "name": "money-bill",
    "label": "Money Bill",
    "unicode": "f0d6",
    "terms": [
      "buy",
      "cash",
      "checkout",
      "coupon",
      "investment",
      "money",
      "payment",
      "premium",
      "price",
      "purchase",
      "revenue",
      "salary"
    ]
  },
  {
    "name": "money-bill-1",
    "label": "Money Bill 1",
    "unicode": "f3d1",
    "terms": [
      "buy",
      "cash",
      "checkout",
      "money",
      "payment",
      "premium",
      "price",
      "purchase",
      "salary"
    ]
  },
  {
    "name": "money-bill-1-wave",
    "label": "Money Bill 1 Wave",
    "unicode": "f53b",
    "terms": [
      "buy",
      "cash",
      "checkout",
      "money",
      "payment",
      "premium",
      "price",
      "purchase",
      "salary"
    ]
  },
  {
    "name": "money-bill-transfer",
    "label": "Money Bill Transfer",
    "unicode": "e528",
    "terms": [
      "bank",
      "conversion",
      "deposit",
      "investment",
      "money",
      "salary",
      "transfer",
      "withdrawal"
    ]
  },
  {
    "name": "money-bill-trend-up",
    "label": "Money Bill Trend Up",
    "unicode": "e529",
    "terms": [
      "bank",
      "bonds",
      "inflation",
      "investment",
      "market",
      "revenue",
      "salary",
      "stocks",
      "trade"
    ]
  },
  {
    "name": "money-bill-wave",
    "label": "Money Bill Wave",
    "unicode": "f53a",
    "terms": [
      "buy",
      "cash",
      "checkout",
      "money",
      "payment",
      "premium",
      "price",
      "purchase",
      "salary"
    ]
  },
  {
    "name": "money-bill-wheat",
    "label": "Money Bill Wheat",
    "unicode": "e52a",
    "terms": [
      "agribusiness",
      "agriculture",
      "farming",
      "food",
      "investment",
      "livelihood",
      "subsidy"
    ]
  },
  {
    "name": "money-bills",
    "label": "Money Bills",
    "unicode": "e1f3",
    "terms": [
      "atm",
      "cash",
      "investment",
      "money",
      "moolah",
      "premium",
      "revenue",
      "salary"
    ]
  },
  {
    "name": "money-check",
    "label": "Money Check",
    "unicode": "f53c",
    "terms": [
      "bank check",
      "buy",
      "checkout",
      "cheque",
      "money",
      "payment",
      "price",
      "purchase",
      "salary"
    ]
  },
  {
    "name": "money-check-dollar",
    "label": "Money Check Dollar",
    "unicode": "f53d",
    "terms": [
      "bank check",
      "buy",
      "checkout",
      "cheque",
      "money",
      "payment",
      "price",
      "purchase",
      "salary"
    ]
  },
  {
    "name": "monument",
    "label": "Monument",
    "unicode": "f5a6",
    "terms": [
      "building",
      "historic",
      "landmark",
      "memorable"
    ]
  },
  {
    "name": "moon",
    "label": "Moon",
    "unicode": "f186",
    "terms": [
      "Power Sleep Symbol",
      "contrast",
      "crescent",
      "crescent moon",
      "dark",
      "lunar",
      "moon",
      "night"
    ]
  },
  {
    "name": "mortar-pestle",
    "label": "Mortar Pestle",
    "unicode": "f5a7",
    "terms": [
      "crush",
      "culinary",
      "grind",
      "medical",
      "mix",
      "pharmacy",
      "prescription",
      "spices"
    ]
  },
  {
    "name": "mosque",
    "label": "Mosque",
    "unicode": "f678",
    "terms": [
      "Muslim",
      "building",
      "islam",
      "landmark",
      "mosque",
      "muslim",
      "religion"
    ]
  },
  {
    "name": "mosquito",
    "label": "Mosquito",
    "unicode": "e52b",
    "terms": [
      "bite",
      "bug",
      "mosquito",
      "west nile"
    ]
  },
  {
    "name": "mosquito-net",
    "label": "Mosquito Net",
    "unicode": "e52c",
    "terms": [
      "bite",
      "malaria",
      "mosquito",
      "net"
    ]
  },
  {
    "name": "motorcycle",
    "label": "Motorcycle",
    "unicode": "f21c",
    "terms": [
      "bike",
      "machine",
      "motorcycle",
      "racing",
      "transportation",
      "vehicle"
    ]
  },
  {
    "name": "mound",
    "label": "Mound",
    "unicode": "e52d",
    "terms": [
      "barrier",
      "hill",
      "pitcher",
      "speedbump"
    ]
  },
  {
    "name": "mountain",
    "label": "Mountain",
    "unicode": "f6fc",
    "terms": [
      "cold",
      "glacier",
      "hiking",
      "hill",
      "landscape",
      "mountain",
      "snow",
      "snow-capped mountain",
      "travel",
      "view"
    ]
  },
  {
    "name": "mountain-city",
    "label": "Mountain City",
    "unicode": "e52e",
    "terms": [
      "location",
      "rural",
      "urban"
    ]
  },
  {
    "name": "mountain-sun",
    "label": "Mountain Sun",
    "unicode": "e52f",
    "terms": [
      "country",
      "hiking",
      "landscape",
      "rural",
      "travel",
      "view"
    ]
  },
  {
    "name": "mug-hot",
    "label": "Mug Hot",
    "unicode": "f7b6",
    "terms": [
      "beverage",
      "caliente",
      "cocoa",
      "coffee",
      "cup",
      "drink",
      "holiday",
      "hot",
      "hot beverage",
      "hot chocolate",
      "steam",
      "steaming",
      "tea",
      "warmth"
    ]
  },
  {
    "name": "mug-saucer",
    "label": "Mug Saucer",
    "unicode": "f0f4",
    "terms": [
      "beverage",
      "breakfast",
      "cafe",
      "drink",
      "fall",
      "morning",
      "mug",
      "seasonal",
      "tea"
    ]
  },
  {
    "name": "music",
    "label": "Music",
    "unicode": "f001",
    "terms": [
      "lyrics",
      "melody",
      "music",
      "musical note",
      "note",
      "sing",
      "sound"
    ]
  },
  {
    "name": "n",
    "label": "N",
    "unicode": "4e",
    "terms": [
      "Latin Capital Letter N",
      "Latin Small Letter N",
      "letter",
      "nay",
      "no"
    ]
  },
  {
    "name": "naira-sign",
    "label": "Naira Sign",
    "unicode": "e1f6",
    "terms": [
      "Naira Sign",
      "currency"
    ]
  },
  {
    "name": "network-wired",
    "label": "Network Wired",
    "unicode": "f6ff",
    "terms": [
      "computer",
      "connect",
      "ethernet",
      "internet",
      "intranet"
    ]
  },
  {
    "name": "neuter",
    "label": "Neuter",
    "unicode": "f22c",
    "terms": [
      "Neuter",
      "gender"
    ]
  },
  {
    "name": "newspaper",
    "label": "Newspaper",
    "unicode": "f1ea",
    "terms": [
      "article",
      "editorial",
      "headline",
      "journal",
      "journalism",
      "news",
      "newsletter",
      "newspaper",
      "paper",
      "press"
    ]
  },
  {
    "name": "not-equal",
    "label": "Not Equal",
    "unicode": "f53e",
    "terms": [
      "arithmetic",
      "compare",
      "math"
    ]
  },
  {
    "name": "notdef",
    "label": "Notdef",
    "unicode": "e1fe",
    "terms": [
      "404",
      "close",
      "missing",
      "not found"
    ]
  },
  {
    "name": "note-sticky",
    "label": "Note Sticky",
    "unicode": "f249",
    "terms": [
      "message",
      "note",
      "paper",
      "reminder",
      "sticker"
    ]
  },
  {
    "name": "notes-medical",
    "label": "Notes Medical",
    "unicode": "f481",
    "terms": [
      "clipboard",
      "doctor",
      "ehr",
      "health",
      "history",
      "records"
    ]
  },
  {
    "name": "o",
    "label": "O",
    "unicode": "4f",
    "terms": [
      "Latin Capital Letter O",
      "Latin Small Letter O",
      "letter"
    ]
  },
  {
    "name": "object-group",
    "label": "Object Group",
    "unicode": "f247",
    "terms": [
      "combine",
      "copy",
      "design",
      "merge",
      "select"
    ]
  },
  {
    "name": "object-ungroup",
    "label": "Object Ungroup",
    "unicode": "f248",
    "terms": [
      "copy",
      "design",
      "merge",
      "select",
      "separate"
    ]
  },
  {
    "name": "oil-can",
    "label": "Oil Can",
    "unicode": "f613",
    "terms": [
      "auto",
      "crude",
      "gasoline",
      "grease",
      "lubricate",
      "petroleum"
    ]
  },
  {
    "name": "oil-well",
    "label": "Oil Well",
    "unicode": "e532",
    "terms": [
      "drill",
      "oil",
      "rig"
    ]
  },
  {
    "name": "om",
    "label": "Om",
    "unicode": "f679",
    "terms": [
      "Hindu",
      "buddhism",
      "hinduism",
      "jainism",
      "mantra",
      "om",
      "religion"
    ]
  },
  {
    "name": "otter",
    "label": "Otter",
    "unicode": "f700",
    "terms": [
      "animal",
      "badger",
      "fauna",
      "fishing",
      "fur",
      "mammal",
      "marten",
      "otter",
      "playful"
    ]
  },
  {
    "name": "outdent",
    "label": "Outdent",
    "unicode": "f03b",
    "terms": [
      "align",
      "justify",
      "paragraph",
      "tab"
    ]
  },
  {
    "name": "p",
    "label": "P",
    "unicode": "50",
    "terms": [
      "Latin Capital Letter P",
      "Latin Small Letter P",
      "letter"
    ]
  },
  {
    "name": "pager",
    "label": "Pager",
    "unicode": "f815",
    "terms": [
      "beeper",
      "cell phone",
      "communication",
      "page",
      "pager"
    ]
  },
  {
    "name": "paint-roller",
    "label": "Paint Roller",
    "unicode": "f5aa",
    "terms": [
      "acrylic",
      "art",
      "brush",
      "color",
      "fill",
      "maintenance",
      "paint",
      "pigment",
      "watercolor"
    ]
  },
  {
    "name": "paintbrush",
    "label": "Paintbrush",
    "unicode": "f1fc",
    "terms": [
      "acrylic",
      "art",
      "brush",
      "color",
      "fill",
      "modify",
      "paint",
      "paintbrush",
      "painting",
      "pigment",
      "watercolor"
    ]
  },
  {
    "name": "palette",
    "label": "Palette",
    "unicode": "f53f",
    "terms": [
      "acrylic",
      "art",
      "artist palette",
      "brush",
      "color",
      "fill",
      "museum",
      "paint",
      "painting",
      "palette",
      "pigment",
      "watercolor"
    ]
  },
  {
    "name": "pallet",
    "label": "Pallet",
    "unicode": "f482",
    "terms": [
      "archive",
      "box",
      "inventory",
      "shipping",
      "warehouse"
    ]
  },
  {
    "name": "panorama",
    "label": "Panorama",
    "unicode": "e209",
    "terms": [
      "image",
      "img",
      "landscape",
      "photo",
      "wide"
    ]
  },
  {
    "name": "paper-plane",
    "label": "Paper Plane",
    "unicode": "f1d8",
    "terms": [
      "air",
      "float",
      "fold",
      "mail",
      "paper",
      "send"
    ]
  },
  {
    "name": "paperclip",
    "label": "Paperclip",
    "unicode": "f0c6",
    "terms": [
      "attach",
      "attachment",
      "connect",
      "link",
      "papercli",
      "paperclip"
    ]
  },
  {
    "name": "parachute-box",
    "label": "Parachute Box",
    "unicode": "f4cd",
    "terms": [
      "aid",
      "assistance",
      "goods",
      "relief",
      "rescue",
      "supplies"
    ]
  },
  {
    "name": "paragraph",
    "label": "Paragraph",
    "unicode": "f1dd",
    "terms": [
      "Pilcrow Sign",
      "edit",
      "format",
      "text",
      "writing"
    ]
  },
  {
    "name": "passport",
    "label": "Passport",
    "unicode": "f5ab",
    "terms": [
      "document",
      "id",
      "identification",
      "issued",
      "travel"
    ]
  },
  {
    "name": "paste",
    "label": "Paste",
    "unicode": "f0ea",
    "terms": [
      "clipboard",
      "copy",
      "document",
      "paper"
    ]
  },
  {
    "name": "pause",
    "label": "Pause",
    "unicode": "f04c",
    "terms": [
      "bar",
      "double",
      "hold",
      "pause",
      "pause button",
      "vertical",
      "wait"
    ]
  },
  {
    "name": "paw",
    "label": "Paw",
    "unicode": "f1b0",
    "terms": [
      "animal",
      "cat",
      "dog",
      "pet",
      "print"
    ]
  },
  {
    "name": "peace",
    "label": "Peace",
    "unicode": "f67c",
    "terms": [
      "peace",
      "peace symbol",
      "serenity",
      "tranquility",
      "truce",
      "war"
    ]
  },
  {
    "name": "pen",
    "label": "Pen",
    "unicode": "f304",
    "terms": [
      "ballpoint",
      "design",
      "edit",
      "modify",
      "pen",
      "update",
      "write"
    ]
  },
  {
    "name": "pen-clip",
    "label": "Pen Clip",
    "unicode": "f305",
    "terms": [
      "design",
      "edit",
      "modify",
      "update",
      "write"
    ]
  },
  {
    "name": "pen-fancy",
    "label": "Pen Fancy",
    "unicode": "f5ac",
    "terms": [
      "black nib",
      "design",
      "edit",
      "fountain",
      "fountain pen",
      "modify",
      "nib",
      "pen",
      "update",
      "write"
    ]
  },
  {
    "name": "pen-nib",
    "label": "Pen Nib",
    "unicode": "f5ad",
    "terms": [
      "design",
      "edit",
      "fountain pen",
      "modify",
      "update",
      "write"
    ]
  },
  {
    "name": "pen-ruler",
    "label": "Pen Ruler",
    "unicode": "f5ae",
    "terms": [
      "design",
      "draft",
      "draw",
      "maintenance",
      "modify",
      "pencil"
    ]
  },
  {
    "name": "pen-to-square",
    "label": "Pen To Square",
    "unicode": "f044",
    "terms": [
      "edit",
      "modify",
      "pen",
      "pencil",
      "update",
      "write"
    ]
  },
  {
    "name": "pencil",
    "label": "Pencil",
    "unicode": "f303",
    "terms": [
      "Lower Left Pencil",
      "design",
      "draw",
      "edit",
      "lead",
      "maintenance",
      "modify",
      "pencil",
      "update",
      "write"
    ]
  },
  {
    "name": "people-arrows",
    "label": "People Arrows",
    "unicode": "e068",
    "terms": [
      "conversation",
      "discussion",
      "distance",
      "insert",
      "isolation",
      "separate",
      "social distancing",
      "talk",
      "talking",
      "together",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "people-carry-box",
    "label": "People Carry Box",
    "unicode": "f4ce",
    "terms": [
      "together",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "people-group",
    "label": "People Group",
    "unicode": "e533",
    "terms": [
      "crowd",
      "family",
      "group",
      "team",
      "together",
      "uer"
    ]
  },
  {
    "name": "people-line",
    "label": "People Line",
    "unicode": "e534",
    "terms": [
      "crowd",
      "group",
      "need",
      "together",
      "uer"
    ]
  },
  {
    "name": "people-pulling",
    "label": "People Pulling",
    "unicode": "e535",
    "terms": [
      "forced return",
      "together",
      "uer",
      "yanking"
    ]
  },
  {
    "name": "people-robbery",
    "label": "People Robbery",
    "unicode": "e536",
    "terms": [
      "criminal",
      "hands up",
      "looting",
      "robbery",
      "steal",
      "uer"
    ]
  },
  {
    "name": "people-roof",
    "label": "People Roof",
    "unicode": "e537",
    "terms": [
      "crowd",
      "family",
      "group",
      "manage",
      "people",
      "safe",
      "shelter",
      "together",
      "uer"
    ]
  },
  {
    "name": "pepper-hot",
    "label": "Pepper Hot",
    "unicode": "f816",
    "terms": [
      "buffalo wings",
      "capsicum",
      "chili",
      "chilli",
      "habanero",
      "hot",
      "hot pepper",
      "jalapeno",
      "mexican",
      "pepper",
      "spicy",
      "tabasco",
      "vegetable"
    ]
  },
  {
    "name": "percent",
    "label": "Percent",
    "unicode": "25",
    "terms": [
      "Percent Sign",
      "discount",
      "fraction",
      "proportion",
      "rate",
      "ratio"
    ]
  },
  {
    "name": "person",
    "label": "Person",
    "unicode": "f183",
    "terms": [
      "default",
      "man",
      "person standing",
      "stand",
      "standing",
      "uer",
      "woman"
    ]
  },
  {
    "name": "person-arrow-down-to-line",
    "label": "Person Arrow Down To Line",
    "unicode": "e538",
    "terms": [
      "ground",
      "indigenous",
      "insert",
      "native",
      "uer"
    ]
  },
  {
    "name": "person-arrow-up-from-line",
    "label": "Person Arrow Up From Line",
    "unicode": "e539",
    "terms": [
      "population",
      "rise",
      "uer",
      "upgrade"
    ]
  },
  {
    "name": "person-biking",
    "label": "Person Biking",
    "unicode": "f84a",
    "terms": [
      "bicycle",
      "bike",
      "biking",
      "cyclist",
      "pedal",
      "person biking",
      "summer",
      "uer",
      "wheel"
    ]
  },
  {
    "name": "person-booth",
    "label": "Person Booth",
    "unicode": "f756",
    "terms": [
      "changing room",
      "curtain",
      "uer",
      "vote",
      "voting"
    ]
  },
  {
    "name": "person-breastfeeding",
    "label": "Person Breastfeeding",
    "unicode": "e53a",
    "terms": [
      "baby",
      "child",
      "infant",
      "mother",
      "nutrition",
      "parent",
      "sustenance",
      "uer"
    ]
  },
  {
    "name": "person-burst",
    "label": "Person Burst",
    "unicode": "e53b",
    "terms": [
      "abuse",
      "accident",
      "crash",
      "explode",
      "uer",
      "violence"
    ]
  },
  {
    "name": "person-cane",
    "label": "Person Cane",
    "unicode": "e53c",
    "terms": [
      "aging",
      "cane",
      "elderly",
      "old",
      "staff",
      "uer"
    ]
  },
  {
    "name": "person-chalkboard",
    "label": "Person Chalkboard",
    "unicode": "e53d",
    "terms": [
      "blackboard",
      "instructor",
      "keynote",
      "lesson",
      "presentation",
      "teacher",
      "uer"
    ]
  },
  {
    "name": "person-circle-check",
    "label": "Person Circle Check",
    "unicode": "e53e",
    "terms": [
      "approved",
      "enable",
      "not affected",
      "ok",
      "okay",
      "uer",
      "validate",
      "working"
    ]
  },
  {
    "name": "person-circle-exclamation",
    "label": "Person Circle Exclamation",
    "unicode": "e53f",
    "terms": [
      "affected",
      "alert",
      "failed",
      "lost",
      "missing",
      "uer"
    ]
  },
  {
    "name": "person-circle-minus",
    "label": "Person Circle Minus",
    "unicode": "e540",
    "terms": [
      "delete",
      "remove",
      "uer"
    ]
  },
  {
    "name": "person-circle-plus",
    "label": "Person Circle Plus",
    "unicode": "e541",
    "terms": [
      "add",
      "follow",
      "found",
      "uer"
    ]
  },
  {
    "name": "person-circle-question",
    "label": "Person Circle Question",
    "unicode": "e542",
    "terms": [
      "faq",
      "lost",
      "missing",
      "request",
      "uer"
    ]
  },
  {
    "name": "person-circle-xmark",
    "label": "Person Circle Xmark",
    "unicode": "e543",
    "terms": [
      "dead",
      "removed",
      "uer",
      "uncheck"
    ]
  },
  {
    "name": "person-digging",
    "label": "Person Digging",
    "unicode": "f85e",
    "terms": [
      "bury",
      "construction",
      "debris",
      "dig",
      "maintenance",
      "men at work",
      "uer"
    ]
  },
  {
    "name": "person-dots-from-line",
    "label": "Person Dots From Line",
    "unicode": "f470",
    "terms": [
      "allergy",
      "diagnosis",
      "uer"
    ]
  },
  {
    "name": "person-dress",
    "label": "Person Dress",
    "unicode": "f182",
    "terms": [
      "man",
      "skirt",
      "uer",
      "woman"
    ]
  },
  {
    "name": "person-dress-burst",
    "label": "Person Dress Burst",
    "unicode": "e544",
    "terms": [
      "abuse",
      "accident",
      "crash",
      "explode",
      "uer",
      "violence"
    ]
  },
  {
    "name": "person-drowning",
    "label": "Person Drowning",
    "unicode": "e545",
    "terms": [
      "drown",
      "emergency",
      "swim",
      "uer"
    ]
  },
  {
    "name": "person-falling",
    "label": "Person Falling",
    "unicode": "e546",
    "terms": [
      "accident",
      "fall",
      "trip",
      "uer"
    ]
  },
  {
    "name": "person-falling-burst",
    "label": "Person Falling Burst",
    "unicode": "e547",
    "terms": [
      "accident",
      "crash",
      "death",
      "fall",
      "homicide",
      "murder",
      "uer"
    ]
  },
  {
    "name": "person-half-dress",
    "label": "Person Half Dress",
    "unicode": "e548",
    "terms": [
      "gender",
      "man",
      "restroom",
      "transgender",
      "uer",
      "woman"
    ]
  },
  {
    "name": "person-harassing",
    "label": "Person Harassing",
    "unicode": "e549",
    "terms": [
      "abuse",
      "scream",
      "shame",
      "shout",
      "uer",
      "yell"
    ]
  },
  {
    "name": "person-hiking",
    "label": "Person Hiking",
    "unicode": "f6ec",
    "terms": [
      "autumn",
      "fall",
      "follow",
      "hike",
      "mountain",
      "outdoors",
      "summer",
      "uer",
      "walk"
    ]
  },
  {
    "name": "person-military-pointing",
    "label": "Person Military Pointing",
    "unicode": "e54a",
    "terms": [
      "army",
      "customs",
      "guard",
      "uer"
    ]
  },
  {
    "name": "person-military-rifle",
    "label": "Person Military Rifle",
    "unicode": "e54b",
    "terms": [
      "armed forces",
      "army",
      "military",
      "rifle",
      "uer",
      "war"
    ]
  },
  {
    "name": "person-military-to-person",
    "label": "Person Military To Person",
    "unicode": "e54c",
    "terms": [
      "civilian",
      "coordination",
      "military",
      "uer"
    ]
  },
  {
    "name": "person-praying",
    "label": "Person Praying",
    "unicode": "f683",
    "terms": [
      "kneel",
      "place of worship",
      "religion",
      "thank",
      "uer",
      "worship"
    ]
  },
  {
    "name": "person-pregnant",
    "label": "Person Pregnant",
    "unicode": "e31e",
    "terms": [
      "baby",
      "birth",
      "child",
      "parent",
      "pregnant",
      "pregnant woman",
      "uer",
      "woman"
    ]
  },
  {
    "name": "person-rays",
    "label": "Person Rays",
    "unicode": "e54d",
    "terms": [
      "affected",
      "focus",
      "shine",
      "uer"
    ]
  },
  {
    "name": "person-rifle",
    "label": "Person Rifle",
    "unicode": "e54e",
    "terms": [
      "army",
      "combatant",
      "gun",
      "military",
      "rifle",
      "uer",
      "war"
    ]
  },
  {
    "name": "person-running",
    "label": "Person Running",
    "unicode": "f70c",
    "terms": [
      "exit",
      "flee",
      "follow",
      "marathon",
      "person running",
      "race",
      "running",
      "uer",
      "workout"
    ]
  },
  {
    "name": "person-shelter",
    "label": "Person Shelter",
    "unicode": "e54f",
    "terms": [
      "house",
      "inside",
      "roof",
      "safe",
      "safety",
      "shelter",
      "uer"
    ]
  },
  {
    "name": "person-skating",
    "label": "Person Skating",
    "unicode": "f7c5",
    "terms": [
      "figure skating",
      "ice",
      "olympics",
      "rink",
      "skate",
      "uer",
      "winter"
    ]
  },
  {
    "name": "person-skiing",
    "label": "Person Skiing",
    "unicode": "f7c9",
    "terms": [
      "downhill",
      "olympics",
      "ski",
      "skier",
      "snow",
      "uer",
      "winter"
    ]
  },
  {
    "name": "person-skiing-nordic",
    "label": "Person Skiing Nordic",
    "unicode": "f7ca",
    "terms": [
      "cross country",
      "olympics",
      "uer",
      "winter"
    ]
  },
  {
    "name": "person-snowboarding",
    "label": "Person Snowboarding",
    "unicode": "f7ce",
    "terms": [
      "olympics",
      "ski",
      "snow",
      "snowboard",
      "snowboarder",
      "uer",
      "winter"
    ]
  },
  {
    "name": "person-swimming",
    "label": "Person Swimming",
    "unicode": "f5c4",
    "terms": [
      "ocean",
      "person swimming",
      "pool",
      "sea",
      "swim",
      "uer",
      "water"
    ]
  },
  {
    "name": "person-through-window",
    "label": "Person Through Window",
    "unicode": "e5a9",
    "terms": [
      "door",
      "exit",
      "forced entry",
      "leave",
      "robbery",
      "steal",
      "uer",
      "window"
    ]
  },
  {
    "name": "person-walking",
    "label": "Person Walking",
    "unicode": "f554",
    "terms": [
      "crosswalk",
      "exercise",
      "follow",
      "hike",
      "move",
      "person walking",
      "uer",
      "walk",
      "walking",
      "workout"
    ]
  },
  {
    "name": "person-walking-arrow-loop-left",
    "label": "Person Walking Arrow Loop Left",
    "unicode": "e551",
    "terms": [
      "follow",
      "population return",
      "return",
      "uer"
    ]
  },
  {
    "name": "person-walking-arrow-right",
    "label": "Person Walking Arrow Right",
    "unicode": "e552",
    "terms": [
      "exit",
      "follow",
      "internally displaced",
      "leave",
      "refugee",
      "uer"
    ]
  },
  {
    "name": "person-walking-dashed-line-arrow-right",
    "label": "Person Walking Dashed Line Arrow Right",
    "unicode": "e553",
    "terms": [
      "exit",
      "follow",
      "refugee",
      "uer"
    ]
  },
  {
    "name": "person-walking-luggage",
    "label": "Person Walking Luggage",
    "unicode": "e554",
    "terms": [
      "bag",
      "baggage",
      "briefcase",
      "carry-on",
      "deployment",
      "follow",
      "rolling",
      "uer"
    ]
  },
  {
    "name": "person-walking-with-cane",
    "label": "Person Walking With Cane",
    "unicode": "f29d",
    "terms": [
      "blind",
      "cane",
      "follow",
      "uer"
    ]
  },
  {
    "name": "peseta-sign",
    "label": "Peseta Sign",
    "unicode": "e221",
    "terms": [
      "Peseta Sign",
      "currency"
    ]
  },
  {
    "name": "peso-sign",
    "label": "Peso Sign",
    "unicode": "e222",
    "terms": [
      "Peso Sign",
      "currency"
    ]
  },
  {
    "name": "phone",
    "label": "Phone",
    "unicode": "f095",
    "terms": [
      "Left Hand Telephone Receiver",
      "call",
      "earphone",
      "number",
      "phone",
      "receiver",
      "support",
      "talking",
      "telephone",
      "telephone receiver",
      "voice"
    ]
  },
  {
    "name": "phone-flip",
    "label": "Phone Flip",
    "unicode": "f879",
    "terms": [
      "Right Hand Telephone Receiver",
      "call",
      "earphone",
      "number",
      "support",
      "telephone",
      "voice"
    ]
  },
  {
    "name": "phone-slash",
    "label": "Phone Slash",
    "unicode": "f3dd",
    "terms": [
      "call",
      "cancel",
      "disabled",
      "disconnect",
      "earphone",
      "mute",
      "number",
      "support",
      "telephone",
      "voice"
    ]
  },
  {
    "name": "phone-volume",
    "label": "Phone Volume",
    "unicode": "f2a0",
    "terms": [
      "call",
      "earphone",
      "number",
      "ring",
      "ringing",
      "sound",
      "support",
      "talking",
      "telephone",
      "voice",
      "volume-control-phone"
    ]
  },
  {
    "name": "photo-film",
    "label": "Photo Film",
    "unicode": "f87c",
    "terms": [
      "av",
      "film",
      "image",
      "library",
      "media"
    ]
  },
  {
    "name": "piggy-bank",
    "label": "Piggy Bank",
    "unicode": "f4d3",
    "terms": [
      "bank",
      "salary",
      "save",
      "savings"
    ]
  },
  {
    "name": "pills",
    "label": "Pills",
    "unicode": "f484",
    "terms": [
      "drugs",
      "medicine",
      "prescription",
      "tablets"
    ]
  },
  {
    "name": "pizza-slice",
    "label": "Pizza Slice",
    "unicode": "f818",
    "terms": [
      "cheese",
      "chicago",
      "italian",
      "mozzarella",
      "new york",
      "pepperoni",
      "pie",
      "slice",
      "teenage mutant ninja turtles",
      "tomato"
    ]
  },
  {
    "name": "place-of-worship",
    "label": "Place Of Worship",
    "unicode": "f67f",
    "terms": [
      "building",
      "church",
      "holy",
      "mosque",
      "synagogue"
    ]
  },
  {
    "name": "plane",
    "label": "Plane",
    "unicode": "f072",
    "terms": [
      "airplane",
      "airport",
      "destination",
      "fly",
      "location",
      "mode",
      "travel",
      "trip"
    ]
  },
  {
    "name": "plane-arrival",
    "label": "Plane Arrival",
    "unicode": "f5af",
    "terms": [
      "aeroplane",
      "airplane",
      "airplane arrival",
      "airport",
      "arrivals",
      "arriving",
      "destination",
      "fly",
      "land",
      "landing",
      "location",
      "mode",
      "travel",
      "trip"
    ]
  },
  {
    "name": "plane-circle-check",
    "label": "Plane Circle Check",
    "unicode": "e555",
    "terms": [
      "airplane",
      "airport",
      "enable",
      "flight",
      "fly",
      "not affected",
      "ok",
      "okay",
      "travel",
      "validate",
      "working"
    ]
  },
  {
    "name": "plane-circle-exclamation",
    "label": "Plane Circle Exclamation",
    "unicode": "e556",
    "terms": [
      "affected",
      "airplane",
      "airport",
      "failed",
      "flight",
      "fly",
      "travel"
    ]
  },
  {
    "name": "plane-circle-xmark",
    "label": "Plane Circle Xmark",
    "unicode": "e557",
    "terms": [
      "airplane",
      "airport",
      "destroy",
      "flight",
      "fly",
      "travel",
      "uncheck"
    ]
  },
  {
    "name": "plane-departure",
    "label": "Plane Departure",
    "unicode": "f5b0",
    "terms": [
      "aeroplane",
      "airplane",
      "airplane departure",
      "airport",
      "check-in",
      "departing",
      "departure",
      "departures",
      "destination",
      "fly",
      "location",
      "mode",
      "take off",
      "taking off",
      "travel",
      "trip"
    ]
  },
  {
    "name": "plane-lock",
    "label": "Plane Lock",
    "unicode": "e558",
    "terms": [
      "airplane",
      "airport",
      "closed",
      "flight",
      "fly",
      "lockdown",
      "padlock",
      "privacy",
      "quarantine",
      "travel"
    ]
  },
  {
    "name": "plane-slash",
    "label": "Plane Slash",
    "unicode": "e069",
    "terms": [
      "airplane mode",
      "airport",
      "canceled",
      "covid-19",
      "delayed",
      "disabled",
      "grounded",
      "travel"
    ]
  },
  {
    "name": "plane-up",
    "label": "Plane Up",
    "unicode": "e22d",
    "terms": [
      "airplane",
      "airport",
      "internet",
      "signal",
      "sky",
      "wifi",
      "wireless"
    ]
  },
  {
    "name": "plant-wilt",
    "label": "Plant Wilt",
    "unicode": "e5aa",
    "terms": [
      "drought",
      "planting",
      "vegetation",
      "wilt"
    ]
  },
  {
    "name": "plate-wheat",
    "label": "Plate Wheat",
    "unicode": "e55a",
    "terms": [
      "bowl",
      "hunger",
      "rations",
      "wheat"
    ]
  },
  {
    "name": "play",
    "label": "Play",
    "unicode": "f04b",
    "terms": [
      "arrow",
      "audio",
      "music",
      "play",
      "play button",
      "playing",
      "right",
      "sound",
      "start",
      "triangle",
      "video"
    ]
  },
  {
    "name": "plug",
    "label": "Plug",
    "unicode": "f1e6",
    "terms": [
      "connect",
      "electric",
      "electric plug",
      "electricity",
      "online",
      "plug",
      "power"
    ]
  },
  {
    "name": "plug-circle-bolt",
    "label": "Plug Circle Bolt",
    "unicode": "e55b",
    "terms": [
      "electric",
      "electricity",
      "plug",
      "power"
    ]
  },
  {
    "name": "plug-circle-check",
    "label": "Plug Circle Check",
    "unicode": "e55c",
    "terms": [
      "electric",
      "electricity",
      "enable",
      "not affected",
      "ok",
      "okay",
      "plug",
      "power",
      "validate",
      "working"
    ]
  },
  {
    "name": "plug-circle-exclamation",
    "label": "Plug Circle Exclamation",
    "unicode": "e55d",
    "terms": [
      "affected",
      "electric",
      "electricity",
      "failed",
      "plug",
      "power"
    ]
  },
  {
    "name": "plug-circle-minus",
    "label": "Plug Circle Minus",
    "unicode": "e55e",
    "terms": [
      "disconnect",
      "electric",
      "electricity",
      "plug",
      "power"
    ]
  },
  {
    "name": "plug-circle-plus",
    "label": "Plug Circle Plus",
    "unicode": "e55f",
    "terms": [
      "electric",
      "electricity",
      "plug",
      "power"
    ]
  },
  {
    "name": "plug-circle-xmark",
    "label": "Plug Circle Xmark",
    "unicode": "e560",
    "terms": [
      "destroy",
      "disconnect",
      "electric",
      "electricity",
      "outage",
      "plug",
      "power",
      "uncheck"
    ]
  },
  {
    "name": "plus",
    "label": "Plus",
    "unicode": "2b",
    "terms": [
      "+",
      "Plus Sign",
      "add",
      "create",
      "expand",
      "follow",
      "math",
      "modify",
      "new",
      "plus",
      "positive",
      "shape",
      "sign"
    ]
  },
  {
    "name": "plus-minus",
    "label": "Plus Minus",
    "unicode": "e43c",
    "terms": [
      "Plus-Minus Sign",
      "add",
      "math",
      "subtract"
    ]
  },
  {
    "name": "podcast",
    "label": "Podcast",
    "unicode": "f2ce",
    "terms": [
      "audio",
      "broadcast",
      "music",
      "sound"
    ]
  },
  {
    "name": "poo",
    "label": "Poo",
    "unicode": "f2fe",
    "terms": [
      "crap",
      "dung",
      "face",
      "monster",
      "pile of poo",
      "poo",
      "poop",
      "shit",
      "smile",
      "turd",
      "uer"
    ]
  },
  {
    "name": "poo-storm",
    "label": "Poo Storm",
    "unicode": "f75a",
    "terms": [
      "bolt",
      "cloud",
      "euphemism",
      "lightning",
      "mess",
      "poop",
      "shit",
      "turd"
    ]
  },
  {
    "name": "poop",
    "label": "Poop",
    "unicode": "f619",
    "terms": [
      "crap",
      "poop",
      "shit",
      "smile",
      "turd"
    ]
  },
  {
    "name": "power-off",
    "label": "Power Off",
    "unicode": "f011",
    "terms": [
      "Power Symbol",
      "cancel",
      "computer",
      "on",
      "reboot",
      "restart"
    ]
  },
  {
    "name": "prescription",
    "label": "Prescription",
    "unicode": "f5b1",
    "terms": [
      "drugs",
      "medical",
      "medicine",
      "pharmacy",
      "rx"
    ]
  },
  {
    "name": "prescription-bottle",
    "label": "Prescription Bottle",
    "unicode": "f485",
    "terms": [
      "drugs",
      "medical",
      "medicine",
      "pharmacy",
      "rx"
    ]
  },
  {
    "name": "prescription-bottle-medical",
    "label": "Prescription Bottle Medical",
    "unicode": "f486",
    "terms": [
      "drugs",
      "medical",
      "medicine",
      "pharmacy",
      "rx"
    ]
  },
  {
    "name": "print",
    "label": "Print",
    "unicode": "f02f",
    "terms": [
      "Print Screen Symbol",
      "Printer Icon",
      "business",
      "computer",
      "copy",
      "document",
      "office",
      "paper",
      "printer"
    ]
  },
  {
    "name": "pump-medical",
    "label": "Pump Medical",
    "unicode": "e06a",
    "terms": [
      "anti-bacterial",
      "clean",
      "covid-19",
      "disinfect",
      "hygiene",
      "medical grade",
      "sanitizer",
      "soap"
    ]
  },
  {
    "name": "pump-soap",
    "label": "Pump Soap",
    "unicode": "e06b",
    "terms": [
      "anti-bacterial",
      "clean",
      "covid-19",
      "disinfect",
      "hygiene",
      "sanitizer",
      "soap"
    ]
  },
  {
    "name": "puzzle-piece",
    "label": "Puzzle Piece",
    "unicode": "f12e",
    "terms": [
      "add-on",
      "addon",
      "clue",
      "game",
      "interlocking",
      "jigsaw",
      "piece",
      "puzzle",
      "puzzle piece",
      "section"
    ]
  },
  {
    "name": "q",
    "label": "Q",
    "unicode": "51",
    "terms": [
      "Latin Capital Letter Q",
      "Latin Small Letter Q",
      "letter"
    ]
  },
  {
    "name": "qrcode",
    "label": "Qrcode",
    "unicode": "f029",
    "terms": [
      "barcode",
      "info",
      "information",
      "scan"
    ]
  },
  {
    "name": "question",
    "label": "Question",
    "unicode": "3f",
    "terms": [
      "?",
      "Question Mark",
      "faq",
      "help",
      "information",
      "mark",
      "outlined",
      "punctuation",
      "question",
      "red question mark",
      "request",
      "support",
      "unknown",
      "white question mark"
    ]
  },
  {
    "name": "quote-left",
    "label": "Quote Left",
    "unicode": "f10d",
    "terms": [
      "Left Double Quotation Mark",
      "mention",
      "note",
      "phrase",
      "text",
      "type"
    ]
  },
  {
    "name": "quote-right",
    "label": "Quote Right",
    "unicode": "f10e",
    "terms": [
      "Right Double Quotation Mark",
      "mention",
      "note",
      "phrase",
      "text",
      "type"
    ]
  },
  {
    "name": "r",
    "label": "R",
    "unicode": "52",
    "terms": [
      "Latin Capital Letter R",
      "Latin Small Letter R",
      "letter"
    ]
  },
  {
    "name": "radiation",
    "label": "Radiation",
    "unicode": "f7b9",
    "terms": [
      "danger",
      "dangerous",
      "deadly",
      "hazard",
      "nuclear",
      "radioactive",
      "warning"
    ]
  },
  {
    "name": "radio",
    "label": "Radio",
    "unicode": "f8d7",
    "terms": [
      "am",
      "broadcast",
      "fm",
      "frequency",
      "music",
      "news",
      "radio",
      "receiver",
      "transmitter",
      "tuner",
      "video"
    ]
  },
  {
    "name": "rainbow",
    "label": "Rainbow",
    "unicode": "f75b",
    "terms": [
      "gold",
      "leprechaun",
      "prism",
      "rain",
      "rainbow",
      "sky"
    ]
  },
  {
    "name": "ranking-star",
    "label": "Ranking Star",
    "unicode": "e561",
    "terms": [
      "chart",
      "first place",
      "podium",
      "quality",
      "rank",
      "revenue",
      "win"
    ]
  },
  {
    "name": "receipt",
    "label": "Receipt",
    "unicode": "f543",
    "terms": [
      "accounting",
      "bookkeeping",
      "check",
      "coupon",
      "evidence",
      "invoice",
      "money",
      "pay",
      "proof",
      "receipt",
      "table"
    ]
  },
  {
    "name": "record-vinyl",
    "label": "Record Vinyl",
    "unicode": "f8d9",
    "terms": [
      "LP",
      "album",
      "analog",
      "music",
      "phonograph",
      "sound"
    ]
  },
  {
    "name": "rectangle-ad",
    "label": "Rectangle Ad",
    "unicode": "f641",
    "terms": [
      "advertisement",
      "media",
      "newspaper",
      "promotion",
      "publicity"
    ]
  },
  {
    "name": "rectangle-list",
    "label": "Rectangle List",
    "unicode": "f022",
    "terms": [
      "cheatsheet",
      "checklist",
      "completed",
      "done",
      "finished",
      "ol",
      "summary",
      "todo",
      "ul"
    ]
  },
  {
    "name": "rectangle-xmark",
    "label": "Rectangle Xmark",
    "unicode": "f410",
    "terms": [
      "browser",
      "cancel",
      "computer",
      "development",
      "uncheck"
    ]
  },
  {
    "name": "recycle",
    "label": "Recycle",
    "unicode": "f1b8",
    "terms": [
      "Recycling Symbol For Generic Materials",
      "Universal Recycling Symbol",
      "Waste",
      "compost",
      "garbage",
      "recycle",
      "recycling symbol",
      "reuse",
      "trash"
    ]
  },
  {
    "name": "registered",
    "label": "Registered",
    "unicode": "f25d",
    "terms": [
      "copyright",
      "mark",
      "r",
      "registered",
      "trademark"
    ]
  },
  {
    "name": "repeat",
    "label": "Repeat",
    "unicode": "f363",
    "terms": [
      "arrow",
      "clockwise",
      "flip",
      "reload",
      "renew",
      "repeat",
      "repeat button",
      "retry",
      "rewind",
      "switch"
    ]
  },
  {
    "name": "reply",
    "label": "Reply",
    "unicode": "f3e5",
    "terms": [
      "mail",
      "message",
      "respond"
    ]
  },
  {
    "name": "reply-all",
    "label": "Reply All",
    "unicode": "f122",
    "terms": [
      "mail",
      "message",
      "respond"
    ]
  },
  {
    "name": "republican",
    "label": "Republican",
    "unicode": "f75e",
    "terms": [
      "american",
      "conservative",
      "election",
      "elephant",
      "politics",
      "republican party",
      "right",
      "right-wing",
      "usa"
    ]
  },
  {
    "name": "restroom",
    "label": "Restroom",
    "unicode": "f7bd",
    "terms": [
      "bathroom",
      "toilet",
      "uer",
      "water closet",
      "wc"
    ]
  },
  {
    "name": "retweet",
    "label": "Retweet",
    "unicode": "f079",
    "terms": [
      "refresh",
      "reload",
      "renew",
      "retry",
      "share",
      "swap"
    ]
  },
  {
    "name": "ribbon",
    "label": "Ribbon",
    "unicode": "f4d6",
    "terms": [
      "badge",
      "cause",
      "celebration",
      "lapel",
      "pin",
      "reminder",
      "reminder ribbon",
      "ribbon"
    ]
  },
  {
    "name": "right-from-bracket",
    "label": "Right From Bracket",
    "unicode": "f2f5",
    "terms": [
      "arrow",
      "exit",
      "leave",
      "log out",
      "logout",
      "sign-out"
    ]
  },
  {
    "name": "right-left",
    "label": "Right Left",
    "unicode": "f362",
    "terms": [
      "arrow",
      "arrows",
      "exchange",
      "reciprocate",
      "return",
      "swap",
      "transfer"
    ]
  },
  {
    "name": "right-long",
    "label": "Right Long",
    "unicode": "f30b",
    "terms": [
      "forward",
      "long-arrow-right",
      "next"
    ]
  },
  {
    "name": "right-to-bracket",
    "label": "Right To Bracket",
    "unicode": "f2f6",
    "terms": [
      "arrow",
      "enter",
      "join",
      "log in",
      "login",
      "sign in",
      "sign up",
      "sign-in",
      "signin",
      "signup"
    ]
  },
  {
    "name": "ring",
    "label": "Ring",
    "unicode": "f70b",
    "terms": [
      "Dungeons & Dragons",
      "Gollum",
      "band",
      "binding",
      "d&d",
      "dnd",
      "engagement",
      "fantasy",
      "gold",
      "jewelry",
      "marriage",
      "precious",
      "premium"
    ]
  },
  {
    "name": "road",
    "label": "Road",
    "unicode": "f018",
    "terms": [
      "highway",
      "map",
      "motorway",
      "pavement",
      "road",
      "route",
      "street",
      "travel"
    ]
  },
  {
    "name": "road-barrier",
    "label": "Road Barrier",
    "unicode": "e562",
    "terms": [
      "block",
      "border",
      "no entry",
      "roadblock"
    ]
  },
  {
    "name": "road-bridge",
    "label": "Road Bridge",
    "unicode": "e563",
    "terms": [
      "bridge",
      "infrastructure",
      "road",
      "travel"
    ]
  },
  {
    "name": "road-circle-check",
    "label": "Road Circle Check",
    "unicode": "e564",
    "terms": [
      "enable",
      "freeway",
      "highway",
      "not affected",
      "ok",
      "okay",
      "pavement",
      "road",
      "validate",
      "working"
    ]
  },
  {
    "name": "road-circle-exclamation",
    "label": "Road Circle Exclamation",
    "unicode": "e565",
    "terms": [
      "affected",
      "failed",
      "freeway",
      "highway",
      "pavement",
      "road"
    ]
  },
  {
    "name": "road-circle-xmark",
    "label": "Road Circle Xmark",
    "unicode": "e566",
    "terms": [
      "destroy",
      "freeway",
      "highway",
      "pavement",
      "road",
      "uncheck"
    ]
  },
  {
    "name": "road-lock",
    "label": "Road Lock",
    "unicode": "e567",
    "terms": [
      "closed",
      "freeway",
      "highway",
      "lockdown",
      "padlock",
      "pavement",
      "privacy",
      "quarantine",
      "road"
    ]
  },
  {
    "name": "road-spikes",
    "label": "Road Spikes",
    "unicode": "e568",
    "terms": [
      "barrier",
      "roadblock",
      "spikes"
    ]
  },
  {
    "name": "robot",
    "label": "Robot",
    "unicode": "f544",
    "terms": [
      "android",
      "automate",
      "computer",
      "cyborg",
      "face",
      "monster",
      "robot"
    ]
  },
  {
    "name": "rocket",
    "label": "Rocket",
    "unicode": "f135",
    "terms": [
      "aircraft",
      "app",
      "jet",
      "launch",
      "nasa",
      "space"
    ]
  },
  {
    "name": "rotate",
    "label": "Rotate",
    "unicode": "f2f1",
    "terms": [
      "arrow",
      "clockwise",
      "exchange",
      "modify",
      "refresh",
      "reload",
      "renew",
      "retry",
      "rotate",
      "swap",
      "withershins"
    ]
  },
  {
    "name": "rotate-left",
    "label": "Rotate Left",
    "unicode": "f2ea",
    "terms": [
      "back",
      "control z",
      "exchange",
      "oops",
      "return",
      "swap"
    ]
  },
  {
    "name": "rotate-right",
    "label": "Rotate Right",
    "unicode": "f2f9",
    "terms": [
      "forward",
      "refresh",
      "reload",
      "renew",
      "repeat",
      "retry"
    ]
  },
  {
    "name": "route",
    "label": "Route",
    "unicode": "f4d7",
    "terms": [
      "directions",
      "navigation",
      "travel"
    ]
  },
  {
    "name": "rss",
    "label": "Rss",
    "unicode": "f09e",
    "terms": [
      "blog",
      "feed",
      "journal",
      "news",
      "writing"
    ]
  },
  {
    "name": "ruble-sign",
    "label": "Ruble Sign",
    "unicode": "f158",
    "terms": [
      "Ruble Sign",
      "currency"
    ]
  },
  {
    "name": "rug",
    "label": "Rug",
    "unicode": "e569",
    "terms": [
      "blanket",
      "carpet",
      "rug",
      "textile"
    ]
  },
  {
    "name": "ruler",
    "label": "Ruler",
    "unicode": "f545",
    "terms": [
      "design",
      "draft",
      "length",
      "measure",
      "planning",
      "ruler",
      "straight edge",
      "straight ruler"
    ]
  },
  {
    "name": "ruler-combined",
    "label": "Ruler Combined",
    "unicode": "f546",
    "terms": [
      "design",
      "draft",
      "length",
      "measure",
      "planning"
    ]
  },
  {
    "name": "ruler-horizontal",
    "label": "Ruler Horizontal",
    "unicode": "f547",
    "terms": [
      "design",
      "draft",
      "length",
      "measure",
      "planning"
    ]
  },
  {
    "name": "ruler-vertical",
    "label": "Ruler Vertical",
    "unicode": "f548",
    "terms": [
      "design",
      "draft",
      "length",
      "measure",
      "planning"
    ]
  },
  {
    "name": "rupee-sign",
    "label": "Rupee Sign",
    "unicode": "f156",
    "terms": [
      "Rupee Sign",
      "currency"
    ]
  },
  {
    "name": "rupiah-sign",
    "label": "Rupiah Sign",
    "unicode": "e23d",
    "terms": [
      "currency"
    ]
  },
  {
    "name": "s",
    "label": "S",
    "unicode": "53",
    "terms": [
      "Latin Capital Letter S",
      "Latin Small Letter S",
      "letter"
    ]
  },
  {
    "name": "sack-dollar",
    "label": "Sack Dollar",
    "unicode": "f81d",
    "terms": [
      "bag",
      "burlap",
      "cash",
      "dollar",
      "investment",
      "money",
      "money bag",
      "moneybag",
      "premium",
      "robber",
      "salary",
      "santa",
      "usd"
    ]
  },
  {
    "name": "sack-xmark",
    "label": "Sack Xmark",
    "unicode": "e56a",
    "terms": [
      "bag",
      "burlap",
      "coupon",
      "rations",
      "salary",
      "uncheck"
    ]
  },
  {
    "name": "sailboat",
    "label": "Sailboat",
    "unicode": "e445",
    "terms": [
      "dinghy",
      "mast",
      "sailboat",
      "sailing",
      "yacht"
    ]
  },
  {
    "name": "satellite",
    "label": "Satellite",
    "unicode": "f7bf",
    "terms": [
      "communications",
      "hardware",
      "orbit",
      "satellite",
      "space"
    ]
  },
  {
    "name": "satellite-dish",
    "label": "Satellite Dish",
    "unicode": "f7c0",
    "terms": [
      "SETI",
      "antenna",
      "communications",
      "dish",
      "hardware",
      "radar",
      "receiver",
      "satellite",
      "satellite antenna",
      "saucer",
      "signal",
      "space"
    ]
  },
  {
    "name": "scale-balanced",
    "label": "Scale Balanced",
    "unicode": "f24e",
    "terms": [
      "Libra",
      "balance",
      "balance scale",
      "balanced",
      "justice",
      "law",
      "legal",
      "measure",
      "rule",
      "scale",
      "weight",
      "zodiac"
    ]
  },
  {
    "name": "scale-unbalanced",
    "label": "Scale Unbalanced",
    "unicode": "f515",
    "terms": [
      "justice",
      "legal",
      "measure",
      "unbalanced",
      "weight"
    ]
  },
  {
    "name": "scale-unbalanced-flip",
    "label": "Scale Unbalanced Flip",
    "unicode": "f516",
    "terms": [
      "justice",
      "legal",
      "measure",
      "unbalanced",
      "weight"
    ]
  },
  {
    "name": "school",
    "label": "School",
    "unicode": "f549",
    "terms": [
      "building",
      "education",
      "learn",
      "school",
      "student",
      "teacher"
    ]
  },
  {
    "name": "school-circle-check",
    "label": "School Circle Check",
    "unicode": "e56b",
    "terms": [
      "enable",
      "not affected",
      "ok",
      "okay",
      "schoolhouse",
      "validate",
      "working"
    ]
  },
  {
    "name": "school-circle-exclamation",
    "label": "School Circle Exclamation",
    "unicode": "e56c",
    "terms": [
      "affected",
      "failed",
      "schoolhouse"
    ]
  },
  {
    "name": "school-circle-xmark",
    "label": "School Circle Xmark",
    "unicode": "e56d",
    "terms": [
      "destroy",
      "schoolhouse",
      "uncheck"
    ]
  },
  {
    "name": "school-flag",
    "label": "School Flag",
    "unicode": "e56e",
    "terms": [
      "educate",
      "flag",
      "school",
      "schoolhouse"
    ]
  },
  {
    "name": "school-lock",
    "label": "School Lock",
    "unicode": "e56f",
    "terms": [
      "closed",
      "lockdown",
      "padlock",
      "privacy",
      "quarantine",
      "schoolhouse"
    ]
  },
  {
    "name": "scissors",
    "label": "Scissors",
    "unicode": "f0c4",
    "terms": [
      "Black Safety Scissors",
      "White Scissors",
      "clip",
      "cutting",
      "equipment",
      "modify",
      "scissors",
      "snip",
      "tool"
    ]
  },
  {
    "name": "screwdriver",
    "label": "Screwdriver",
    "unicode": "f54a",
    "terms": [
      "admin",
      "configuration",
      "equipment",
      "fix",
      "maintenance",
      "mechanic",
      "modify",
      "repair",
      "screw",
      "screwdriver",
      "settings",
      "tool"
    ]
  },
  {
    "name": "screwdriver-wrench",
    "label": "Screwdriver Wrench",
    "unicode": "f7d9",
    "terms": [
      "admin",
      "configuration",
      "equipment",
      "fix",
      "maintenance",
      "modify",
      "repair",
      "screwdriver",
      "settings",
      "tools",
      "wrench"
    ]
  },
  {
    "name": "scroll",
    "label": "Scroll",
    "unicode": "f70e",
    "terms": [
      "Dungeons & Dragons",
      "announcement",
      "d&d",
      "dnd",
      "fantasy",
      "paper",
      "scholar",
      "script",
      "scroll"
    ]
  },
  {
    "name": "scroll-torah",
    "label": "Scroll Torah",
    "unicode": "f6a0",
    "terms": [
      "book",
      "jewish",
      "judaism",
      "religion",
      "scroll"
    ]
  },
  {
    "name": "sd-card",
    "label": "Sd Card",
    "unicode": "f7c2",
    "terms": [
      "image",
      "img",
      "memory",
      "photo",
      "save"
    ]
  },
  {
    "name": "section",
    "label": "Section",
    "unicode": "e447",
    "terms": [
      "Section Sign",
      "law",
      "legal",
      "silcrow"
    ]
  },
  {
    "name": "seedling",
    "label": "Seedling",
    "unicode": "f4d8",
    "terms": [
      "environment",
      "flora",
      "grow",
      "investment",
      "plant",
      "sapling",
      "seedling",
      "vegan",
      "young"
    ]
  },
  {
    "name": "server",
    "label": "Server",
    "unicode": "f233",
    "terms": [
      "computer",
      "cpu",
      "database",
      "hardware",
      "mysql",
      "network",
      "sql"
    ]
  },
  {
    "name": "shapes",
    "label": "Shapes",
    "unicode": "f61f",
    "terms": [
      "blocks",
      "build",
      "circle",
      "square",
      "triangle"
    ]
  },
  {
    "name": "share",
    "label": "Share",
    "unicode": "f064",
    "terms": [
      "forward",
      "save",
      "send",
      "social"
    ]
  },
  {
    "name": "share-from-square",
    "label": "Share From Square",
    "unicode": "f14d",
    "terms": [
      "forward",
      "save",
      "send",
      "social"
    ]
  },
  {
    "name": "share-nodes",
    "label": "Share Nodes",
    "unicode": "f1e0",
    "terms": [
      "forward",
      "save",
      "send",
      "social"
    ]
  },
  {
    "name": "sheet-plastic",
    "label": "Sheet Plastic",
    "unicode": "e571",
    "terms": [
      "plastic",
      "plastic wrap",
      "protect",
      "tarp",
      "tarpaulin",
      "waterproof"
    ]
  },
  {
    "name": "shekel-sign",
    "label": "Shekel Sign",
    "unicode": "f20b",
    "terms": [
      "New Sheqel Sign",
      "currency",
      "ils",
      "money"
    ]
  },
  {
    "name": "shield",
    "label": "Shield",
    "unicode": "f132",
    "terms": [
      "achievement",
      "armor",
      "award",
      "block",
      "cleric",
      "defend",
      "defense",
      "holy",
      "paladin",
      "protect",
      "safety",
      "security",
      "shield",
      "weapon",
      "winner"
    ]
  },
  {
    "name": "shield-cat",
    "label": "Shield Cat",
    "unicode": "e572",
    "terms": [
      "animal",
      "feline",
      "pet",
      "protect",
      "safety",
      "veterinary"
    ]
  },
  {
    "name": "shield-dog",
    "label": "Shield Dog",
    "unicode": "e573",
    "terms": [
      "animal",
      "canine",
      "pet",
      "protect",
      "safety",
      "veterinary"
    ]
  },
  {
    "name": "shield-halved",
    "label": "Shield Halved",
    "unicode": "f3ed",
    "terms": [
      "achievement",
      "armor",
      "award",
      "block",
      "cleric",
      "defend",
      "defense",
      "holy",
      "paladin",
      "privacy",
      "security",
      "shield",
      "weapon",
      "winner"
    ]
  },
  {
    "name": "shield-heart",
    "label": "Shield Heart",
    "unicode": "e574",
    "terms": [
      "love",
      "protect",
      "safe",
      "safety",
      "shield",
      "wishlist"
    ]
  },
  {
    "name": "shield-virus",
    "label": "Shield Virus",
    "unicode": "e06c",
    "terms": [
      "antibodies",
      "barrier",
      "coronavirus",
      "covid-19",
      "flu",
      "health",
      "infection",
      "pandemic",
      "protect",
      "safety",
      "vaccine"
    ]
  },
  {
    "name": "ship",
    "label": "Ship",
    "unicode": "f21a",
    "terms": [
      "boat",
      "passenger",
      "sea",
      "ship",
      "water"
    ]
  },
  {
    "name": "shirt",
    "label": "Shirt",
    "unicode": "f553",
    "terms": [
      "clothing",
      "fashion",
      "garment",
      "shirt",
      "short sleeve",
      "t-shirt",
      "tshirt"
    ]
  },
  {
    "name": "shoe-prints",
    "label": "Shoe Prints",
    "unicode": "f54b",
    "terms": [
      "feet",
      "footprints",
      "steps",
      "walk"
    ]
  },
  {
    "name": "shop",
    "label": "Shop",
    "unicode": "f54f",
    "terms": [
      "bodega",
      "building",
      "buy",
      "market",
      "purchase",
      "shopping",
      "store"
    ]
  },
  {
    "name": "shop-lock",
    "label": "Shop Lock",
    "unicode": "e4a5",
    "terms": [
      "bodega",
      "building",
      "buy",
      "closed",
      "lock",
      "lockdown",
      "market",
      "padlock",
      "privacy",
      "purchase",
      "quarantine",
      "shop",
      "shopping",
      "store"
    ]
  },
  {
    "name": "shop-slash",
    "label": "Shop Slash",
    "unicode": "e070",
    "terms": [
      "building",
      "buy",
      "closed",
      "covid-19",
      "disabled",
      "purchase",
      "shopping"
    ]
  },
  {
    "name": "shower",
    "label": "Shower",
    "unicode": "f2cc",
    "terms": [
      "bath",
      "clean",
      "faucet",
      "shower",
      "water"
    ]
  },
  {
    "name": "shrimp",
    "label": "Shrimp",
    "unicode": "e448",
    "terms": [
      "allergy",
      "crustacean",
      "prawn",
      "seafood",
      "shellfish",
      "shrimp",
      "tail"
    ]
  },
  {
    "name": "shuffle",
    "label": "Shuffle",
    "unicode": "f074",
    "terms": [
      "arrow",
      "arrows",
      "crossed",
      "shuffle",
      "shuffle tracks button",
      "sort",
      "swap",
      "switch",
      "transfer"
    ]
  },
  {
    "name": "shuttle-space",
    "label": "Shuttle Space",
    "unicode": "f197",
    "terms": [
      "astronaut",
      "machine",
      "nasa",
      "rocket",
      "space",
      "transportation"
    ]
  },
  {
    "name": "sign-hanging",
    "label": "Sign Hanging",
    "unicode": "f4d9",
    "terms": [
      "directions",
      "real estate",
      "signage",
      "wayfinding"
    ]
  },
  {
    "name": "signal",
    "label": "Signal",
    "unicode": "f012",
    "terms": [
      "antenna",
      "antenna bars",
      "bar",
      "bars",
      "cell",
      "graph",
      "mobile",
      "online",
      "phone",
      "reception",
      "status"
    ]
  },
  {
    "name": "signature",
    "label": "Signature",
    "unicode": "f5b7",
    "terms": [
      "John Hancock",
      "cursive",
      "name",
      "username",
      "writing"
    ]
  },
  {
    "name": "signs-post",
    "label": "Signs Post",
    "unicode": "f277",
    "terms": [
      "directions",
      "directory",
      "map",
      "signage",
      "wayfinding"
    ]
  },
  {
    "name": "sim-card",
    "label": "Sim Card",
    "unicode": "f7c4",
    "terms": [
      "hard drive",
      "hardware",
      "portable",
      "storage",
      "technology",
      "tiny"
    ]
  },
  {
    "name": "sink",
    "label": "Sink",
    "unicode": "e06d",
    "terms": [
      "bathroom",
      "covid-19",
      "faucet",
      "kitchen",
      "wash"
    ]
  },
  {
    "name": "sitemap",
    "label": "Sitemap",
    "unicode": "f0e8",
    "terms": [
      "directory",
      "hierarchy",
      "ia",
      "information architecture",
      "organization"
    ]
  },
  {
    "name": "skull",
    "label": "Skull",
    "unicode": "f54c",
    "terms": [
      "bones",
      "death",
      "face",
      "fairy tale",
      "monster",
      "skeleton",
      "skull",
      "uer",
      "x-ray",
      "yorick"
    ]
  },
  {
    "name": "skull-crossbones",
    "label": "Skull Crossbones",
    "unicode": "f714",
    "terms": [
      "Black Skull and Crossbones",
      "Dungeons & Dragons",
      "alert",
      "bones",
      "crossbones",
      "d&d",
      "danger",
      "dangerous area",
      "dead",
      "deadly",
      "death",
      "dnd",
      "face",
      "fantasy",
      "halloween",
      "holiday",
      "jolly-roger",
      "monster",
      "pirate",
      "poison",
      "skeleton",
      "skull",
      "skull and crossbones",
      "warning"
    ]
  },
  {
    "name": "slash",
    "label": "Slash",
    "unicode": "f715",
    "terms": [
      "cancel",
      "close",
      "mute",
      "off",
      "stop",
      "x"
    ]
  },
  {
    "name": "sleigh",
    "label": "Sleigh",
    "unicode": "f7cc",
    "terms": [
      "christmas",
      "claus",
      "fly",
      "holiday",
      "santa",
      "sled",
      "snow",
      "xmas"
    ]
  },
  {
    "name": "sliders",
    "label": "Sliders",
    "unicode": "f1de",
    "terms": [
      "adjust",
      "configuration",
      "modify",
      "settings",
      "sliders",
      "toggle"
    ]
  },
  {
    "name": "smog",
    "label": "Smog",
    "unicode": "f75f",
    "terms": [
      "dragon",
      "fog",
      "haze",
      "pollution",
      "smoke",
      "weather"
    ]
  },
  {
    "name": "smoking",
    "label": "Smoking",
    "unicode": "f48d",
    "terms": [
      "cancer",
      "cigarette",
      "nicotine",
      "smoking",
      "smoking status",
      "tobacco"
    ]
  },
  {
    "name": "snowflake",
    "label": "Snowflake",
    "unicode": "f2dc",
    "terms": [
      "Heavy Chevron Snowflake",
      "cold",
      "precipitation",
      "rain",
      "snow",
      "snowfall",
      "snowflake",
      "winter"
    ]
  },
  {
    "name": "snowman",
    "label": "Snowman",
    "unicode": "f7d0",
    "terms": [
      "cold",
      "decoration",
      "frost",
      "frosty",
      "holiday",
      "snow",
      "snowman",
      "snowman without snow"
    ]
  },
  {
    "name": "snowplow",
    "label": "Snowplow",
    "unicode": "f7d2",
    "terms": [
      "clean up",
      "cold",
      "road",
      "storm",
      "winter"
    ]
  },
  {
    "name": "soap",
    "label": "Soap",
    "unicode": "e06e",
    "terms": [
      "bar",
      "bathing",
      "bubbles",
      "clean",
      "cleaning",
      "covid-19",
      "hygiene",
      "lather",
      "soap",
      "soapdish",
      "wash"
    ]
  },
  {
    "name": "socks",
    "label": "Socks",
    "unicode": "f696",
    "terms": [
      "business socks",
      "business time",
      "clothing",
      "feet",
      "flight of the conchords",
      "socks",
      "stocking",
      "wednesday"
    ]
  },
  {
    "name": "solar-panel",
    "label": "Solar Panel",
    "unicode": "f5ba",
    "terms": [
      "clean",
      "eco-friendly",
      "energy",
      "green",
      "sun"
    ]
  },
  {
    "name": "sort",
    "label": "Sort",
    "unicode": "f0dc",
    "terms": [
      "filter",
      "order"
    ]
  },
  {
    "name": "sort-down",
    "label": "Sort Down",
    "unicode": "f0dd",
    "terms": [
      "arrow",
      "descending",
      "filter",
      "insert",
      "order",
      "sort-desc"
    ]
  },
  {
    "name": "sort-up",
    "label": "Sort Up",
    "unicode": "f0de",
    "terms": [
      "arrow",
      "ascending",
      "filter",
      "order",
      "sort-asc",
      "upgrade"
    ]
  },
  {
    "name": "spa",
    "label": "Spa",
    "unicode": "f5bb",
    "terms": [
      "flora",
      "massage",
      "mindfulness",
      "plant",
      "wellness"
    ]
  },
  {
    "name": "spaghetti-monster-flying",
    "label": "Spaghetti Monster Flying",
    "unicode": "f67b",
    "terms": [
      "agnosticism",
      "atheism",
      "flying spaghetti monster",
      "fsm"
    ]
  },
  {
    "name": "spell-check",
    "label": "Spell Check",
    "unicode": "f891",
    "terms": [
      "dictionary",
      "edit",
      "editor",
      "enable",
      "grammar",
      "text",
      "validate",
      "working"
    ]
  },
  {
    "name": "spider",
    "label": "Spider",
    "unicode": "f717",
    "terms": [
      "arachnid",
      "bug",
      "charlotte",
      "crawl",
      "eight",
      "halloween",
      "insect",
      "spider"
    ]
  },
  {
    "name": "spinner",
    "label": "Spinner",
    "unicode": "f110",
    "terms": [
      "circle",
      "loading",
      "pending",
      "progress"
    ]
  },
  {
    "name": "splotch",
    "label": "Splotch",
    "unicode": "f5bc",
    "terms": [
      "Ink",
      "blob",
      "blotch",
      "glob",
      "stain"
    ]
  },
  {
    "name": "spoon",
    "label": "Spoon",
    "unicode": "f2e5",
    "terms": [
      "cutlery",
      "dining",
      "scoop",
      "silverware",
      "spoon",
      "tableware"
    ]
  },
  {
    "name": "spray-can",
    "label": "Spray Can",
    "unicode": "f5bd",
    "terms": [
      "Paint",
      "aerosol",
      "design",
      "graffiti",
      "tag"
    ]
  },
  {
    "name": "spray-can-sparkles",
    "label": "Spray Can Sparkles",
    "unicode": "f5d0",
    "terms": [
      "car",
      "clean",
      "deodorize",
      "fresh",
      "pine",
      "scent"
    ]
  },
  {
    "name": "square",
    "label": "Square",
    "unicode": "f0c8",
    "terms": [
      "Black Square",
      "black medium square",
      "block",
      "box",
      "geometric",
      "shape",
      "square",
      "white medium square"
    ]
  },
  {
    "name": "square-arrow-up-right",
    "label": "Square Arrow Up Right",
    "unicode": "f14c",
    "terms": [
      "diagonal",
      "new",
      "open",
      "send",
      "share"
    ]
  },
  {
    "name": "square-binary",
    "label": "Square Binary",
    "unicode": "e69b",
    "terms": [
      "ai",
      "data",
      "language",
      "llm",
      "model",
      "programming",
      "token"
    ]
  },
  {
    "name": "square-caret-down",
    "label": "Square Caret Down",
    "unicode": "f150",
    "terms": [
      "arrow",
      "caret-square-o-down",
      "dropdown",
      "expand",
      "insert",
      "menu",
      "more",
      "triangle"
    ]
  },
  {
    "name": "square-caret-left",
    "label": "Square Caret Left",
    "unicode": "f191",
    "terms": [
      "arrow",
      "back",
      "caret-square-o-left",
      "previous",
      "triangle"
    ]
  },
  {
    "name": "square-caret-right",
    "label": "Square Caret Right",
    "unicode": "f152",
    "terms": [
      "arrow",
      "caret-square-o-right",
      "forward",
      "next",
      "triangle"
    ]
  },
  {
    "name": "square-caret-up",
    "label": "Square Caret Up",
    "unicode": "f151",
    "terms": [
      "arrow",
      "caret-square-o-up",
      "collapse",
      "triangle",
      "upgrade",
      "upload"
    ]
  },
  {
    "name": "square-check",
    "label": "Square Check",
    "unicode": "f14a",
    "terms": [
      "accept",
      "agree",
      "box",
      "button",
      "check",
      "check box with check",
      "check mark button",
      "checkmark",
      "confirm",
      "correct",
      "coupon",
      "done",
      "enable",
      "mark",
      "ok",
      "select",
      "success",
      "tick",
      "todo",
      "validate",
      "working",
      "yes",
      "✓"
    ]
  },
  {
    "name": "square-envelope",
    "label": "Square Envelope",
    "unicode": "f199",
    "terms": [
      "e-mail",
      "email",
      "letter",
      "mail",
      "message",
      "notification",
      "offer",
      "support"
    ]
  },
  {
    "name": "square-full",
    "label": "Square Full",
    "unicode": "f45c",
    "terms": [
      "black large square",
      "block",
      "blue",
      "blue square",
      "box",
      "brown",
      "brown square",
      "geometric",
      "green",
      "green square",
      "orange",
      "orange square",
      "purple",
      "purple square",
      "red",
      "red square",
      "shape",
      "square",
      "white large square",
      "yellow",
      "yellow square"
    ]
  },
  {
    "name": "square-h",
    "label": "Square H",
    "unicode": "f0fd",
    "terms": [
      "directions",
      "emergency",
      "hospital",
      "hotel",
      "letter",
      "map"
    ]
  },
  {
    "name": "square-minus",
    "label": "Square Minus",
    "unicode": "f146",
    "terms": [
      "collapse",
      "delete",
      "hide",
      "minify",
      "negative",
      "remove",
      "shape",
      "trash"
    ]
  },
  {
    "name": "square-nfi",
    "label": "Square Nfi",
    "unicode": "e576",
    "terms": [
      "non-food item",
      "supplies"
    ]
  },
  {
    "name": "square-parking",
    "label": "Square Parking",
    "unicode": "f540",
    "terms": [
      "auto",
      "car",
      "garage",
      "meter",
      "parking"
    ]
  },
  {
    "name": "square-pen",
    "label": "Square Pen",
    "unicode": "f14b",
    "terms": [
      "edit",
      "modify",
      "pencil-square",
      "update",
      "write"
    ]
  },
  {
    "name": "square-person-confined",
    "label": "Square Person Confined",
    "unicode": "e577",
    "terms": [
      "captivity",
      "confined",
      "uer"
    ]
  },
  {
    "name": "square-phone",
    "label": "Square Phone",
    "unicode": "f098",
    "terms": [
      "call",
      "earphone",
      "number",
      "support",
      "telephone",
      "voice"
    ]
  },
  {
    "name": "square-phone-flip",
    "label": "Square Phone Flip",
    "unicode": "f87b",
    "terms": [
      "call",
      "earphone",
      "number",
      "support",
      "telephone",
      "voice"
    ]
  },
  {
    "name": "square-plus",
    "label": "Square Plus",
    "unicode": "f0fe",
    "terms": [
      "add",
      "create",
      "expand",
      "new",
      "positive",
      "shape"
    ]
  },
  {
    "name": "square-poll-horizontal",
    "label": "Square Poll Horizontal",
    "unicode": "f682",
    "terms": [
      "chart",
      "graph",
      "results",
      "statistics",
      "survey",
      "trend",
      "vote",
      "voting"
    ]
  },
  {
    "name": "square-poll-vertical",
    "label": "Square Poll Vertical",
    "unicode": "f681",
    "terms": [
      "chart",
      "graph",
      "results",
      "revenue",
      "statistics",
      "survey",
      "trend",
      "vote",
      "voting"
    ]
  },
  {
    "name": "square-root-variable",
    "label": "Square Root Variable",
    "unicode": "f698",
    "terms": [
      "arithmetic",
      "calculus",
      "division",
      "math"
    ]
  },
  {
    "name": "square-rss",
    "label": "Square Rss",
    "unicode": "f143",
    "terms": [
      "blog",
      "feed",
      "journal",
      "news",
      "writing"
    ]
  },
  {
    "name": "square-share-nodes",
    "label": "Square Share Nodes",
    "unicode": "f1e1",
    "terms": [
      "forward",
      "save",
      "send",
      "social"
    ]
  },
  {
    "name": "square-up-right",
    "label": "Square Up Right",
    "unicode": "f360",
    "terms": [
      "arrow",
      "diagonal",
      "direction",
      "external-link-square",
      "intercardinal",
      "new",
      "northeast",
      "open",
      "share",
      "up-right arrow"
    ]
  },
  {
    "name": "square-virus",
    "label": "Square Virus",
    "unicode": "e578",
    "terms": [
      "coronavirus",
      "covid-19",
      "disease",
      "flu",
      "infection",
      "pandemic"
    ]
  },
  {
    "name": "square-xmark",
    "label": "Square Xmark",
    "unicode": "f2d3",
    "terms": [
      "close",
      "cross",
      "cross mark button",
      "incorrect",
      "mark",
      "notice",
      "notification",
      "notify",
      "problem",
      "square",
      "uncheck",
      "window",
      "wrong",
      "x",
      "×"
    ]
  },
  {
    "name": "staff-snake",
    "label": "Staff Snake",
    "unicode": "e579",
    "terms": [
      "asclepius",
      "asklepian",
      "health",
      "serpent",
      "wellness"
    ]
  },
  {
    "name": "stairs",
    "label": "Stairs",
    "unicode": "e289",
    "terms": [
      "exit",
      "steps",
      "up"
    ]
  },
  {
    "name": "stamp",
    "label": "Stamp",
    "unicode": "f5bf",
    "terms": [
      "art",
      "certificate",
      "imprint",
      "rubber",
      "seal"
    ]
  },
  {
    "name": "stapler",
    "label": "Stapler",
    "unicode": "e5af",
    "terms": [
      "desktop",
      "milton",
      "office",
      "paperclip",
      "staple"
    ]
  },
  {
    "name": "star",
    "label": "Star",
    "unicode": "f005",
    "terms": [
      "achievement",
      "award",
      "favorite",
      "important",
      "night",
      "quality",
      "rating",
      "score",
      "star",
      "vip"
    ]
  },
  {
    "name": "star-and-crescent",
    "label": "Star And Crescent",
    "unicode": "f699",
    "terms": [
      "Muslim",
      "islam",
      "muslim",
      "religion",
      "star and crescent"
    ]
  },
  {
    "name": "star-half",
    "label": "Star Half",
    "unicode": "f089",
    "terms": [
      "achievement",
      "award",
      "rating",
      "score",
      "star-half-empty",
      "star-half-full"
    ]
  },
  {
    "name": "star-half-stroke",
    "label": "Star Half Stroke",
    "unicode": "f5c0",
    "terms": [
      "achievement",
      "award",
      "rating",
      "score",
      "star-half-empty",
      "star-half-full"
    ]
  },
  {
    "name": "star-of-david",
    "label": "Star Of David",
    "unicode": "f69a",
    "terms": [
      "David",
      "Jew",
      "Jewish",
      "jewish",
      "judaism",
      "religion",
      "star",
      "star of David"
    ]
  },
  {
    "name": "star-of-life",
    "label": "Star Of Life",
    "unicode": "f621",
    "terms": [
      "doctor",
      "emt",
      "first aid",
      "health",
      "medical"
    ]
  },
  {
    "name": "sterling-sign",
    "label": "Sterling Sign",
    "unicode": "f154",
    "terms": [
      "Pound Sign",
      "currency"
    ]
  },
  {
    "name": "stethoscope",
    "label": "Stethoscope",
    "unicode": "f0f1",
    "terms": [
      "covid-19",
      "diagnosis",
      "doctor",
      "general practitioner",
      "heart",
      "hospital",
      "infirmary",
      "medicine",
      "office",
      "outpatient",
      "stethoscope"
    ]
  },
  {
    "name": "stop",
    "label": "Stop",
    "unicode": "f04d",
    "terms": [
      "block",
      "box",
      "square",
      "stop",
      "stop button"
    ]
  },
  {
    "name": "stopwatch",
    "label": "Stopwatch",
    "unicode": "f2f2",
    "terms": [
      "clock",
      "reminder",
      "stopwatch",
      "time",
      "waiting"
    ]
  },
  {
    "name": "stopwatch-20",
    "label": "Stopwatch 20",
    "unicode": "e06f",
    "terms": [
      "ABCs",
      "countdown",
      "covid-19",
      "happy birthday",
      "i will survive",
      "reminder",
      "seconds",
      "time",
      "timer"
    ]
  },
  {
    "name": "store",
    "label": "Store",
    "unicode": "f54e",
    "terms": [
      "bodega",
      "building",
      "buy",
      "market",
      "purchase",
      "shopping",
      "store"
    ]
  },
  {
    "name": "store-slash",
    "label": "Store Slash",
    "unicode": "e071",
    "terms": [
      "building",
      "buy",
      "closed",
      "covid-19",
      "disabled",
      "purchase",
      "shopping"
    ]
  },
  {
    "name": "street-view",
    "label": "Street View",
    "unicode": "f21d",
    "terms": [
      "directions",
      "location",
      "map",
      "navigation",
      "uer"
    ]
  },
  {
    "name": "strikethrough",
    "label": "Strikethrough",
    "unicode": "f0cc",
    "terms": [
      "cancel",
      "edit",
      "font",
      "format",
      "modify",
      "text",
      "type"
    ]
  },
  {
    "name": "stroopwafel",
    "label": "Stroopwafel",
    "unicode": "f551",
    "terms": [
      "caramel",
      "cookie",
      "dessert",
      "sweets",
      "waffle"
    ]
  },
  {
    "name": "subscript",
    "label": "Subscript",
    "unicode": "f12c",
    "terms": [
      "edit",
      "font",
      "format",
      "text",
      "type"
    ]
  },
  {
    "name": "suitcase",
    "label": "Suitcase",
    "unicode": "f0f2",
    "terms": [
      "baggage",
      "luggage",
      "move",
      "packing",
      "suitcase",
      "travel",
      "trip"
    ]
  },
  {
    "name": "suitcase-medical",
    "label": "Suitcase Medical",
    "unicode": "f0fa",
    "terms": [
      "first aid",
      "firstaid",
      "health",
      "help",
      "medical",
      "supply",
      "support"
    ]
  },
  {
    "name": "suitcase-rolling",
    "label": "Suitcase Rolling",
    "unicode": "f5c1",
    "terms": [
      "baggage",
      "luggage",
      "move",
      "suitcase",
      "travel",
      "trip"
    ]
  },
  {
    "name": "sun",
    "label": "Sun",
    "unicode": "f185",
    "terms": [
      "bright",
      "brighten",
      "contrast",
      "day",
      "lighter",
      "rays",
      "sol",
      "solar",
      "star",
      "sun",
      "sunny",
      "weather"
    ]
  },
  {
    "name": "sun-plant-wilt",
    "label": "Sun Plant Wilt",
    "unicode": "e57a",
    "terms": [
      "arid",
      "droop",
      "drought"
    ]
  },
  {
    "name": "superscript",
    "label": "Superscript",
    "unicode": "f12b",
    "terms": [
      "edit",
      "exponential",
      "font",
      "format",
      "text",
      "type"
    ]
  },
  {
    "name": "swatchbook",
    "label": "Swatchbook",
    "unicode": "f5c3",
    "terms": [
      "Pantone",
      "color",
      "design",
      "hue",
      "palette"
    ]
  },
  {
    "name": "synagogue",
    "label": "Synagogue",
    "unicode": "f69b",
    "terms": [
      "Jew",
      "Jewish",
      "building",
      "jewish",
      "judaism",
      "religion",
      "star of david",
      "synagogue",
      "temple"
    ]
  },
  {
    "name": "syringe",
    "label": "Syringe",
    "unicode": "f48e",
    "terms": [
      "covid-19",
      "doctor",
      "immunizations",
      "medical",
      "medicine",
      "needle",
      "shot",
      "sick",
      "syringe",
      "vaccinate",
      "vaccine"
    ]
  },
  {
    "name": "t",
    "label": "T",
    "unicode": "54",
    "terms": [
      "Latin Capital Letter T",
      "Latin Small Letter T",
      "letter"
    ]
  },
  {
    "name": "table",
    "label": "Table",
    "unicode": "f0ce",
    "terms": [
      "category",
      "data",
      "excel",
      "spreadsheet"
    ]
  },
  {
    "name": "table-cells",
    "label": "Table Cells",
    "unicode": "f00a",
    "terms": [
      "blocks",
      "boxes",
      "category",
      "excel",
      "grid",
      "spreadsheet",
      "squares"
    ]
  },
  {
    "name": "table-cells-column-lock",
    "label": "Table Cells Column Lock",
    "unicode": "e678",
    "terms": [
      "blocks",
      "boxes",
      "category",
      "column",
      "excel",
      "grid",
      "lock",
      "spreadsheet",
      "squares"
    ]
  },
  {
    "name": "table-cells-large",
    "label": "Table Cells Large",
    "unicode": "f009",
    "terms": [
      "blocks",
      "boxes",
      "category",
      "excel",
      "grid",
      "spreadsheet",
      "squares"
    ]
  },
  {
    "name": "table-cells-row-lock",
    "label": "Table Cells Row Lock",
    "unicode": "e67a",
    "terms": [
      "blocks",
      "boxes",
      "category",
      "column",
      "column",
      "excel",
      "grid",
      "lock",
      "lock",
      "spreadsheet",
      "squares"
    ]
  },
  {
    "name": "table-cells-row-unlock",
    "label": "Table Cells Row Unlock",
    "unicode": "e691",
    "terms": [
      "blocks",
      "boxes",
      "category",
      "column",
      "column",
      "excel",
      "grid",
      "lock",
      "lock",
      "spreadsheet",
      "squares",
      "unlock"
    ]
  },
  {
    "name": "table-columns",
    "label": "Table Columns",
    "unicode": "f0db",
    "terms": [
      "browser",
      "category",
      "dashboard",
      "organize",
      "panes",
      "split"
    ]
  },
  {
    "name": "table-list",
    "label": "Table List",
    "unicode": "f00b",
    "terms": [
      "category",
      "cheatsheet",
      "checklist",
      "completed",
      "done",
      "finished",
      "ol",
      "summary",
      "todo",
      "ul"
    ]
  },
  {
    "name": "table-tennis-paddle-ball",
    "label": "Table Tennis Paddle Ball",
    "unicode": "f45d",
    "terms": [
      "ball",
      "bat",
      "game",
      "paddle",
      "ping pong",
      "table tennis"
    ]
  },
  {
    "name": "tablet",
    "label": "Tablet",
    "unicode": "f3fb",
    "terms": [
      "device",
      "kindle",
      "screen"
    ]
  },
  {
    "name": "tablet-button",
    "label": "Tablet Button",
    "unicode": "f10a",
    "terms": [
      "apple",
      "device",
      "ipad",
      "kindle",
      "screen"
    ]
  },
  {
    "name": "tablet-screen-button",
    "label": "Tablet Screen Button",
    "unicode": "f3fa",
    "terms": [
      "apple",
      "device",
      "ipad",
      "kindle",
      "screen"
    ]
  },
  {
    "name": "tablets",
    "label": "Tablets",
    "unicode": "f490",
    "terms": [
      "drugs",
      "medicine",
      "pills",
      "prescription"
    ]
  },
  {
    "name": "tachograph-digital",
    "label": "Tachograph Digital",
    "unicode": "f566",
    "terms": [
      "data",
      "distance",
      "speed",
      "tachometer"
    ]
  },
  {
    "name": "tag",
    "label": "Tag",
    "unicode": "f02b",
    "terms": [
      "discount",
      "labe",
      "label",
      "price",
      "shopping"
    ]
  },
  {
    "name": "tags",
    "label": "Tags",
    "unicode": "f02c",
    "terms": [
      "discount",
      "label",
      "price",
      "shopping"
    ]
  },
  {
    "name": "tape",
    "label": "Tape",
    "unicode": "f4db",
    "terms": [
      "design",
      "package",
      "sticky"
    ]
  },
  {
    "name": "tarp",
    "label": "Tarp",
    "unicode": "e57b",
    "terms": [
      "protection",
      "tarp",
      "tent",
      "waterproof"
    ]
  },
  {
    "name": "tarp-droplet",
    "label": "Tarp Droplet",
    "unicode": "e57c",
    "terms": [
      "protection",
      "tarp",
      "tent",
      "waterproof"
    ]
  },
  {
    "name": "taxi",
    "label": "Taxi",
    "unicode": "f1ba",
    "terms": [
      "cab",
      "cabbie",
      "car",
      "car service",
      "lyft",
      "machine",
      "oncoming",
      "oncoming taxi",
      "taxi",
      "transportation",
      "travel",
      "uber",
      "vehicle"
    ]
  },
  {
    "name": "teeth",
    "label": "Teeth",
    "unicode": "f62e",
    "terms": [
      "bite",
      "dental",
      "dentist",
      "gums",
      "mouth",
      "smile",
      "tooth"
    ]
  },
  {
    "name": "teeth-open",
    "label": "Teeth Open",
    "unicode": "f62f",
    "terms": [
      "dental",
      "dentist",
      "gums bite",
      "mouth",
      "smile",
      "tooth"
    ]
  },
  {
    "name": "temperature-arrow-down",
    "label": "Temperature Arrow Down",
    "unicode": "e03f",
    "terms": [
      "air conditioner",
      "cold",
      "heater",
      "mercury",
      "thermometer",
      "winter"
    ]
  },
  {
    "name": "temperature-arrow-up",
    "label": "Temperature Arrow Up",
    "unicode": "e040",
    "terms": [
      "air conditioner",
      "cold",
      "heater",
      "mercury",
      "thermometer",
      "winter"
    ]
  },
  {
    "name": "temperature-empty",
    "label": "Temperature Empty",
    "unicode": "f2cb",
    "terms": [
      "cold",
      "mercury",
      "status",
      "temperature"
    ]
  },
  {
    "name": "temperature-full",
    "label": "Temperature Full",
    "unicode": "f2c7",
    "terms": [
      "fever",
      "hot",
      "mercury",
      "status",
      "temperature"
    ]
  },
  {
    "name": "temperature-half",
    "label": "Temperature Half",
    "unicode": "f2c9",
    "terms": [
      "mercury",
      "status",
      "temperature",
      "thermometer",
      "weather"
    ]
  },
  {
    "name": "temperature-high",
    "label": "Temperature High",
    "unicode": "f769",
    "terms": [
      "cook",
      "covid-19",
      "mercury",
      "summer",
      "thermometer",
      "warm"
    ]
  },
  {
    "name": "temperature-low",
    "label": "Temperature Low",
    "unicode": "f76b",
    "terms": [
      "cold",
      "cool",
      "covid-19",
      "mercury",
      "thermometer",
      "winter"
    ]
  },
  {
    "name": "temperature-quarter",
    "label": "Temperature Quarter",
    "unicode": "f2ca",
    "terms": [
      "mercury",
      "status",
      "temperature"
    ]
  },
  {
    "name": "temperature-three-quarters",
    "label": "Temperature Three Quarters",
    "unicode": "f2c8",
    "terms": [
      "mercury",
      "status",
      "temperature"
    ]
  },
  {
    "name": "tenge-sign",
    "label": "Tenge Sign",
    "unicode": "f7d7",
    "terms": [
      "Tenge Sign",
      "currency"
    ]
  },
  {
    "name": "tent",
    "label": "Tent",
    "unicode": "e57d",
    "terms": [
      "bivouac",
      "campground",
      "campsite",
      "refugee",
      "shelter",
      "tent"
    ]
  },
  {
    "name": "tent-arrow-down-to-line",
    "label": "Tent Arrow Down To Line",
    "unicode": "e57e",
    "terms": [
      "bivouac",
      "campground",
      "campsite",
      "permanent",
      "refugee",
      "refugee",
      "shelter",
      "shelter",
      "tent"
    ]
  },
  {
    "name": "tent-arrow-left-right",
    "label": "Tent Arrow Left Right",
    "unicode": "e57f",
    "terms": [
      "bivouac",
      "campground",
      "campsite",
      "refugee",
      "refugee",
      "shelter",
      "shelter",
      "tent",
      "transition"
    ]
  },
  {
    "name": "tent-arrow-turn-left",
    "label": "Tent Arrow Turn Left",
    "unicode": "e580",
    "terms": [
      "bivouac",
      "campground",
      "campsite",
      "refugee",
      "refugee",
      "shelter",
      "shelter",
      "temporary",
      "tent"
    ]
  },
  {
    "name": "tent-arrows-down",
    "label": "Tent Arrows Down",
    "unicode": "e581",
    "terms": [
      "bivouac",
      "campground",
      "campsite",
      "insert",
      "refugee",
      "refugee",
      "shelter",
      "shelter",
      "spontaneous",
      "tent"
    ]
  },
  {
    "name": "tents",
    "label": "Tents",
    "unicode": "e582",
    "terms": [
      "bivouac",
      "bivouac",
      "campground",
      "campground",
      "campsite",
      "refugee",
      "refugee",
      "shelter",
      "shelter",
      "tent",
      "tent"
    ]
  },
  {
    "name": "terminal",
    "label": "Terminal",
    "unicode": "f120",
    "terms": [
      "code",
      "coding",
      "command",
      "console",
      "development",
      "prompt",
      "terminal"
    ]
  },
  {
    "name": "text-height",
    "label": "Text Height",
    "unicode": "f034",
    "terms": [
      "edit",
      "font",
      "format",
      "modify",
      "text",
      "type"
    ]
  },
  {
    "name": "text-slash",
    "label": "Text Slash",
    "unicode": "f87d",
    "terms": [
      "cancel",
      "disabled",
      "font",
      "format",
      "remove",
      "style",
      "text"
    ]
  },
  {
    "name": "text-width",
    "label": "Text Width",
    "unicode": "f035",
    "terms": [
      "edit",
      "font",
      "format",
      "modify",
      "text",
      "type"
    ]
  },
  {
    "name": "thermometer",
    "label": "Thermometer",
    "unicode": "f491",
    "terms": [
      "covid-19",
      "mercury",
      "status",
      "temperature"
    ]
  },
  {
    "name": "thumbs-down",
    "label": "Thumbs Down",
    "unicode": "f165",
    "terms": [
      "-1",
      "disagree",
      "disapprove",
      "dislike",
      "down",
      "hand",
      "social",
      "thumb",
      "thumbs down",
      "thumbs-o-down"
    ]
  },
  {
    "name": "thumbs-up",
    "label": "Thumbs Up",
    "unicode": "f164",
    "terms": [
      "+1",
      "agree",
      "approve",
      "favorite",
      "hand",
      "like",
      "ok",
      "okay",
      "social",
      "success",
      "thumb",
      "thumbs up",
      "thumbs-o-up",
      "up",
      "yes",
      "you got it dude"
    ]
  },
  {
    "name": "thumbtack",
    "label": "Thumbtack",
    "unicode": "f08d",
    "terms": [
      "Black Pushpin",
      "coordinates",
      "location",
      "marker",
      "pin",
      "pushpin",
      "thumb-tack"
    ]
  },
  {
    "name": "thumbtack-slash",
    "label": "Thumbtack Slash",
    "unicode": "e68f",
    "terms": [
      "Black Pushpin",
      "coordinates",
      "location",
      "marker",
      "pin",
      "pushpin",
      "thumb-tack",
      "unpin"
    ]
  },
  {
    "name": "ticket",
    "label": "Ticket",
    "unicode": "f145",
    "terms": [
      "admission",
      "admission tickets",
      "coupon",
      "movie",
      "pass",
      "support",
      "ticket",
      "voucher"
    ]
  },
  {
    "name": "ticket-simple",
    "label": "Ticket Simple",
    "unicode": "f3ff",
    "terms": [
      "admission",
      "coupon",
      "movie",
      "pass",
      "support",
      "ticket",
      "voucher"
    ]
  },
  {
    "name": "timeline",
    "label": "Timeline",
    "unicode": "e29c",
    "terms": [
      "chronological",
      "deadline",
      "history",
      "linear"
    ]
  },
  {
    "name": "toggle-off",
    "label": "Toggle Off",
    "unicode": "f204",
    "terms": [
      "button",
      "off",
      "on",
      "switch"
    ]
  },
  {
    "name": "toggle-on",
    "label": "Toggle On",
    "unicode": "f205",
    "terms": [
      "button",
      "off",
      "on",
      "switch"
    ]
  },
  {
    "name": "toilet",
    "label": "Toilet",
    "unicode": "f7d8",
    "terms": [
      "bathroom",
      "flush",
      "john",
      "loo",
      "pee",
      "plumbing",
      "poop",
      "porcelain",
      "potty",
      "restroom",
      "throne",
      "toile",
      "toilet",
      "washroom",
      "waste",
      "wc"
    ]
  },
  {
    "name": "toilet-paper",
    "label": "Toilet Paper",
    "unicode": "f71e",
    "terms": [
      "bathroom",
      "covid-19",
      "halloween",
      "holiday",
      "lavatory",
      "paper towels",
      "prank",
      "privy",
      "restroom",
      "roll",
      "roll of paper",
      "toilet",
      "toilet paper",
      "wipe"
    ]
  },
  {
    "name": "toilet-paper-slash",
    "label": "Toilet Paper Slash",
    "unicode": "e072",
    "terms": [
      "bathroom",
      "covid-19",
      "disabled",
      "halloween",
      "holiday",
      "lavatory",
      "leaves",
      "prank",
      "privy",
      "restroom",
      "roll",
      "toilet",
      "trouble",
      "ut oh",
      "wipe"
    ]
  },
  {
    "name": "toilet-portable",
    "label": "Toilet Portable",
    "unicode": "e583",
    "terms": [
      "outhouse",
      "toilet"
    ]
  },
  {
    "name": "toilets-portable",
    "label": "Toilets Portable",
    "unicode": "e584",
    "terms": [
      "outhouse",
      "toilet"
    ]
  },
  {
    "name": "toolbox",
    "label": "Toolbox",
    "unicode": "f552",
    "terms": [
      "admin",
      "chest",
      "configuration",
      "container",
      "equipment",
      "fix",
      "maintenance",
      "mechanic",
      "modify",
      "repair",
      "settings",
      "tool",
      "toolbox",
      "tools"
    ]
  },
  {
    "name": "tooth",
    "label": "Tooth",
    "unicode": "f5c9",
    "terms": [
      "bicuspid",
      "dental",
      "dentist",
      "molar",
      "mouth",
      "teeth",
      "tooth"
    ]
  },
  {
    "name": "torii-gate",
    "label": "Torii Gate",
    "unicode": "f6a1",
    "terms": [
      "building",
      "religion",
      "shinto",
      "shinto shrine",
      "shintoism",
      "shrine"
    ]
  },
  {
    "name": "tornado",
    "label": "Tornado",
    "unicode": "f76f",
    "terms": [
      "cloud",
      "cyclone",
      "dorothy",
      "landspout",
      "tornado",
      "toto",
      "twister",
      "vortext",
      "waterspout",
      "weather",
      "whirlwind"
    ]
  },
  {
    "name": "tower-broadcast",
    "label": "Tower Broadcast",
    "unicode": "f519",
    "terms": [
      "airwaves",
      "antenna",
      "communication",
      "emergency",
      "radio",
      "reception",
      "signal",
      "waves"
    ]
  },
  {
    "name": "tower-cell",
    "label": "Tower Cell",
    "unicode": "e585",
    "terms": [
      "airwaves",
      "antenna",
      "communication",
      "radio",
      "reception",
      "signal",
      "waves"
    ]
  },
  {
    "name": "tower-observation",
    "label": "Tower Observation",
    "unicode": "e586",
    "terms": [
      "fire tower",
      "view"
    ]
  },
  {
    "name": "tractor",
    "label": "Tractor",
    "unicode": "f722",
    "terms": [
      "agriculture",
      "farm",
      "tractor",
      "vehicle"
    ]
  },
  {
    "name": "trademark",
    "label": "Trademark",
    "unicode": "f25c",
    "terms": [
      "copyright",
      "mark",
      "register",
      "symbol",
      "tm",
      "trade mark",
      "trademark"
    ]
  },
  {
    "name": "traffic-light",
    "label": "Traffic Light",
    "unicode": "f637",
    "terms": [
      "direction",
      "go",
      "light",
      "road",
      "signal",
      "slow",
      "stop",
      "traffic",
      "travel",
      "vertical traffic light"
    ]
  },
  {
    "name": "trailer",
    "label": "Trailer",
    "unicode": "e041",
    "terms": [
      "carry",
      "haul",
      "moving",
      "travel"
    ]
  },
  {
    "name": "train",
    "label": "Train",
    "unicode": "f238",
    "terms": [
      "bullet",
      "commute",
      "locomotive",
      "railway",
      "subway",
      "train"
    ]
  },
  {
    "name": "train-subway",
    "label": "Train Subway",
    "unicode": "f239",
    "terms": [
      "machine",
      "railway",
      "train",
      "transportation",
      "vehicle"
    ]
  },
  {
    "name": "train-tram",
    "label": "Train Tram",
    "unicode": "e5b4",
    "terms": [
      "crossing",
      "machine",
      "mountains",
      "seasonal",
      "tram",
      "transportation",
      "trolleybus"
    ]
  },
  {
    "name": "transgender",
    "label": "Transgender",
    "unicode": "f225",
    "terms": [
      "female",
      "gender",
      "intersex",
      "male",
      "transgender",
      "transgender symbol"
    ]
  },
  {
    "name": "trash",
    "label": "Trash",
    "unicode": "f1f8",
    "terms": [
      "delete",
      "garbage",
      "hide",
      "remove"
    ]
  },
  {
    "name": "trash-arrow-up",
    "label": "Trash Arrow Up",
    "unicode": "f829",
    "terms": [
      "back",
      "control z",
      "delete",
      "garbage",
      "hide",
      "oops",
      "remove",
      "undo",
      "upgrade"
    ]
  },
  {
    "name": "trash-can",
    "label": "Trash Can",
    "unicode": "f2ed",
    "terms": [
      "delete",
      "garbage",
      "hide",
      "remove",
      "trash-o"
    ]
  },
  {
    "name": "trash-can-arrow-up",
    "label": "Trash Can Arrow Up",
    "unicode": "f82a",
    "terms": [
      "back",
      "control z",
      "delete",
      "garbage",
      "hide",
      "oops",
      "remove",
      "undo",
      "upgrade"
    ]
  },
  {
    "name": "tree",
    "label": "Tree",
    "unicode": "f1bb",
    "terms": [
      "bark",
      "evergreen tree",
      "fall",
      "flora",
      "forest",
      "investment",
      "nature",
      "plant",
      "seasonal",
      "tree"
    ]
  },
  {
    "name": "tree-city",
    "label": "Tree City",
    "unicode": "e587",
    "terms": [
      "building",
      "city",
      "urban"
    ]
  },
  {
    "name": "triangle-exclamation",
    "label": "Triangle Exclamation",
    "unicode": "f071",
    "terms": [
      "alert",
      "attention",
      "danger",
      "error",
      "failed",
      "important",
      "notice",
      "notification",
      "notify",
      "problem",
      "required",
      "warnin",
      "warning"
    ]
  },
  {
    "name": "trophy",
    "label": "Trophy",
    "unicode": "f091",
    "terms": [
      "achievement",
      "award",
      "cup",
      "game",
      "prize",
      "trophy",
      "winner"
    ]
  },
  {
    "name": "trowel",
    "label": "Trowel",
    "unicode": "e589",
    "terms": [
      "build",
      "construction",
      "equipment",
      "maintenance",
      "tool"
    ]
  },
  {
    "name": "trowel-bricks",
    "label": "Trowel Bricks",
    "unicode": "e58a",
    "terms": [
      "build",
      "construction",
      "maintenance",
      "reconstruction",
      "tool"
    ]
  },
  {
    "name": "truck",
    "label": "Truck",
    "unicode": "f0d1",
    "terms": [
      "Black Truck",
      "cargo",
      "delivery",
      "delivery truck",
      "shipping",
      "truck",
      "vehicle"
    ]
  },
  {
    "name": "truck-arrow-right",
    "label": "Truck Arrow Right",
    "unicode": "e58b",
    "terms": [
      "access",
      "fast",
      "shipping",
      "transport"
    ]
  },
  {
    "name": "truck-droplet",
    "label": "Truck Droplet",
    "unicode": "e58c",
    "terms": [
      "blood",
      "thirst",
      "truck",
      "water",
      "water supply"
    ]
  },
  {
    "name": "truck-fast",
    "label": "Truck Fast",
    "unicode": "f48b",
    "terms": [
      "express",
      "fedex",
      "mail",
      "overnight",
      "package",
      "quick",
      "ups"
    ]
  },
  {
    "name": "truck-field",
    "label": "Truck Field",
    "unicode": "e58d",
    "terms": [
      "supplies",
      "truck"
    ]
  },
  {
    "name": "truck-field-un",
    "label": "Truck Field Un",
    "unicode": "e58e",
    "terms": [
      "supplies",
      "truck",
      "united nations"
    ]
  },
  {
    "name": "truck-front",
    "label": "Truck Front",
    "unicode": "e2b7",
    "terms": [
      "shuttle",
      "truck",
      "van"
    ]
  },
  {
    "name": "truck-medical",
    "label": "Truck Medical",
    "unicode": "f0f9",
    "terms": [
      "ambulance",
      "clinic",
      "covid-19",
      "emergency",
      "emt",
      "er",
      "help",
      "hospital",
      "mobile",
      "support",
      "vehicle"
    ]
  },
  {
    "name": "truck-monster",
    "label": "Truck Monster",
    "unicode": "f63b",
    "terms": [
      "offroad",
      "vehicle",
      "wheel"
    ]
  },
  {
    "name": "truck-moving",
    "label": "Truck Moving",
    "unicode": "f4df",
    "terms": [
      "cargo",
      "inventory",
      "rental",
      "vehicle"
    ]
  },
  {
    "name": "truck-pickup",
    "label": "Truck Pickup",
    "unicode": "f63c",
    "terms": [
      "cargo",
      "maintenance",
      "pick-up",
      "pickup",
      "pickup truck",
      "truck",
      "vehicle"
    ]
  },
  {
    "name": "truck-plane",
    "label": "Truck Plane",
    "unicode": "e58f",
    "terms": [
      "airplane",
      "plane",
      "transportation",
      "truck",
      "vehicle"
    ]
  },
  {
    "name": "truck-ramp-box",
    "label": "Truck Ramp Box",
    "unicode": "f4de",
    "terms": [
      "box",
      "cargo",
      "delivery",
      "inventory",
      "moving",
      "rental",
      "vehicle"
    ]
  },
  {
    "name": "tty",
    "label": "Tty",
    "unicode": "f1e4",
    "terms": [
      "communication",
      "deaf",
      "telephone",
      "teletypewriter",
      "text"
    ]
  },
  {
    "name": "turkish-lira-sign",
    "label": "Turkish Lira Sign",
    "unicode": "e2bb",
    "terms": [
      "Turkish Lira Sign",
      "currency"
    ]
  },
  {
    "name": "turn-down",
    "label": "Turn Down",
    "unicode": "f3be",
    "terms": [
      "arrow",
      "down",
      "level-down",
      "right arrow curving down"
    ]
  },
  {
    "name": "turn-up",
    "label": "Turn Up",
    "unicode": "f3bf",
    "terms": [
      "arrow",
      "level-up",
      "right arrow curving up"
    ]
  },
  {
    "name": "tv",
    "label": "Tv",
    "unicode": "f26c",
    "terms": [
      "computer",
      "display",
      "monitor",
      "television"
    ]
  },
  {
    "name": "u",
    "label": "U",
    "unicode": "55",
    "terms": [
      "Latin Capital Letter U",
      "Latin Small Letter U",
      "letter"
    ]
  },
  {
    "name": "umbrella",
    "label": "Umbrella",
    "unicode": "f0e9",
    "terms": [
      "protection",
      "rain",
      "storm",
      "wet"
    ]
  },
  {
    "name": "umbrella-beach",
    "label": "Umbrella Beach",
    "unicode": "f5ca",
    "terms": [
      "beach",
      "beach with umbrella",
      "protection",
      "recreation",
      "sand",
      "shade",
      "summer",
      "sun",
      "umbrella"
    ]
  },
  {
    "name": "underline",
    "label": "Underline",
    "unicode": "f0cd",
    "terms": [
      "edit",
      "emphasis",
      "format",
      "modify",
      "text",
      "writing"
    ]
  },
  {
    "name": "universal-access",
    "label": "Universal Access",
    "unicode": "f29a",
    "terms": [
      "uer",
      "users-people"
    ]
  },
  {
    "name": "unlock",
    "label": "Unlock",
    "unicode": "f09c",
    "terms": [
      "admin",
      "lock",
      "open",
      "padlock",
      "password",
      "privacy",
      "private",
      "protect",
      "unlock",
      "unlocked"
    ]
  },
  {
    "name": "unlock-keyhole",
    "label": "Unlock Keyhole",
    "unicode": "f13e",
    "terms": [
      "admin",
      "lock",
      "padlock",
      "password",
      "privacy",
      "private",
      "protect"
    ]
  },
  {
    "name": "up-down",
    "label": "Up Down",
    "unicode": "f338",
    "terms": [
      "Up Down Black Arrow",
      "arrow",
      "arrows-v",
      "expand",
      "portrait",
      "resize",
      "tall",
      "up-down arrow",
      "vertical"
    ]
  },
  {
    "name": "up-down-left-right",
    "label": "Up Down Left Right",
    "unicode": "f0b2",
    "terms": [
      "arrow",
      "arrows",
      "bigger",
      "enlarge",
      "expand",
      "fullscreen",
      "move",
      "position",
      "reorder",
      "resize"
    ]
  },
  {
    "name": "up-long",
    "label": "Up Long",
    "unicode": "f30c",
    "terms": [
      "long-arrow-up",
      "upgrade",
      "upload"
    ]
  },
  {
    "name": "up-right-and-down-left-from-center",
    "label": "Up Right And Down Left From Center",
    "unicode": "f424",
    "terms": [
      "arrows",
      "bigger",
      "enlarge",
      "expand",
      "fullscreen",
      "maximize",
      "resize",
      "resize",
      "scale",
      "size"
    ]
  },
  {
    "name": "up-right-from-square",
    "label": "Up Right From Square",
    "unicode": "f35d",
    "terms": [
      "external-link",
      "new",
      "open",
      "share",
      "upgrade"
    ]
  },
  {
    "name": "upload",
    "label": "Upload",
    "unicode": "f093",
    "terms": [
      "hard drive",
      "import",
      "publish",
      "upgrade"
    ]
  },
  {
    "name": "user",
    "label": "User",
    "unicode": "f007",
    "terms": [
      "adult",
      "bust",
      "bust in silhouette",
      "default",
      "employee",
      "gender-neutral",
      "person",
      "profile",
      "silhouette",
      "uer",
      "unspecified gender",
      "username",
      "users-people"
    ]
  },
  {
    "name": "user-astronaut",
    "label": "User Astronaut",
    "unicode": "f4fb",
    "terms": [
      "avatar",
      "clothing",
      "cosmonaut",
      "nasa",
      "space",
      "suit",
      "uer"
    ]
  },
  {
    "name": "user-check",
    "label": "User Check",
    "unicode": "f4fc",
    "terms": [
      "employee",
      "enable",
      "uer",
      "users-people",
      "validate",
      "working"
    ]
  },
  {
    "name": "user-clock",
    "label": "User Clock",
    "unicode": "f4fd",
    "terms": [
      "employee",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-doctor",
    "label": "User Doctor",
    "unicode": "f0f0",
    "terms": [
      "covid-19",
      "health",
      "job",
      "medical",
      "nurse",
      "occupation",
      "physician",
      "profile",
      "surgeon",
      "uer",
      "worker"
    ]
  },
  {
    "name": "user-gear",
    "label": "User Gear",
    "unicode": "f4fe",
    "terms": [
      "employee",
      "together",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-graduate",
    "label": "User Graduate",
    "unicode": "f501",
    "terms": [
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-group",
    "label": "User Group",
    "unicode": "f500",
    "terms": [
      "bust",
      "busts in silhouette",
      "crowd",
      "employee",
      "silhouette",
      "together",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-injured",
    "label": "User Injured",
    "unicode": "f728",
    "terms": [
      "employee",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-large",
    "label": "User Large",
    "unicode": "f406",
    "terms": [
      "employee",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-large-slash",
    "label": "User Large Slash",
    "unicode": "f4fa",
    "terms": [
      "disabled",
      "disconnect",
      "employee",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-lock",
    "label": "User Lock",
    "unicode": "f502",
    "terms": [
      "employee",
      "padlock",
      "privacy",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-minus",
    "label": "User Minus",
    "unicode": "f503",
    "terms": [
      "delete",
      "employee",
      "negative",
      "remove",
      "uer"
    ]
  },
  {
    "name": "user-ninja",
    "label": "User Ninja",
    "unicode": "f504",
    "terms": [
      "assassin",
      "avatar",
      "dangerous",
      "deadly",
      "fighter",
      "hidden",
      "ninja",
      "sneaky",
      "stealth",
      "uer"
    ]
  },
  {
    "name": "user-nurse",
    "label": "User Nurse",
    "unicode": "f82f",
    "terms": [
      "covid-19",
      "doctor",
      "health",
      "md",
      "medical",
      "midwife",
      "physician",
      "practitioner",
      "surgeon",
      "uer",
      "worker"
    ]
  },
  {
    "name": "user-pen",
    "label": "User Pen",
    "unicode": "f4ff",
    "terms": [
      "employee",
      "modify",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-plus",
    "label": "User Plus",
    "unicode": "f234",
    "terms": [
      "add",
      "avatar",
      "employee",
      "follow",
      "positive",
      "sign up",
      "signup",
      "team",
      "uer"
    ]
  },
  {
    "name": "user-secret",
    "label": "User Secret",
    "unicode": "f21b",
    "terms": [
      "detective",
      "sleuth",
      "spy",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-shield",
    "label": "User Shield",
    "unicode": "f505",
    "terms": [
      "employee",
      "protect",
      "safety",
      "uer"
    ]
  },
  {
    "name": "user-slash",
    "label": "User Slash",
    "unicode": "f506",
    "terms": [
      "ban",
      "delete",
      "deny",
      "disabled",
      "disconnect",
      "employee",
      "remove",
      "uer"
    ]
  },
  {
    "name": "user-tag",
    "label": "User Tag",
    "unicode": "f507",
    "terms": [
      "employee",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "user-tie",
    "label": "User Tie",
    "unicode": "f508",
    "terms": [
      "administrator",
      "avatar",
      "business",
      "clothing",
      "employee",
      "formal",
      "offer",
      "portfolio",
      "professional",
      "suit",
      "uer"
    ]
  },
  {
    "name": "user-xmark",
    "label": "User Xmark",
    "unicode": "f235",
    "terms": [
      "archive",
      "delete",
      "employee",
      "remove",
      "uer",
      "uncheck",
      "x"
    ]
  },
  {
    "name": "users",
    "label": "Users",
    "unicode": "f0c0",
    "terms": [
      "employee",
      "together",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "users-between-lines",
    "label": "Users Between Lines",
    "unicode": "e591",
    "terms": [
      "covered",
      "crowd",
      "employee",
      "group",
      "people",
      "together",
      "uer"
    ]
  },
  {
    "name": "users-gear",
    "label": "Users Gear",
    "unicode": "f509",
    "terms": [
      "employee",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "users-line",
    "label": "Users Line",
    "unicode": "e592",
    "terms": [
      "crowd",
      "employee",
      "group",
      "need",
      "people",
      "together",
      "uer"
    ]
  },
  {
    "name": "users-rays",
    "label": "Users Rays",
    "unicode": "e593",
    "terms": [
      "affected",
      "crowd",
      "employee",
      "focused",
      "group",
      "people",
      "uer"
    ]
  },
  {
    "name": "users-rectangle",
    "label": "Users Rectangle",
    "unicode": "e594",
    "terms": [
      "crowd",
      "employee",
      "focus",
      "group",
      "people",
      "reached",
      "uer"
    ]
  },
  {
    "name": "users-slash",
    "label": "Users Slash",
    "unicode": "e073",
    "terms": [
      "disabled",
      "disconnect",
      "employee",
      "together",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "users-viewfinder",
    "label": "Users Viewfinder",
    "unicode": "e595",
    "terms": [
      "crowd",
      "focus",
      "group",
      "people",
      "targeted",
      "uer"
    ]
  },
  {
    "name": "utensils",
    "label": "Utensils",
    "unicode": "f2e7",
    "terms": [
      "cooking",
      "cutlery",
      "dining",
      "dinner",
      "eat",
      "food",
      "fork",
      "fork and knife",
      "knife",
      "restaurant"
    ]
  },
  {
    "name": "v",
    "label": "V",
    "unicode": "56",
    "terms": [
      "Latin Capital Letter V",
      "Latin Small Letter V",
      "letter"
    ]
  },
  {
    "name": "van-shuttle",
    "label": "Van Shuttle",
    "unicode": "f5b6",
    "terms": [
      "airport",
      "bus",
      "machine",
      "minibus",
      "public-transportation",
      "transportation",
      "travel",
      "vehicle"
    ]
  },
  {
    "name": "vault",
    "label": "Vault",
    "unicode": "e2c5",
    "terms": [
      "bank",
      "important",
      "investment",
      "lock",
      "money",
      "premium",
      "privacy",
      "safe",
      "salary"
    ]
  },
  {
    "name": "vector-square",
    "label": "Vector Square",
    "unicode": "f5cb",
    "terms": [
      "anchors",
      "lines",
      "object",
      "render",
      "shape"
    ]
  },
  {
    "name": "venus",
    "label": "Venus",
    "unicode": "f221",
    "terms": [
      "female",
      "female sign",
      "gender",
      "woman"
    ]
  },
  {
    "name": "venus-double",
    "label": "Venus Double",
    "unicode": "f226",
    "terms": [
      "Doubled Female Sign",
      "female",
      "gender",
      "lesbian"
    ]
  },
  {
    "name": "venus-mars",
    "label": "Venus Mars",
    "unicode": "f228",
    "terms": [
      "Interlocked Female and Male Sign",
      "female",
      "gender",
      "heterosexual",
      "male"
    ]
  },
  {
    "name": "vest",
    "label": "Vest",
    "unicode": "e085",
    "terms": [
      "biker",
      "fashion",
      "style"
    ]
  },
  {
    "name": "vest-patches",
    "label": "Vest Patches",
    "unicode": "e086",
    "terms": [
      "biker",
      "fashion",
      "style"
    ]
  },
  {
    "name": "vial",
    "label": "Vial",
    "unicode": "f492",
    "terms": [
      "ampule",
      "chemist",
      "chemistry",
      "experiment",
      "knowledge",
      "lab",
      "sample",
      "science",
      "test",
      "test tube"
    ]
  },
  {
    "name": "vial-circle-check",
    "label": "Vial Circle Check",
    "unicode": "e596",
    "terms": [
      "ampule",
      "chemist",
      "chemistry",
      "enable",
      "not affected",
      "ok",
      "okay",
      "success",
      "test tube",
      "tube",
      "vaccine",
      "validate",
      "working"
    ]
  },
  {
    "name": "vial-virus",
    "label": "Vial Virus",
    "unicode": "e597",
    "terms": [
      "ampule",
      "coronavirus",
      "covid-19",
      "flue",
      "infection",
      "lab",
      "laboratory",
      "pandemic",
      "test",
      "test tube",
      "vaccine"
    ]
  },
  {
    "name": "vials",
    "label": "Vials",
    "unicode": "f493",
    "terms": [
      "ampule",
      "experiment",
      "knowledge",
      "lab",
      "sample",
      "science",
      "test",
      "test tube"
    ]
  },
  {
    "name": "video",
    "label": "Video",
    "unicode": "f03d",
    "terms": [
      "camera",
      "film",
      "movie",
      "record",
      "video-camera"
    ]
  },
  {
    "name": "video-slash",
    "label": "Video Slash",
    "unicode": "f4e2",
    "terms": [
      "add",
      "create",
      "disabled",
      "disconnect",
      "film",
      "new",
      "positive",
      "record",
      "video"
    ]
  },
  {
    "name": "vihara",
    "label": "Vihara",
    "unicode": "f6a7",
    "terms": [
      "buddhism",
      "buddhist",
      "building",
      "monastery"
    ]
  },
  {
    "name": "virus",
    "label": "Virus",
    "unicode": "e074",
    "terms": [
      "bug",
      "coronavirus",
      "covid-19",
      "flu",
      "health",
      "infection",
      "pandemic",
      "sick",
      "vaccine",
      "viral"
    ]
  },
  {
    "name": "virus-covid",
    "label": "Virus Covid",
    "unicode": "e4a8",
    "terms": [
      "bug",
      "covid-19",
      "flu",
      "health",
      "infection",
      "pandemic",
      "vaccine",
      "viral",
      "virus"
    ]
  },
  {
    "name": "virus-covid-slash",
    "label": "Virus Covid Slash",
    "unicode": "e4a9",
    "terms": [
      "bug",
      "covid-19",
      "disabled",
      "flu",
      "health",
      "infection",
      "pandemic",
      "vaccine",
      "viral",
      "virus"
    ]
  },
  {
    "name": "virus-slash",
    "label": "Virus Slash",
    "unicode": "e075",
    "terms": [
      "bug",
      "coronavirus",
      "covid-19",
      "cure",
      "disabled",
      "eliminate",
      "flu",
      "health",
      "infection",
      "pandemic",
      "sick",
      "vaccine",
      "viral"
    ]
  },
  {
    "name": "viruses",
    "label": "Viruses",
    "unicode": "e076",
    "terms": [
      "bugs",
      "coronavirus",
      "covid-19",
      "flu",
      "health",
      "infection",
      "multiply",
      "pandemic",
      "sick",
      "spread",
      "vaccine",
      "viral"
    ]
  },
  {
    "name": "voicemail",
    "label": "Voicemail",
    "unicode": "f897",
    "terms": [
      "answer",
      "inbox",
      "message",
      "phone"
    ]
  },
  {
    "name": "volcano",
    "label": "Volcano",
    "unicode": "f770",
    "terms": [
      "caldera",
      "eruption",
      "lava",
      "magma",
      "mountain",
      "smoke",
      "volcano"
    ]
  },
  {
    "name": "volleyball",
    "label": "Volleyball",
    "unicode": "f45f",
    "terms": [
      "ball",
      "beach",
      "game",
      "olympics",
      "sport",
      "volleyball"
    ]
  },
  {
    "name": "volume-high",
    "label": "Volume High",
    "unicode": "f028",
    "terms": [
      "audio",
      "higher",
      "loud",
      "louder",
      "music",
      "sound",
      "speaker",
      "speaker high volume"
    ]
  },
  {
    "name": "volume-low",
    "label": "Volume Low",
    "unicode": "f027",
    "terms": [
      "audio",
      "lower",
      "music",
      "quieter",
      "soft",
      "sound",
      "speaker",
      "speaker low volume"
    ]
  },
  {
    "name": "volume-off",
    "label": "Volume Off",
    "unicode": "f026",
    "terms": [
      "audio",
      "ban",
      "music",
      "mute",
      "quiet",
      "silent",
      "sound"
    ]
  },
  {
    "name": "volume-xmark",
    "label": "Volume Xmark",
    "unicode": "f6a9",
    "terms": [
      "audio",
      "music",
      "quiet",
      "sound",
      "speaker"
    ]
  },
  {
    "name": "vr-cardboard",
    "label": "Vr Cardboard",
    "unicode": "f729",
    "terms": [
      "3d",
      "augment",
      "google",
      "reality",
      "virtual"
    ]
  },
  {
    "name": "w",
    "label": "W",
    "unicode": "57",
    "terms": [
      "Latin Capital Letter W",
      "Latin Small Letter W",
      "letter"
    ]
  },
  {
    "name": "walkie-talkie",
    "label": "Walkie Talkie",
    "unicode": "f8ef",
    "terms": [
      "communication",
      "copy",
      "intercom",
      "over",
      "portable",
      "radio",
      "two way radio"
    ]
  },
  {
    "name": "wallet",
    "label": "Wallet",
    "unicode": "f555",
    "terms": [
      "billfold",
      "cash",
      "currency",
      "money",
      "salary"
    ]
  },
  {
    "name": "wand-magic",
    "label": "Wand Magic",
    "unicode": "f0d0",
    "terms": [
      "autocomplete",
      "automatic",
      "mage",
      "magic",
      "spell",
      "wand",
      "witch",
      "wizard"
    ]
  },
  {
    "name": "wand-magic-sparkles",
    "label": "Wand Magic Sparkles",
    "unicode": "e2ca",
    "terms": [
      "auto",
      "magic",
      "magic wand",
      "trick",
      "witch",
      "wizard"
    ]
  },
  {
    "name": "wand-sparkles",
    "label": "Wand Sparkles",
    "unicode": "f72b",
    "terms": [
      "autocomplete",
      "automatic",
      "fantasy",
      "halloween",
      "holiday",
      "magic",
      "weapon",
      "witch",
      "wizard"
    ]
  },
  {
    "name": "warehouse",
    "label": "Warehouse",
    "unicode": "f494",
    "terms": [
      "building",
      "capacity",
      "garage",
      "inventory",
      "storage"
    ]
  },
  {
    "name": "water",
    "label": "Water",
    "unicode": "f773",
    "terms": [
      "lake",
      "liquid",
      "ocean",
      "sea",
      "swim",
      "wet"
    ]
  },
  {
    "name": "water-ladder",
    "label": "Water Ladder",
    "unicode": "f5c5",
    "terms": [
      "ladder",
      "recreation",
      "swim",
      "water"
    ]
  },
  {
    "name": "wave-square",
    "label": "Wave Square",
    "unicode": "f83e",
    "terms": [
      "frequency",
      "pulse",
      "signal"
    ]
  },
  {
    "name": "web-awesome",
    "label": "Web Awesome",
    "unicode": "e682",
    "terms": [
      "awesome",
      "coding",
      "components",
      "crown",
      "web"
    ]
  },
  {
    "name": "weight-hanging",
    "label": "Weight Hanging",
    "unicode": "f5cd",
    "terms": [
      "anvil",
      "heavy",
      "measurement"
    ]
  },
  {
    "name": "weight-scale",
    "label": "Weight Scale",
    "unicode": "f496",
    "terms": [
      "health",
      "measurement",
      "scale",
      "weight"
    ]
  },
  {
    "name": "wheat-awn",
    "label": "Wheat Awn",
    "unicode": "e2cd",
    "terms": [
      "agriculture",
      "autumn",
      "fall",
      "farming",
      "grain"
    ]
  },
  {
    "name": "wheat-awn-circle-exclamation",
    "label": "Wheat Awn Circle Exclamation",
    "unicode": "e598",
    "terms": [
      "affected",
      "failed",
      "famine",
      "food",
      "gluten",
      "hunger",
      "starve",
      "straw"
    ]
  },
  {
    "name": "wheelchair",
    "label": "Wheelchair",
    "unicode": "f193",
    "terms": [
      "disabled",
      "uer",
      "users-people"
    ]
  },
  {
    "name": "wheelchair-move",
    "label": "Wheelchair Move",
    "unicode": "e2ce",
    "terms": [
      "access",
      "disabled",
      "handicap",
      "impairment",
      "physical",
      "uer",
      "wheelchair symbol"
    ]
  },
  {
    "name": "whiskey-glass",
    "label": "Whiskey Glass",
    "unicode": "f7a0",
    "terms": [
      "alcohol",
      "bar",
      "beverage",
      "bourbon",
      "drink",
      "glass",
      "liquor",
      "neat",
      "rye",
      "scotch",
      "shot",
      "tumbler",
      "tumbler glass",
      "whisky"
    ]
  },
  {
    "name": "wifi",
    "label": "Wifi",
    "unicode": "f1eb",
    "terms": [
      "connection",
      "hotspot",
      "internet",
      "network",
      "signal",
      "wireless",
      "www"
    ]
  },
  {
    "name": "wind",
    "label": "Wind",
    "unicode": "f72e",
    "terms": [
      "air",
      "blow",
      "breeze",
      "fall",
      "seasonal",
      "weather"
    ]
  },
  {
    "name": "window-maximize",
    "label": "Window Maximize",
    "unicode": "f2d0",
    "terms": [
      "Maximize",
      "browser",
      "computer",
      "development",
      "expand"
    ]
  },
  {
    "name": "window-minimize",
    "label": "Window Minimize",
    "unicode": "f2d1",
    "terms": [
      "Minimize",
      "browser",
      "collapse",
      "computer",
      "development"
    ]
  },
  {
    "name": "window-restore",
    "label": "Window Restore",
    "unicode": "f2d2",
    "terms": [
      "browser",
      "computer",
      "development"
    ]
  },
  {
    "name": "wine-bottle",
    "label": "Wine Bottle",
    "unicode": "f72f",
    "terms": [
      "alcohol",
      "beverage",
      "cabernet",
      "drink",
      "glass",
      "grapes",
      "merlot",
      "sauvignon"
    ]
  },
  {
    "name": "wine-glass",
    "label": "Wine Glass",
    "unicode": "f4e3",
    "terms": [
      "alcohol",
      "bar",
      "beverage",
      "cabernet",
      "drink",
      "glass",
      "grapes",
      "merlot",
      "sauvignon",
      "wine",
      "wine glass"
    ]
  },
  {
    "name": "wine-glass-empty",
    "label": "Wine Glass Empty",
    "unicode": "f5ce",
    "terms": [
      "alcohol",
      "beverage",
      "cabernet",
      "drink",
      "grapes",
      "merlot",
      "sauvignon"
    ]
  },
  {
    "name": "won-sign",
    "label": "Won Sign",
    "unicode": "f159",
    "terms": [
      "Won Sign",
      "currency"
    ]
  },
  {
    "name": "worm",
    "label": "Worm",
    "unicode": "e599",
    "terms": [
      "dirt",
      "garden",
      "worm",
      "wriggle"
    ]
  },
  {
    "name": "wrench",
    "label": "Wrench",
    "unicode": "f0ad",
    "terms": [
      "configuration",
      "construction",
      "equipment",
      "fix",
      "mechanic",
      "modify",
      "plumbing",
      "settings",
      "spanner",
      "tool",
      "update",
      "wrench"
    ]
  },
  {
    "name": "x",
    "label": "X",
    "unicode": "58",
    "terms": [
      "Latin Capital Letter X",
      "Latin Small Letter X",
      "letter",
      "uncheck"
    ]
  },
  {
    "name": "x-ray",
    "label": "X Ray",
    "unicode": "f497",
    "terms": [
      "health",
      "medical",
      "radiological images",
      "radiology",
      "skeleton"
    ]
  },
  {
    "name": "xmark",
    "label": "Xmark",
    "unicode": "f00d",
    "terms": [
      "Cancellation X",
      "Multiplication Sign",
      "Multiplication X",
      "cancel",
      "close",
      "cross",
      "cross mark",
      "error",
      "exit",
      "incorrect",
      "mark",
      "multiplication",
      "multiply",
      "notice",
      "notification",
      "notify",
      "problem",
      "sign",
      "uncheck",
      "wrong",
      "x",
      "×"
    ]
  },
  {
    "name": "xmarks-lines",
    "label": "Xmarks Lines",
    "unicode": "e59a",
    "terms": [
      "barricade",
      "barrier",
      "fence",
      "poison",
      "roadblock"
    ]
  },
  {
    "name": "y",
    "label": "Y",
    "unicode": "59",
    "terms": [
      "Latin Capital Letter Y",
      "Latin Small Letter Y",
      "letter",
      "yay",
      "yes"
    ]
  },
  {
    "name": "yen-sign",
    "label": "Yen Sign",
    "unicode": "f157",
    "terms": [
      "Yen Sign",
      "currency"
    ]
  },
  {
    "name": "yin-yang",
    "label": "Yin Yang",
    "unicode": "f6ad",
    "terms": [
      "daoism",
      "opposites",
      "religion",
      "tao",
      "taoism",
      "taoist",
      "yang",
      "yin",
      "yin yang"
    ]
  },
  {
    "name": "z",
    "label": "Z",
    "unicode": "5a",
    "terms": [
      "Latin Capital Letter Z",
      "Latin Small Letter Z",
      "letter"
    ]
  }
];
