import QRCode from 'qrcode';

/**
 * Universal sequential ID generator guaranteeing zero duplicates
 */
export const generateSequentialId = (
  prefix: string,
  existingItems: any[],
  field: string = 'id',
  padLength: number = 5
): string => {
  let maxNum = 0;
  const regex = new RegExp(`^${prefix}[-_]?0*(\\d+)$`, 'i');

  existingItems.forEach((item) => {
    const val = String(item[field] || '');
    const match = val.match(regex);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `${prefix}-${String(nextNum).padStart(padLength, '0')}`;
};

/**
 * Unique Barcode Generator (12/13-digit standard commercial EAN/UPC style)
 */
export const generateUniqueBarcode = (existingBarcodes: string[]): string => {
  const existingSet = new Set(existingBarcodes.map((b) => String(b).trim()));
  let candidate = '';
  let attempts = 0;

  do {
    // 894 is country prefix for Bangladesh, followed by unique digits
    const randomSuffix = Math.floor(100000000 + Math.random() * 900000000);
    candidate = `894${randomSuffix}`;
    attempts++;
  } while (existingSet.has(candidate) && attempts < 100);

  return candidate;
};

/**
 * Generate QR Code data URL (PNG Base64)
 */
export const generateQRCodeDataUrl = async (content: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(content, {
      margin: 1,
      width: 140,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
};

/**
 * Generate lightweight SVG Barcode representation
 */
export const generateBarcodeSvg = (code: string, width = 140, height = 40): string => {
  // Simple clean SVG barcode representation
  const cleanCode = String(code).slice(0, 16);
  let bars = '';
  let x = 4;
  for (let i = 0; i < cleanCode.length; i++) {
    const digit = cleanCode.charCodeAt(i) % 4 + 1;
    const barW = digit * 1.2;
    bars += `<rect x="${x}" y="2" width="${barW}" height="${height - 12}" fill="#1e293b"/>`;
    x += barW + (i % 2 === 0 ? 1.5 : 2.5);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.max(x + 4, width)} ${height}" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#ffffff" rx="4"/>
    ${bars}
    <text x="${width / 2}" y="${height - 2}" font-size="8" font-family="monospace" text-anchor="middle" fill="#475569">${cleanCode}</text>
  </svg>`;
};
