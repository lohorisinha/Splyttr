const Tesseract = require('tesseract.js');

const extractReceiptItems = async (base64Image) => {
  // Convert base64 to buffer
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
    logger: m => {
      if (m.status === 'recognizing text') {
        console.log(`📄 OCR progress: ${Math.round(m.progress * 100)}%`);
      }
    }
  });

  console.log('📄 Raw OCR text:\n', text);

  return parseReceiptText(text);
};

const parseReceiptText = (text) => {
  const lines = text.split('\n');
  const items = [];

  const priceRegex = /(?:rs\.?|₹|inr|eur|€|\$)?\s*(\d{1,5}[.,]\d{0,2})\s*[a-zA-Z%]?\s*$/i;

  const skipWords = [
    'total', 'subtotal', 'tax', 'tip', 'amount', 'gst',
    'cgst', 'sgst', 'bill', 'troco', 'dinheiro', 'taxa',
    'change', 'cash', 'paid', 'discount', 'service charge',
    'vat', 'grand total', 'net total', 'balance', 'contribuinte',
    'produtor', 'eur/kg', 'kg x', 'obrigado', 'devolucao',
    'base imp', 'val.total', 'val.iva', 'imp.',
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(priceRegex);
    if (!match) continue;

    const price = parseFloat(match[1].replace(',', '.'));
    if (price <= 0 || price >= 10000) continue;

    const name = trimmed
      .slice(0, trimmed.lastIndexOf(match[0]))
      .replace(/\s+\d{8,}$/, '')
      .replace(/[.\-_*]+$/, '')
      .trim();

    if (!name || name.length < 2) continue;

    // Skip quantity lines like "2 x 1,29" or "6 x 0,29"
    if (/^\d+\s*x\s*\d/i.test(name)) continue;

    // Skip lines that are just "2x" or "6x"
    if (/^\d+x$/i.test(name)) continue;

    // Skip tax rate lines like "B 6%" or "C 13%"
    if (/^[a-z]\s*\d+%/i.test(name)) continue;

    // Skip weight lines like "0,540 kg x 1,49"
    if (/^\d+[.,]\d+\s*kg/i.test(name)) continue;

    // Skip if name is too short or just numbers
    if (/^\d+$/.test(name)) continue;

    const isSkip = skipWords.some(word =>
      name.toLowerCase().includes(word)
    );
    if (isSkip) continue;

    items.push({ name, price });
  }

  return items;
};

module.exports = { extractReceiptItems };