export const languages = {
  en: 'English',
  id: 'Indonesia'
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experiences': 'Experience',
    'nav.projects': 'Projects',
    'about.downloadResume': 'Download Resume',
    'about.contactMe': 'Contact Me',
    'projects.moreProjects': 'Many more projects along the way',
    'experience.keyAchievements': 'Key Achievement',
    'stats.years': 'Years Experience',
    'stats.projects': 'Projects Shipped',
    'stats.companies': 'Companies',
    'stats.skills': 'Skills',
    'theme.toggle': 'Toggle dark / light theme',
    'lang.switchTo': 'Bahasa Indonesia'
  },
  id: {
    'nav.about': 'Tentang',
    'nav.skills': 'Keahlian',
    'nav.experiences': 'Pengalaman',
    'nav.projects': 'Proyek',
    'about.downloadResume': 'Unduh Resume',
    'about.contactMe': 'Hubungi Saya',
    'projects.moreProjects': 'Masih banyak project lainnya di sepanjang perjalanan',
    'experience.keyAchievements': 'Pencapaian Utama',
    'stats.years': 'Tahun Pengalaman',
    'stats.projects': 'Proyek Selesai',
    'stats.companies': 'Perusahaan',
    'stats.skills': 'Keahlian',
    'theme.toggle': 'Ganti tema gelap / terang',
    'lang.switchTo': 'English'
  }
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
