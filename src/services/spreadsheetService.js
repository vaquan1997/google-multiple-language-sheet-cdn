import path from 'path';
import xlsx from 'xlsx';

const SPREADSHEET_PATH = path.join(__dirname, '../../data/sample/locales.xlsx');

export const readSpreadsheet = () => {
  const workbook = xlsx.readFile(SPREADSHEET_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  return data;
};

export const parseLanguageData = (data) => {
  const languages = {};

  data.forEach((row) => {
    const { locale, key, value } = row;
    if (!languages[locale]) {
      languages[locale] = {};
    }
    languages[locale][key] = value;
  });

  return languages;
};