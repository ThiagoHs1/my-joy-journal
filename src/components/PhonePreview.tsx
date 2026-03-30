import { PageData } from '@/lib/types';
import { LinkBioContent } from './LinkBioContent';

interface PhonePreviewProps {
  data: PageData;
}

export function PhonePreview({ data }: PhonePreviewProps) {
  return (
    <div className="sticky top-8">
      <div className="phone-frame mx-auto" style={{ width: 320, height: 640 }}>
        <div className="relative w-full h-full rounded-[2.25rem] overflow-hidden bg-background">
          <div className="phone-notch" />
          <div className="h-full overflow-y-auto pt-10 pb-4 px-4 scrollbar-none">
            <LinkBioContent data={data} isPreview />
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-4">Live Preview</p>
    </div>
  );
}
