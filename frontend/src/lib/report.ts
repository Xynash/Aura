import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportData {
  pod: string;
  file: string;
  method: string;
  node: string;
  analysis: string;
}

type RGB = [number, number, number];

const clean = (t: string): string =>
  t
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2192/g, '->')
    .replace(/[\u2022\u25CF]/g, '-')
    .replace(/[\u00A0\u202F]/g, ' ')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');

const inline = (t: string): string =>
  clean(t)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1');

export function downloadReportPdf(r: ReportData): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  const maxW = W - M * 2;
  let y = 0;

  const ensure = (need: number) => {
    if (y + need > H - M) {
      doc.addPage();
      y = M;
    }
  };

  const write = (
    text: string, size: number, style: 'normal' | 'bold',
    indent = 0, color: RGB = [40, 40, 40], gap = 4,
  ) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const wrapped = doc.splitTextToSize(text, maxW - indent) as string[];
    const lh = size * 1.4;
    for (const line of wrapped) {
      ensure(lh);
      doc.text(line, M + indent, y + size);
      y += lh;
    }
    y += gap;
  };

  const codeBlock = (buf: string[]) => {
    const size = 8.5;
    const lh = size * 1.4;
    doc.setFont('courier', 'normal');
    doc.setFontSize(size);
    const wrapped = buf.flatMap(
      (l) => doc.splitTextToSize(l.replace(/\t/g, '  ') || ' ', maxW - 16) as string[],
    );
    for (const l of wrapped) {
      ensure(lh);
      doc.setFillColor(243, 244, 246);
      doc.rect(M, y - 1, maxW, lh + 1, 'F');
      doc.setTextColor(30, 30, 30);
      doc.text(l, M + 8, y + size);
      y += lh;
    }
    y += 8;
  };

  // Header band
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 72, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(190, 243, 94);
  doc.text('AURA', M, 45);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Root Cause Analysis Report', M + 70, 44);

  autoTable(doc, {
    startY: 92,
    body: [
      ['Service', clean(r.pod)],
      ['Source file', clean(r.file)],
      ['Method', clean(r.method)],
      ['AI node', clean(r.node)],
      ['Model', 'gpt-oss-120b (Groq)'],
      ['Generated', clean(new Date().toLocaleString())],
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 6, textColor: [40, 40, 40] },
    columnStyles: { 0: { fontStyle: 'bold', fillColor: [240, 242, 246], cellWidth: 100 } },
    margin: { left: M, right: M },
  });
  y = ((doc as any).lastAutoTable?.finalY ?? 200) + 24;

  const lines = clean(String(r.analysis || '')).split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { y += 4; i++; continue; }

    if (line.startsWith('```')) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      codeBlock(buf);
      continue;
    }

    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const t = lines[i].trim();
        if (!/^[\s|:-]+$/.test(t)) {
          const cells = t.split('|').map((c) => inline(c.trim()));
          cells.shift();
          if (cells.length && cells[cells.length - 1] === '') cells.pop();
          rows.push(cells);
        }
        i++;
      }
      if (rows.length) {
        const cols = Math.max(...rows.map((x) => x.length));
        const pad = (x: string[]) => { while (x.length < cols) x.push(''); return x; };
        ensure(40);
        autoTable(doc, {
          startY: y,
          head: [pad(rows[0])],
          body: rows.slice(1).map(pad),
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 5, textColor: [40, 40, 40], overflow: 'linebreak' },
          headStyles: { fillColor: [15, 23, 42], textColor: [190, 243, 94] },
          margin: { left: M, right: M },
        });
        y = ((doc as any).lastAutoTable?.finalY ?? y) + 14;
      }
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const size = h[1].length === 1 ? 16 : h[1].length === 2 ? 14 : 12;
      ensure(size * 2.5);
      y += 6;
      write(inline(h[2]), size, 'bold', 0, [15, 23, 42], 6);
      i++;
      continue;
    }

    const boldOnly = line.match(/^\*\*(.+?)\*\*:?$/);
    if (boldOnly) {
      ensure(36);
      y += 4;
      write(inline(boldOnly[1]), 12.5, 'bold', 0, [15, 23, 42], 5);
      i++;
      continue;
    }

    const b = line.match(/^[-*+]\s+(.*)$/);
    if (b) {
      write('- ' + inline(b[1]), 10.5, 'normal', 12, [40, 40, 40], 3);
      i++;
      continue;
    }

    const n = line.match(/^(\d+[.)])\s+(.*)$/);
    if (n) {
      write(n[1] + ' ' + inline(n[2]), 10.5, 'normal', 12, [40, 40, 40], 3);
      i++;
      continue;
    }

    write(inline(line), 10.5, 'normal', 0, [40, 40, 40], 5);
    i++;
  }

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text('Aura RCA - ' + clean(r.pod) + ' - page ' + p + ' of ' + pages, M, H - 24);
  }

  const safe = clean(r.pod).replace(/[^a-zA-Z0-9-]/g, '') || 'service';
  doc.save('aura-rca-' + safe + '-' + new Date().toISOString().slice(0, 10) + '.pdf');
}
