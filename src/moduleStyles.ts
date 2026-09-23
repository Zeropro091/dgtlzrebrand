export interface ModuleStyle {
  bg: string;
  border: string;
  accentText: string;
  dotClass: string;
  /** raw hex for meters/inline styles that can't use Tailwind classes */
  accentHex: string;
  /** solid inverted bg (bg + text only, no border extras) for active/open states */
  invertBg: string;
}

export function getModuleStyle(code: string): ModuleStyle {
  switch (code) {
    case 'DGT.LZ-OPS':
      return {
        bg: 'bg-electric-blue text-white',
        border: 'border-electric-blue',
        accentText: 'text-[#39FF14]',
        dotClass: 'dither-pattern',
        accentHex: '#0B17EF',
        invertBg: 'bg-electric-blue text-white'
      };
    case 'DGT.LZ-GTM':
      return {
        bg: 'bg-[#ff3b30] text-white',
        border: 'border-[#ff3b30]',
        accentText: 'text-[#39FF14]',
        dotClass: 'dither-pattern-3d',
        accentHex: '#ff3b30',
        invertBg: 'bg-[#ff3b30] text-white'
      };
    case 'DGT.LZ-AGENT':
      return {
        bg: 'bg-[#121212] text-[#39FF14]',
        border: 'border-[#39FF14]',
        accentText: 'text-white',
        dotClass: 'dither-pattern-dev',
        accentHex: '#39FF14',
        invertBg: 'bg-[#121212] text-[#39FF14]'
      };
    case 'DGT.LZ-INFRA':
      return {
        bg: 'bg-[#1a1b25] text-white border-b-2 border-electric-blue',
        border: 'border-electric-blue',
        accentText: 'text-electric-blue',
        dotClass: 'dither-pattern',
        accentHex: '#0B17EF',
        invertBg: 'bg-[#1a1b25] text-white'
      };
    case 'DGT.LZ-RECON':
      return {
        bg: 'bg-[#e5c158] text-black',
        border: 'border-[#e5c158]',
        accentText: 'text-electric-blue',
        dotClass: 'dither-pattern-other',
        accentHex: '#e5c158',
        invertBg: 'bg-[#e5c158] text-black'
      };
    case 'DGT.LZ-CONTENT':
      return {
        bg: 'bg-[#ff007f] text-white',
        border: 'border-[#ff007f]',
        accentText: 'text-[#39FF14]',
        dotClass: 'dither-pattern-3d',
        accentHex: '#ff007f',
        invertBg: 'bg-[#ff007f] text-white'
      };
    case 'DGT.LZ-VOICE':
      return {
        bg: 'bg-[#00d2ff] text-black',
        border: 'border-[#00d2ff]',
        accentText: 'text-white',
        dotClass: 'dither-pattern-dev',
        accentHex: '#00d2ff',
        invertBg: 'bg-[#00d2ff] text-black'
      };
    case 'DGT.LZ-RAG':
      return {
        bg: 'bg-[#7928ca] text-white',
        border: 'border-[#7928ca]',
        accentText: 'text-[#39FF14]',
        dotClass: 'dither-pattern',
        accentHex: '#7928ca',
        invertBg: 'bg-[#7928ca] text-white'
      };
    case 'DGT.LZ-FIN':
      return {
        bg: 'bg-[#10b981] text-black',
        border: 'border-[#10b981]',
        accentText: 'text-white',
        dotClass: 'dither-pattern-other',
        accentHex: '#10b981',
        invertBg: 'bg-[#10b981] text-black'
      };
    case 'DGT.LZ-DEV':
      return {
        bg: 'bg-white text-electric-blue border-y border-electric-blue',
        border: 'border-electric-blue',
        accentText: 'text-black',
        dotClass: 'dither-pattern-dev',
        accentHex: '#0B17EF',
        invertBg: 'bg-electric-blue text-white'
      };
    default:
      return {
        bg: 'bg-electric-blue text-white',
        border: 'border-electric-blue',
        accentText: 'text-[#39FF14]',
        dotClass: 'dither-pattern',
        accentHex: '#0B17EF',
        invertBg: 'bg-electric-blue text-white'
      };
  }
}
