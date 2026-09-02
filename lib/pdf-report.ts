import { reportSystemError } from '@/components/error-handling-provider';

function pdfEscape(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/[^\x20-\x7E]/g, '-');
}

const encoder = new TextEncoder();

function bytes(value: string) {
  return encoder.encode(value);
}

function join(parts: Uint8Array[]) {
  const length = parts.reduce((total, part) => total + part.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  parts.forEach((part) => { result.set(part, offset); offset += part.length; });
  return result;
}

async function loadLogoJpeg() {
  const response = await fetch('/bano-qabil-official.png');
  if (!response.ok) throw new Error('Unable to load the Bano Qabil logo.');
  const bitmap = await createImageBitmap(await response.blob());
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to prepare the Bano Qabil logo.');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Unable to encode the Bano Qabil logo.')), 'image/jpeg', 0.94));
  return new Uint8Array(await blob.arrayBuffer());
}

export async function downloadBanoQabilReport({ title, subtitle, preparedBy, sections }: { title: string; subtitle: string; preparedBy: string; sections: Array<{ label: string; value: string }> }) {
  try {
    const logo = await loadLogoJpeg();
    const lines = [
    '0.02 0.34 0.38 rg 0 742 612 50 re f',
    '1 1 1 rg 39 745 46 44 re f',
    'q 40 0 0 40 42 747 cm /Im1 Do Q',
    'BT /F1 18 Tf 1 1 1 rg 94 764 Td (BanoQabil One) Tj ET',
    `BT /F1 17 Tf 0.04 0.12 0.30 rg 42 700 Td (${pdfEscape(title)}) Tj ET`,
    `BT /F1 10 Tf 0.35 0.40 0.48 rg 42 680 Td (${pdfEscape(subtitle)}) Tj ET`,
    `BT /F1 10 Tf 0.20 0.28 0.38 rg 42 645 Td (Prepared by: ${pdfEscape(preparedBy)}) Tj ET`,
    `BT /F1 10 Tf 0.20 0.28 0.38 rg 42 628 Td (Generated: ${pdfEscape(new Date().toLocaleString())}) Tj ET`,
    '0.88 0.91 0.94 RG 42 610 m 570 610 l S',
    ...sections.flatMap((section, index) => {
      const y = 570 - index * 42;
      return [`BT /F1 9 Tf 0.40 0.45 0.52 rg 42 ${y} Td (${pdfEscape(section.label.toUpperCase())}) Tj ET`, `BT /F1 12 Tf 0.04 0.18 0.35 rg 220 ${y} Td (${pdfEscape(section.value)}) Tj ET`];
    }),
    '0.02 0.34 0.38 rg 0 0 612 38 re f',
    'BT /F1 9 Tf 1 1 1 rg 42 15 Td (BanoQabil One - Empowering Pakistan Through Digital Skills) Tj ET',
    'BT /F1 9 Tf 1 1 1 rg 540 15 Td (Page 1) Tj ET',
    ];
    const stream = bytes(lines.join('\n'));
    const objects = [
    bytes('<< /Type /Catalog /Pages 2 0 R >>'),
    bytes('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    bytes('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> /XObject << /Im1 5 0 R >> >> /Contents 6 0 R >>'),
    bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'),
    join([bytes(`<< /Type /XObject /Subtype /Image /Width 600 /Height 600 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.length} >>\nstream\n`), logo, bytes('\nendstream')]),
    join([bytes(`<< /Length ${stream.length} >>\nstream\n`), stream, bytes('\nendstream')]),
    ];
    const parts = [bytes('%PDF-1.4\n')];
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(parts.reduce((total, part) => total + part.length, 0));
      parts.push(bytes(`${index + 1} 0 obj\n`), object, bytes('\nendobj\n'));
    });
    const xref = parts.reduce((total, part) => total + part.length, 0);
    parts.push(bytes(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\n`));
    parts.push(bytes(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`));
    const url = URL.createObjectURL(new Blob([join(parts)], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    reportSystemError(error, 'Report generation failed');
  }
}
