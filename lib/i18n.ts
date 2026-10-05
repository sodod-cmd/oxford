import type { LevelId } from './data'

export const locales = ['en', 'mn'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const LOCALE_COOKIE = 'locale'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

const en = {
  meta: {
    title: 'Oxford Discover 3–6',
    description: 'Read Oxford Discover Level 3–6 books and listen to their audio on phone, tablet or computer.',
    levelDescription: (name: string, count: number) => `Oxford Discover ${name}: ${count} books with audio.`,
    bookDescription: (title: string) => `Read ${title} and listen to its audio.`,
  },
  language: { label: 'Language', en: 'English', mn: 'Монгол' },
  home: {
    eyebrow: 'For students',
    title: 'Read, listen, discover the world.',
    intro: (count: number) =>
      `All ${count} Oxford Discover books and their audio in one place. Choose your level and open any book.`,
    chooseLevel: 'Choose your level',
  },
  level: {
    allLevels: 'All levels',
    booksWithAudio: (count: number) => `${count} books, each with audio`,
    booksAndAudio: (count: number) => `${count} books · ${count} audio`,
    cardLabel: (name: string, label: string, count: number) => `${name} — ${label}, ${count} books`,
    switcher: 'Switch level',
    meta: {
      '3': { label: 'Beginner', description: 'Nature, senses and celebrations — get to know the everyday world.' },
      '4': { label: 'Elementary', description: 'Oceans, deserts, plants and machines — explore the wonders of the world.' },
      '5': { label: 'Intermediate', description: 'Migration, weather, medicine and transport — compare past and present.' },
      '6': { label: 'Advanced', description: 'Space, energy and ecosystems — dive into deeper topics.' },
    } satisfies Record<LevelId, { label: string; description: string }>,
  },
  reader: {
    backTo: (level: string) => `Back to Level ${level}`,
    downloadPdf: 'Download PDF',
    preparing: 'Preparing the reader',
    pleaseWait: 'Please wait…',
    loadingBook: 'Loading the book, please wait',
    loadingBookMessage: (mb: string) =>
      `This book is ${mb} MB, so it may take a little while depending on your internet speed. Please keep this page open.`,
    downloaded: (loaded: string, total: string) => `${loaded} / ${total} MB downloaded`,
    connecting: 'Connecting…',
    loadFailed: 'Could not load the book',
    loadFailedMessage: 'Please check your internet connection and try again, or open the file directly.',
    retry: 'Try again',
    openDirect: 'Open directly',
    preparingPage: (page: number) => `Preparing page ${page}`,
    zoomOut: 'Zoom out',
    zoomIn: 'Zoom in',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    pageOf: (title: string) => `${title}, page `,
  },
  audio: {
    section: 'Audio',
    loading: 'Loading audio, please wait',
    buffering: 'Loading more audio…',
    loadingMessage: (mb: string) => `The audio file is ${mb} MB, so it may take a few seconds to start.`,
    error: 'Could not load the audio. Check your internet connection and press play again.',
    play: 'Play',
    pause: 'Pause',
    position: 'Audio position',
    back10: 'Back 10 seconds',
    forward10: 'Forward 10 seconds',
    seconds: 's',
    speed: 'Playback speed',
  },
  footer: { rights: 'All rights reserved.' },
}

export type Dictionary = typeof en

const mn: Dictionary = {
  meta: {
    title: 'Oxford Discover 3–6',
    description: 'Oxford Discover 3–6-р түвшний ном болон сонсгол материалыг утас, таблет, компьютероос уншиж, сонсоорой.',
    levelDescription: (name, count) => `Oxford Discover ${name}: ${count} ном болон сонсгол материал.`,
    bookDescription: (title) => `${title} номыг уншиж, сонсгол материалыг сонсох.`,
  },
  language: { label: 'Хэл', en: 'English', mn: 'Монгол' },
  home: {
    eyebrow: 'Сурагчдад зориулсан',
    title: 'Уншиж, сонсож, ертөнцийг нээ.',
    intro: (count) =>
      `Oxford Discover-ын ${count} ном болон тэдгээрийн сонсгол материал нэг дор. Түвшнээ сонгоод хүссэн номоо нээгээрэй.`,
    chooseLevel: 'Түвшнээ сонгоно уу',
  },
  level: {
    allLevels: 'Бүх түвшин',
    booksWithAudio: (count) => `${count} ном, тус бүр сонсгол материалтай`,
    booksAndAudio: (count) => `${count} ном · ${count} аудио`,
    cardLabel: (name, label, count) => `${name} — ${label}, ${count} ном`,
    switcher: 'Түвшин солих',
    meta: {
      '3': { label: 'Анхан шат', description: 'Байгаль, мэдрэхүй, баяр ёслол — өдөр тутмын ертөнцийг танина.' },
      '4': { label: 'Суурь шат', description: 'Далай, цөл, ургамал, машин — ертөнцийн гайхамшгийг судална.' },
      '5': { label: 'Дунд шат', description: 'Нүүдэл, цаг агаар, эм, тээвэр — өнгөрсөн ба одоог харьцуулна.' },
      '6': { label: 'Ахисан шат', description: 'Сансар, эрчим хүч, экосистем — илүү гүнзгий сэдвүүдийг нээнэ.' },
    },
  },
  reader: {
    backTo: (level) => `Level ${level} руу буцах`,
    downloadPdf: 'PDF татах',
    preparing: 'Уншигчийг бэлтгэж байна',
    pleaseWait: 'Түр хүлээнэ үү…',
    loadingBook: 'Ном ачаалж байна, түр хүлээнэ үү',
    loadingBookMessage: (mb) =>
      `Энэ ном ${mb} MB хэмжээтэй тул интернэтийн хурдаас хамааран хэсэг хугацаа шаардагдаж магадгүй. Хуудсыг хааж болохгүй.`,
    downloaded: (loaded, total) => `${loaded} / ${total} MB татагдлаа`,
    connecting: 'Холболт тогтоож байна…',
    loadFailed: 'Номыг ачаалж чадсангүй',
    loadFailedMessage: 'Интернэт холболтоо шалгаад дахин оролдоно уу. Эсвэл файлыг шууд нээж үзэж болно.',
    retry: 'Дахин оролдох',
    openDirect: 'Шууд нээх',
    preparingPage: (page) => `${page}-р хуудсыг бэлтгэж байна`,
    zoomOut: 'Жижигрүүлэх',
    zoomIn: 'Томруулах',
    prevPage: 'Өмнөх хуудас',
    nextPage: 'Дараагийн хуудас',
    pageOf: (title) => `${title}, хуудас `,
  },
  audio: {
    section: 'Сонсгол материал',
    loading: 'Аудио ачаалж байна, түр хүлээнэ үү',
    buffering: 'Аудио үргэлжлүүлэн ачаалж байна…',
    loadingMessage: (mb) => `Сонсгол файл ${mb} MB хэмжээтэй тул эхлэхэд хэдэн секунд шаардагдана.`,
    error: 'Аудиог ачаалж чадсангүй. Интернэт холболтоо шалгаад тоглуулах товчийг дахин дарна уу.',
    play: 'Тоглуулах',
    pause: 'Түр зогсоох',
    position: 'Аудионы байрлал',
    back10: '10 секунд буцах',
    forward10: '10 секунд урагшлах',
    seconds: 'с',
    speed: 'Тоглуулах хурд',
  },
  footer: { rights: 'Бүх эрх хуулиар хамгаалагдсан.' },
}

export const dictionaries: Record<Locale, Dictionary> = { en, mn }
