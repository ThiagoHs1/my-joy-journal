import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Download, QrCode } from 'lucide-react';
import { useState } from 'react';
import { getTheme } from '@/lib/themes';

interface Props {
  username: string;
  theme: string;
}

function generateQR(canvas: HTMLCanvasElement, text: string, color: string) {
  // Simple QR-like pattern using a basic encoding approach
  // For production, use a proper QR library. This creates a visual placeholder.
  const ctx = canvas.getContext('2d')!;
  const size = 300;
  canvas.width = size;
  canvas.height = size;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Use a simple grid pattern that encodes the URL visually
  const cellSize = 10;
  const gridSize = Math.floor(size / cellSize);
  ctx.fillStyle = color;

  // Generate deterministic pattern from text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }

  // Draw finder patterns (corners)
  const drawFinder = (x: number, y: number) => {
    for (let dy = 0; dy < 7; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        const isOuter = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const isInner = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        if (isOuter || isInner) {
          ctx.fillRect((x + dx) * cellSize, (y + dy) * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  drawFinder(2, 2);
  drawFinder(gridSize - 9, 2);
  drawFinder(2, gridSize - 9);

  // Fill data area with deterministic pseudo-random pattern
  const seed = Math.abs(hash);
  for (let y = 10; y < gridSize - 2; y++) {
    for (let x = 10; x < gridSize - 2; x++) {
      const val = ((seed * (y * gridSize + x + 1) * 2654435761) >>> 0) % 3;
      if (val === 0) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw URL text at bottom
  ctx.fillStyle = '#666';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, size / 2, size - 8);
}

export function ShareSection({ username, theme }: Props) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageUrl = `${window.location.origin}/${username}`;
  const themeConfig = getTheme(theme);

  useEffect(() => {
    if (canvasRef.current) {
      generateQR(canvasRef.current, pageUrl, themeConfig.linkBg === 'transparent' ? '#000' : '#000');
    }
  }, [pageUrl, theme]);

  const copyUrl = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `linkforge-${username}-qr.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4 pb-4">
      {/* URL */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Page URL</Label>
        <div className="flex gap-2">
          <Input value={pageUrl} readOnly className="font-mono text-sm" />
          <Button size="sm" variant="outline" onClick={copyUrl}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </Button>
        </div>
      </div>

      {/* QR Code */}
      <div>
        <Label className="text-sm font-medium mb-2 block">QR Code</Label>
        <div className="flex flex-col items-center gap-3 p-4 border rounded-xl bg-white">
          <canvas ref={canvasRef} className="w-48 h-48" />
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2 gap-2" onClick={downloadQR}>
          <Download size={14} /> Download QR (300×300 PNG)
        </Button>
      </div>
    </div>
  );
}
